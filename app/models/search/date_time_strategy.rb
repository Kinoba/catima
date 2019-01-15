class Search::DateTimeStrategy < Search::BaseStrategy
  permit_criteria :exact, :condition, :field_condition, :start => {}, :end => {}

  def keywords_for_index(item)
    date_for_keywords(item)
  end

  def search(scope, criteria)
    field_condition = criteria[:condition]
    negate = criteria[:field_condition] == "exclude"

    start_condition = criteria[:start].keys.first
    end_condition = criteria[:start].keys.first

    start_date_time = Time.zone.at(criteria[:start][start_condition].to_i / 1000) if start_date?(criteria)
    end_date_time = Time.zone.at(criteria[:end][end_condition].to_i / 1000) if end_date?(criteria)

    return scope unless start_date_time.present? || end_date_time.present?

    scope = append_where_date_is_set(scope)

    if start_date?(criteria)
      scope = exact_search(scope, start_date_time, negate) if field_condition == "exact"
      scope = inexact_search(scope, start_date_time, field_condition, negate) if %w[before after].include?(field_condition)
    end

    if end_date?(criteria)
      scope = interval_search(scope, start_date_time, end_date_time, field_condition, negate) if %w[outside between].include?(field_condition)
    end

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
    condition = criteria[:start].keys.first
    criteria[:start].present? && criteria[:start][condition].present?
  end

  def end_date?(criteria)
    criteria[:end].present? && criteria[:end][criteria[:end].keys.first].present?
  end

  def exact_search(scope, exact_date_time, negate)
    return scope if exact_date_time.blank?

    sql_operator = "#{'<>' if negate} ="
    scope.where("#{convert_to_timestamp(concat_json_date(exact_date_time))} #{sql_operator} to_timestamp(?, '#{field_date_format_to_sql_format}')", date_remove_utc(exact_date_time))
  end

  def inexact_search(scope, date_time, field_condition, negate)
    return scope if date_time.blank?

    case field_condition
    when "before"
      sql_operator = negate ? ">" : "<"
    when "after"
      sql_operator = negate ? "<" : ">"
    end

    scope.where("#{convert_to_timestamp(concat_json_date(date_time))} #{sql_operator} to_timestamp(?, '#{field_date_format_to_sql_format}')", date_remove_utc(date_time))
  end

  def concat_json_date(datetime)
    "CONCAT(
      CASE WHEN items.data->'#{field.uuid}'->>'Y' IS NULL THEN '#{datetime.strftime("%Y")}' ELSE LPAD(items.data->'#{field.uuid}'->>'Y', 4, '0') END,
      '-',
      CASE WHEN items.data->'#{field.uuid}'->>'M' IS NULL THEN '#{datetime.strftime("%m")}' ELSE LPAD(items.data->'#{field.uuid}'->>'M', 2, '0') END,
      '-',
      CASE WHEN items.data->'#{field.uuid}'->>'D' IS NULL THEN '#{datetime.strftime("%d")}' ELSE LPAD(items.data->'#{field.uuid}'->>'D', 2, '0') END,
      ' ',
      CASE WHEN items.data->'#{field.uuid}'->>'h' IS NULL THEN '#{datetime.strftime("%H")}' ELSE LPAD(items.data->'#{field.uuid}'->>'h', 2, '0') END,
      ':',
      CASE WHEN items.data->'#{field.uuid}'->>'m' IS NULL THEN '#{datetime.strftime("%M")}' ELSE LPAD(items.data->'#{field.uuid}'->>'m', 2, '0') END,
      ':',
      CASE WHEN items.data->'#{field.uuid}'->>'s' IS NULL THEN '#{datetime.strftime("%S")}' ELSE LPAD(items.data->'#{field.uuid}'->>'s', 2, '0') END
    )"
  end

  def convert_to_timestamp(datetime)
    "to_timestamp(#{datetime}, '#{field_date_format_to_sql_format}')"
  end

  def field_date_format_to_sql_format
    "YYYY-MM-DD hh24:mi:ss"
  end

  def date_remove_utc(date)
    date.strftime("%Y-%m-%d %H:%M:%S")
  end

  def interval_search(scope, start_date_time, end_date_time, field_condition, negate)
    return scope if start_date_time.blank? || end_date_time.blank?

    field_condition = "outside" if negate && field_condition == "between"
    field_condition = "between" if negate && field_condition == "outside"

    where_scope = ->(*where_query) { field_condition == "outside" ? scope.where.not(where_query) : scope.where(where_query) }

    where_scope.call(
      "#{convert_to_timestamp(concat_json_date(start_date_time))} BETWEEN to_timestamp(?, '#{field_date_format_to_sql_format}')
      AND to_timestamp(?, '#{field_date_format_to_sql_format}')",
      date_remove_utc(start_date_time),
      date_remove_utc(end_date_time)
    )
  end

  def append_where_date_is_set(scope)
    scope.where("
      items.data->'#{field.uuid}' IS NOT NULL
    ")
  end
end
