class Search::ChoiceSetStrategy < Search::BaseStrategy
  include Search::MultivaluedSearch

  # For multiple choices, we permit all possible choices in the choice set
  def permitted_keys
    keys = []
    field.choices.each do |choice|
      keys << choice.id
    end

    keys
  end

  def keywords_for_index(item)
    choices = field.selected_choices(item)
    choices.flat_map { |choice| [choice.short_name, choice.long_name] }
  end

  def browse(scope, choice_slug)
    choice = choice_from_slug(choice_slug)
    return scope.none if choice.nil?

    search(scope, :any => [choice.id.to_s])
  end

  def search(scope, criteria)
    negate = criteria[:field_condition] == "exclude"
    search_data_matching_one_or_more(scope, criteria[:any], negate)
  end

  private

  def choice_from_slug(slug)
    locale, name = slug.split("-", 2)
    return if name.blank?

    field.choices.short_named(name, locale).first
  end
end
