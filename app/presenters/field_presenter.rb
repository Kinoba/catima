class FieldPresenter
  attr_reader :view, :item, :field, :options
  delegate :t, :to => I18n
  delegate :uuid, :to => :field

  def initialize(view, item, field, options={})
    @view = view
    @item = item
    @field = field
    @options = options
  end

  def label
    field.name
  end

  def help
    i18n_key = field.model_name.i18n_key
    t("helpers.help.#{i18n_key}")
  end

  def value
    return nil if raw_value.blank?
    raw_value
  end

  def raw_value
    field.raw_value(item)
  end

  private

  def compact?
    options[:style] == :compact
  end

  def input_defaults(options)
    data = input_data_defaults(options.fetch(:data, {}))
    options.reverse_merge(:label => label, :data => data)
  end

  def input_data_defaults(data)
    return data unless field.belongs_to_category?
    data.reverse_merge("field-category" => field.category_id)
  end
end
