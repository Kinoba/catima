# == Schema Information
#
# Table name: items
#
#  catalog_id     :integer
#  created_at     :datetime         not null
#  creator_id     :integer
#  data           :jsonb
#  id             :integer          not null, primary key
#  item_type_id   :integer
#  review_status  :string           default("not-ready"), not null
#  reviewer_id    :integer
#  search_data_de :text
#  search_data_en :text
#  search_data_fr :text
#  search_data_it :text
#  updated_at     :datetime         not null
#  updater_id     :integer
#  uuid           :string
#  views          :jsonb
#

class Item < ApplicationRecord
  include DataStore::Macros
  include Item::Values
  include Review::Macros
  include Search::Macros
  include HasHumanId

  human_id :primary_text_value

  delegate :field_for_select, :primary_field, :referenced_by_fields,
           :fields, :list_view_fields, :all_fields, :all_public_list_view_fields, :all_list_view_fields,
           :to => :item_type

  belongs_to :catalog
  belongs_to :item_type
  belongs_to :creator, :class_name => "User"
  belongs_to :updater, :class_name => "User"
  has_many :favorites, :dependent => :destroy

  validates_presence_of :catalog
  validates_presence_of :creator
  validates_presence_of :updater
  validates_presence_of :item_type
  validate :unique_value_fields

  # assign default and auto-increment field values
  after_initialize :assign_default_values
  after_initialize :assign_autoincrement_values
  before_create :assign_uuid

  after_commit :update_views_cache, if: proc { |record| record.saved_changes.key?(:data) }

  def self.sorted_by_field(field)
    sql = []
    sql << order_by_field_type(field) unless field.nil?
    sql << "created_at DESC"
    return order(Arel.sql(sql.join(", "))) unless !field.nil? && field.type == Field::TYPES['reference']

    joins("LEFT JOIN items ref_items ON ref_items.id::text = items.data->>'#{field.uuid}'")
      .order(Arel.sql(sql.join(", ")))
  end

  def self.with_type(type)
    return all if type.nil?

    where(:item_type => type)
  end

  # The same as `all_fields`, but removes category-based fields that do not
  # apply to this item.
  def applicable_fields
    all_fields.select { |f| f.applicable_to_item(self) }
  end

  # The same as `all_list_view_fields`, but removes category-based fields that
  # do not apply to this item.
  def applicable_list_view_fields
    all_public_list_view_fields.select { |f| f.applicable_to_item(self) }
  end

  def behaving_as_type
    @behaving_as_type ||= begin
      casted = becomes(typed_item_class)
      # Clear errors so that it gets recreated pointed to the new casted item
      casted.instance_variable_set(:@errors, nil)
      casted
    end
  end

  # True if this item has an image as one of its list view fields.
  def image?
    list_view_fields.any? do |f|
      next unless f.is_a?(Field::Image)

      f.file_count(self) > 0
    end
  end

  def assign_uuid
    self.uuid ||= SecureRandom.uuid
  end

  # Returns a JSON representation of the item content.
  # It contains the field values for simple fields,
  # and an identifier for complex fields.
  def describe(includes=[], excludes=[])
    d = Hash[applicable_fields.collect { |f| [f.slug, get_value_or_id(f)] }] \
        .merge('id': id) \
        .merge('review_status': review_status) \
        .merge('uuid': uuid)

    includes.each { |i| d[i] = public_send(i) }
    excludes.each { |e| d.delete(e) }

    d
  end

  # Sets the value of an item field by UUID
  def set_by_uuid(uuid, value)
    behaving_as_type.update(uuid => value)
  end

  def default_display_name(locale=I18n.locale)
    v = views && views["display_name"] && views["display_name"][locale.to_s]
    return v unless v.nil?

    field = field_for_select
    return '' if field.nil?

    field.strip_extra_content(self, locale)
  end

  def view(type, locale=I18n.locale)
    (views[type.to_s] && views[type.to_s][locale.to_s]) || default_display_name(locale)
  end

  def self.order_by_field_type(field)
    case field.type
    when Field::TYPES['datetime'] then
      "data->'#{field.uuid}'->>'Y' ASC,
      data->'#{field.uuid}'->>'M::int' ASC,
      data->'#{field.uuid}'->>'D::int' ASC,
      data->'#{field.uuid}'->>'h::int' ASC,
      data->'#{field.uuid}'->>'m::int' ASC,
      data->'#{field.uuid}'->>'s::int' ASC"
    when Field::TYPES['int'] then
      "(data->>'#{field.uuid}')::int ASC"
    when Field::TYPES['decimal'] then
      "(data->>'#{field.uuid}')::float ASC"
    when Field::TYPES['reference'] then
      "(ref_items.data->>'#{field.related_item_type.primary_field.uuid}') ASC"
    else
      "data->>'#{field.uuid}' ASC"
    end
  end

  private

  def typed_item_class
    typed = Class.new(Item)
    typed.define_singleton_method(:name) { Item.name }
    typed.define_singleton_method(:model_name) { Item.model_name }
    all_fields.each { |f| f.decorate_item_class(typed) }
    typed
  end

  def update_views_cache
    ItemsCacheWorker.perform_async(catalog.slug, item_type.slug, id)
  end
end
