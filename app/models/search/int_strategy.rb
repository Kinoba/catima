class Search::IntStrategy < Search::BaseStrategy
  permit_criteria :exact, :less_than, :less_than_or_equal_to, :greater_than, :greater_than_or_equal_to, :field_condition

  def keywords_for_index(item)
    raw_value(item)
  end

  def search(scope, criteria)
    negate = criteria[:field_condition] == "exclude"

    scope = exact_search(scope, criteria[:exact], negate)
    scope = less_than_search(scope, criteria[:less_than], negate)
    scope = less_than_or_equal_to_search(scope, criteria[:less_than_or_equal_to], negate)
    scope = greater_than_search(scope, criteria[:greater_than], negate)
    scope = greater_than_or_equal_to_search(scope, criteria[:greater_than_or_equal_to], negate)
    scope
  end

  private

  def exact_search(scope, exact_phrase, negate)
    return scope if exact_phrase.blank?

    sql_operator = "#{'NOT' if negate} ILIKE"
    scope.where("#{data_field_expr} #{sql_operator} ?", exact_phrase.strip.to_s)
  end

  def less_than_search(scope, exact_phrase, negate)
    return scope if exact_phrase.blank?

    sql_operator = negate ? ">=" : "<"
    scope.where("(#{data_field_expr})::int #{sql_operator} ?", exact_phrase.strip)
  end

  def less_than_or_equal_to_search(scope, exact_phrase, negate)
    return scope if exact_phrase.blank?

    sql_operator = negate ? ">" : "<="
    scope.where("(#{data_field_expr})::int #{sql_operator} ?", exact_phrase.strip)
  end

  def greater_than_search(scope, exact_phrase, negate)
    return scope if exact_phrase.blank?

    sql_operator = negate ? "<=" : ">"
    scope.where("(#{data_field_expr})::int #{sql_operator} ?", exact_phrase.strip)
  end

  def greater_than_or_equal_to_search(scope, exact_phrase, negate)
    return scope if exact_phrase.blank?

    sql_operator = negate ? "<" : ">="
    scope.where("(#{data_field_expr})::int #{sql_operator} ?", exact_phrase.strip)
  end
end
