class Search::DateTimeStrategy < Search::BaseStrategy
  permit_criteria :exact, :condition, :field_condition, start: {}, end: {}

  def keywords_for_index(item)
    date_for_keywords(item)
  end

  def search(scope, criteria)
    field_condition = criteria[:condition]
    negate = criteria[:field_condition] == "exclude"
    p "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
    p criteria[:start]
    p criteria[:start][:exact]
    start_date_time = Time.zone.at(criteria[:start][:exact].to_i / 1000) if start_date?(criteria)
    end_date_time = Time.zone.at(criteria[:end][:exact].to_i / 1000) if end_date?(criteria)

    return scope unless start_date_time.present? || end_date_time.present?

    if start_date?(criteria)
      scope = exact_search(scope, start_date_time, negate) if field_condition == "exact"
      scope = inexact_search(scope, start_date_time, field_condition, negate) if %w[before after].include?(field_condition)
    end

    if end_date?(criteria)
      # TODO: between
      # TODO: outside
    end

    scope = append_where_date_is_set(scope)

    scope
  end

  private

  def date_for_keywords(item)
    return date_from_hash(raw_value(item)) if raw_value(item).is_a?(Hash)

    raw_value(item)
  end

  def date_from_hash(hash)
    hash.each_with_object([]) { |(_, v), array| array << v if v.present? }
  end

  def start_date?(criteria)
    criteria[:start].present? && criteria[:start][criteria[:start].keys.first].present?
  end

  def end_date?(criteria)
    criteria[:end].present? && criteria[:end][criteria[:end].keys.first].present?
  end

  def exact_search(scope, exact_date_time, negate)
    return scope if exact_date_time.blank?
    p exact_date_time
    p "NOOOOOOOOOOOOOOOOOOOOOOOOO?OOOO"

    sql_operator = "#{'NOT' if negate} LIKE"
    scope.where("#{convert_to_timestamp(concat_json_date)} #{sql_operator} to_timestamp(?, 'YYYY-MM-DD hh24:mi:ss')", exact_date_time)
    # scope.where("items.data->'#{field.uuid}'->>'Y' #{sql_operator} ?", exact_date_time.strftime("%Y"))
    #      .where("items.data->'#{field.uuid}'->>'M' #{sql_operator} ?", exact_date_time.strftime("%-m"))
    #      .where("items.data->'#{field.uuid}'->>'D' #{sql_operator} ?", exact_date_time.strftime("%-d"))
    #      .where("items.data->'#{field.uuid}'->>'h' #{sql_operator} ?", exact_date_time.strftime("%k"))
    #      .where("items.data->'#{field.uuid}'->>'m' #{sql_operator} ?", exact_date_time.strftime("%M"))
    #      .where("items.data->'#{field.uuid}'->>'s' #{sql_operator} ?", exact_date_time.strftime("%S"))
  end

  def inexact_search(scope, date_time, field_condition, negate)
    return scope if date_time.blank?

    case field_condition
    when "before"
      sql_operator = negate ? ">" : "<"
    when "after"
      sql_operator = negate ? "<" : ">"
    end

    scope.where("#{convert_to_timestamp(concat_json_date)} #{sql_operator} to_timestamp(?, 'YYYY-MM-DD hh24:mi:ss')", date_time)

    # scope = scope.where("items.data->'#{field.uuid}'->>'Y' #{like_sql_operator} ?", date_time.strftime("%Y"))
    #      .where("items.data->'#{field.uuid}'->>'M' #{sql_operator} ?", date_time.strftime("%-m"))
    # scope = scope.or(
    #        base_scope.where("items.data->'#{field.uuid}'->>'Y' #{like_sql_operator} ?", date_time.strftime("%Y"))
    #             .where("items.data->'#{field.uuid}'->>'M' #{like_sql_operator} ?", date_time.strftime("%-m"))
    #             .where("items.data->'#{field.uuid}'->>'D' #{sql_operator} ?", date_time.strftime("%-d"))
    #      )
    #      scope = scope.or(
    #        base_scope.where("items.data->'#{field.uuid}'->>'Y' #{like_sql_operator} ?", date_time.strftime("%Y"))
    #             .where("items.data->'#{field.uuid}'->>'M' #{like_sql_operator} ?", date_time.strftime("%-m"))
    #             .where("items.data->'#{field.uuid}'->>'D' #{like_sql_operator} ?", date_time.strftime("%-d"))
    #             .where("items.data->'#{field.uuid}'->>'h' #{sql_operator} ?", date_time.strftime("%k"))
    #      )
    #      scope = scope.or(
    #        base_scope.where("items.data->'#{field.uuid}'->>'Y' #{like_sql_operator} ?", date_time.strftime("%Y"))
    #             .where("items.data->'#{field.uuid}'->>'M' #{like_sql_operator} ?", date_time.strftime("%-m"))
    #             .where("items.data->'#{field.uuid}'->>'D' #{like_sql_operator} ?", date_time.strftime("%-d"))
    #             .where("items.data->'#{field.uuid}'->>'h' #{like_sql_operator} ?", date_time.strftime("%k"))
    #             .where("items.data->'#{field.uuid}'->>'m' #{sql_operator} ?", date_time.strftime("%M"))
    #      )
    #      scope = scope.or(
    #        base_scope.where("items.data->'#{field.uuid}'->>'Y' #{like_sql_operator} ?", date_time.strftime("%Y"))
    #             .where("items.data->'#{field.uuid}'->>'M' #{like_sql_operator} ?", date_time.strftime("%-m"))
    #             .where("items.data->'#{field.uuid}'->>'D' #{like_sql_operator} ?", date_time.strftime("%-d"))
    #             .where("items.data->'#{field.uuid}'->>'h' #{like_sql_operator} ?", date_time.strftime("%k"))
    #             .where("items.data->'#{field.uuid}'->>'m' #{like_sql_operator} ?", date_time.strftime("%M"))
    #             .where("items.data->'#{field.uuid}'->>'s' #{sql_operator} ?", date_time.strftime("%S"))
    #      )
  end

  def concat_json_date
    "CONCAT(
      LPAD(items.data->'#{field.uuid}'->>'Y', 4, '0'),
      '-',
      LPAD(items.data->'#{field.uuid}'->>'M', 1, '0'),
      '-',
      LPAD(items.data->'#{field.uuid}'->>'D', 1, '0'),
      ' ',
      LPAD(items.data->'#{field.uuid}'->>'h', 1, '0'),
      ':',
      LPAD(items.data->'#{field.uuid}'->>'m', 1, '0'),
      ':',
      LPAD(items.data->'#{field.uuid}'->>'s', 1, '0')
    )"
  end

  def convert_to_timestamp(datetime)
    "to_timestamp(#{datetime}, 'YYYY-MM-DD hh24:mi:ss')"
  end

  def append_where_date_is_set(scope)
    scope.where("
      items.data->'#{field.uuid}'->>'Y' <> ''
      OR items.data->'#{field.uuid}'->>'M' <> ''
      OR items.data->'#{field.uuid}'->>'D' <> ''
      OR items.data->'#{field.uuid}'->>'h' <> ''
      OR items.data->'#{field.uuid}'->>'m' <> ''
      OR items.data->'#{field.uuid}'->>'s' <> ''
    ")
  end

  # Translates the datetime_select form submission from flat into a hash with
  # numeric keys. Normally ActiveRecord does this, but since we aren't an
  # AR object, we have to do it manually.
  #
  # E.g., translates:
  #     {"before(3i)"=>"14", "before(2i)"=>"1", "before(1i)"=>"2015"}
  # Into:
  #     {"before"=>{2=>1, 1=>2015, 3=>14}}
  #
  def transform_datetime_keys(criteria)
    criteria.each_with_object({}) do |(key, value), result|
      if key.to_s =~ /^(.+)\((\d+)i\)$/
        int_or_nil = value.present? ? value.to_i : nil
        (result[$1] ||= {}).merge!($2.to_i => int_or_nil)
        result
      else
        result[key] = value
      end
    end.with_indifferent_access
  end

  def append_where(scope, operator, value)
    dt_int = value.collect { |k, v| (v.nil? ? 0 : v) * 10**(10 - 2 * (k - 1)) }.sum
    # time_with_zone = field.form_submission_as_time_with_zone(value)
    # return scope if time_with_zone.nil?
    return scope if dt_int == 0

    scope.where(
      "bigdate_to_num(cast(#{data_field_expr} AS json)) #{operator} ?",
      dt_int
    )
  end
end
