class Field::DateTimePresenter < FieldPresenter
  delegate :l, :to => :view

  def value
    # TODO: format according to granularity of the field
    date = field.value_as_time_with_zone(item)
    date && l(date, :format => :long)
  end

  def input(form, method, options={})
    # TODO: format according to granularity of the field
    form.datetime_select(
      "#{method}_time",
      input_defaults(options).merge(
        :include_seconds => true,
        :include_blank => true
      )
    )
  end
end