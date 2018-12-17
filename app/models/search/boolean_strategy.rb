class Search::BooleanStrategy < Search::BaseStrategy
  permit_criteria :exact, :field_condition

  def search(scope, criteria)
    exact_search(scope, criteria[:exact])
  end

  private

  def exact_search(scope, exact_phrase)
    return scope if exact_phrase.blank?

    scope.where("#{data_field_expr} = ?", exact_phrase.strip.to_s)
  end
end
