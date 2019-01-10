class Search::DateTimeStrategy < Search::BaseStrategy
  permit_criteria :exact, :condition, :field_condition, :start => {}, :end => {}

  def keywords_for_index(item)
    date_for_keywords(item)
  end

  def search(scope, criteria)
    field_condition = criteria[:condition]
    negate = criteria[:field_condition] == "exclude"
    p "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
    p criteria[:start]
    # p criteria[:start][:exact]
    # p Time.zone.at(criteria[:start][:exact].to_i / 1000)
    # p Time.at(criteria[:start][:exact].to_i / 1000)
    # p Time.zone.at(criteria[:start][:exact].to_i / 1000).utc
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

      p scope.to_sql
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
    scope.where("#{convert_to_timestamp(concat_json_date)} #{sql_operator} to_timestamp(?, '#{field_date_format_to_sql_format}')", date_remove_utc(exact_date_time))
  end

  def inexact_search(scope, date_time, field_condition, negate)
    return scope if date_time.blank?

    case field_condition
    when "before"
      sql_operator = negate ? ">" : "<"
    when "after"
      sql_operator = negate ? "<" : ">"
    end

    scope.where("#{convert_to_timestamp(concat_json_date)} #{sql_operator} to_timestamp(?, '#{field_date_format_to_sql_format}')", date_remove_utc(date_time))
  end

  def concat_json_date
    "CONCAT(
      CASE WHEN items.data->'#{field.uuid}'->>'Y' IS NULL THEN '0000' ELSE LPAD(items.data->'#{field.uuid}'->>'Y', 4, '0') END,
      '-',
      CASE WHEN items.data->'#{field.uuid}'->>'M' IS NULL THEN '00' ELSE LPAD(items.data->'#{field.uuid}'->>'M', 1, '0') END,
      '-',
      CASE WHEN items.data->'#{field.uuid}'->>'D' IS NULL THEN '00' ELSE LPAD(items.data->'#{field.uuid}'->>'D', 1, '0') END,
      ' ',
      CASE WHEN items.data->'#{field.uuid}'->>'h' IS NULL THEN '00' ELSE LPAD(items.data->'#{field.uuid}'->>'h', 1, '0') END,
      ':',
      CASE WHEN items.data->'#{field.uuid}'->>'m' IS NULL THEN '00' ELSE LPAD(items.data->'#{field.uuid}'->>'m', 1, '0') END,
      ':',
      CASE WHEN items.data->'#{field.uuid}'->>'s' IS NULL THEN '00' ELSE LPAD(items.data->'#{field.uuid}'->>'s', 1, '0') END
    )"
  end

  def convert_to_timestamp(datetime)
    "to_timestamp(#{datetime}, '#{field_date_format_to_sql_format}')"
  end

  def field_date_format_to_sql_format
    case field.format
    when "Y"
      "YYYY"
    when "M"
      "MM"
    when "h"
      "hh24"
    when "YM"
      "YYYY-MM"
    when "MD"
      "MM-DD"
    when "hm"
      "hh24:mi"
    when "YMD"
      "YYYY-MM-DD"
    when "hms"
      "hh24:mi:ss"
    when "MDh"
      "MM-DD hh24"
    when "YMDh"
      "YYYY-MM-DD hh24"
    when "MDhm"
      "MM-DD hh24:mi"
    when "YMDhm"
      "YYYY-MM-DD hh24:mi"
    when "MDhms"
      "MM-DD hh24:mi:ss"
    when "YMDhms"
      "YYYY-MM-DD hh24:mi:ss"
    end
  end

  def date_remove_utc(date)
    case field.format
    when "Y"
      date.strftime("%Y")
    when "M"
      date.strftime("%m")
    when "h"
      date.strftime("%H")
    when "YM"
      date.strftime("%Y-%m")
    when "MD"
      date.strftime("%m-%d")
    when "hm"
      date.strftime("%H:M")
    when "YMD"
      date.strftime("%Y-%m-%d")
    when "hms"
      date.strftime("%H:%M:%S")
    when "MDh"
      date.strftime("%m-%d %H")
    when "YMDh"
      date.strftime("%Y-%m-%d %H")
    when "MDhm"
      date.strftime("%m-%d %H:%M")
    when "YMDhm"
      date.strftime("%Y-%m-%d %H:%M")
    when "MDhms"
      date.strftime("%m-%d %H:%M:%S")
    when "YMDhms"
      date.strftime("%Y-%m-%d %H:%M:%S")
    end
  end

  def interval_search(scope, start_date_time, end_date_time, field_condition, negate)
    return scope if start_date_time.blank? || end_date_time.blank?

    field_condition = "outside" if negate && field_condition == "between"
    field_condition = "between" if negate && field_condition == "outside"

    where_scope = ->(*where_query) { field_condition == "outside" ? scope.where.not(where_query) : scope.where(where_query) }

    where_scope.call(
      "#{convert_to_timestamp(concat_json_date)} BETWEEN to_timestamp(?, '#{field_date_format_to_sql_format}')
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
  #
  # def append_where_date_is_set(scope)
  #   scope.where("
  #     (items.data->'#{field.uuid}'->>'Y' <> '' AND items.data->'#{field.uuid}'->>'Y' IS NOT NULL)
  #     OR (items.data->'#{field.uuid}'->>'M' <> '' AND items.data->'#{field.uuid}'->>'M' IS NOT NULL)
  #     OR (items.data->'#{field.uuid}'->>'D' <> '' AND items.data->'#{field.uuid}'->>'D' IS NOT NULL)
  #     OR (items.data->'#{field.uuid}'->>'h' <> '' AND items.data->'#{field.uuid}'->>'h' IS NOT NULL)
  #     OR (items.data->'#{field.uuid}'->>'m' <> '' AND items.data->'#{field.uuid}'->>'m' IS NOT NULL)
  #     OR (items.data->'#{field.uuid}'->>'s' <> '' AND items.data->'#{field.uuid}'->>'s' IS NOT NULL)
  #   ")
  # end

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
