# Code that is common between fields that are numbered, such as
# Decimal and Int.
module Search::NumberedSearch
  private

  def exact_search(scope, exact_phrase, negate)
    return scope if exact_phrase.blank?

    sql_operator = "#{'NOT' if negate} ILIKE"
    scope.where("#{data_field_expr} #{sql_operator} ?", exact_phrase.strip.to_s)
  end

  def less_than_search(scope, exact_phrase, negate, type="int")
    return scope if exact_phrase.blank?

    sql_operator = negate ? ">=" : "<"
    scope.where("(#{data_field_expr})::#{type} #{sql_operator} ?", exact_phrase.strip)
  end

  def less_than_or_equal_to_search(scope, exact_phrase, negate, type="int")
    return scope if exact_phrase.blank?

    sql_operator = negate ? ">" : "<="
    scope.where("(#{data_field_expr})::#{type} #{sql_operator} ?", exact_phrase.strip)
  end

  def greater_than_search(scope, exact_phrase, negate, type="int")
    return scope if exact_phrase.blank?

    sql_operator = negate ? "<=" : ">"
    scope.where("(#{data_field_expr})::#{type} #{sql_operator} ?", exact_phrase.strip)
  end

  def greater_than_or_equal_to_search(scope, exact_phrase, negate, type="int")
    return scope if exact_phrase.blank?

    sql_operator = negate ? "<" : ">="
    scope.where("(#{data_field_expr})::#{type} #{sql_operator} ?", exact_phrase.strip)
  end
end
