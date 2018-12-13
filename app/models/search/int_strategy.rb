class Search::IntStrategy < Search::BaseStrategy
  permit_criteria :exact, :less_than, :less_than_or_equal_to, :greater_than, :greater_than_or_equal_to

  def keywords_for_index(item)
    raw_value(item)
  end

  def search(scope, criteria)
    scope = exact_search(scope, criteria[:exact])
    scope = less_than_search(scope, criteria[:less_than])
    scope = less_than_or_equal_to_search(scope, criteria[:less_than_or_equal_to])
    scope = greater_than_search(scope, criteria[:greater_than])
    scope = greater_than_or_equal_to_search(scope, criteria[:greater_than_or_equal_to])
    scope
  end

  private

  def exact_search(scope, exact_phrase)
    return scope if exact_phrase.blank?

    scope.where("#{data_field_expr} ILIKE ?", exact_phrase.strip.to_s)
  end

  def less_than_search(scope, exact_phrase)
    return scope if exact_phrase.blank?

    scope.where("(#{data_field_expr})::int < ?", exact_phrase.strip)
  end

  def less_than_or_equal_to_search(scope, exact_phrase)
    return scope if exact_phrase.blank?

    scope.where("(#{data_field_expr})::int <= ?", exact_phrase.strip)
  end

  def greater_than_search(scope, exact_phrase)
    return scope if exact_phrase.blank?

    scope.where("(#{data_field_expr})::int > ?", exact_phrase.strip)
  end

  def greater_than_or_equal_to_search(scope, exact_phrase)
    return scope if exact_phrase.blank?

    scope.where("(#{data_field_expr})::int >= ?", exact_phrase.strip)
  end
end
