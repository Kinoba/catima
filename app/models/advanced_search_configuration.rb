# == Schema Information
#
# Table name: advanced_search_configurations
#
#  catalog_id         :bigint(8)
#  created_at         :datetime         not null
#  creator_id         :integer
#  description        :jsonb
#  fields             :jsonb
#  id                 :bigint(8)        not null, primary key
#  item_type_id       :bigint(8)
#  slug               :string
#  title_translations :jsonb
#  updated_at         :datetime         not null
#

# Note: This is the ActiveRecord model for storing advanced search configurations created by an admin
#
class AdvancedSearchConfiguration < ApplicationRecord
  include HasTranslations
  include HasLocales

  delegate :item_types, :to => :catalog

  belongs_to :catalog
  belongs_to :creator, :class_name => "User", optional: true
  belongs_to :item_type, -> { active }

  store_translations :title

  validates_presence_of :catalog
  validates_presence_of :item_type
  validates_presence_of :title
  validates_presence_of :description

  serialize :description, HashSerializer
  locales :description

  def field_set
    field_set = []
    fields.each do |field_uuid, _position|
      field_set << Field.find_by(:uuid => field_uuid)
    end

    field_set
  end

  def sorted_fields
    fields.sort_by { |_key, order| order }.to_h
  end

  def available_fields
    item_type.sortable_list_view_fields.reject do |field|
      field_set.include?(field)
    end
  end

  def remove_field(field)
    gap_position = fields[field]
    fields.delete(field)
    self.fields = fields.transform_values do |position|
      if position > gap_position
        position - 1
      else
        position
      end
    end
  end

  def move_field_up(field)
    original_position = fields[field]

    self.fields = fields.transform_values do |position|
      case position
      when original_position - 1
        position + 1
      when original_position
        position - 1
      else
        position
      end
    end
  end

  def move_field_down(field)
    original_position = fields[field]

    self.fields = fields.transform_values do |position|
      case position
      when original_position + 1
        position - 1
      when original_position
        position + 1
      else
        position
      end
    end
  end
end
