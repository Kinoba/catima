class Search::ChoiceSetStrategy < Search::BaseStrategy
  include Search::MultivaluedSearch

  permit_criteria :exact, :all_words, :one_word, :less_than, :less_than_or_equal_to, :greater_than, :greater_than_or_equal_to, :field_condition, :filter_field_slug, :category_field, :category_criteria

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

    p "_________________________________________________________________"
    p criteria
    p criteria[:category_field]
    p criteria[:category_criteria]

    scope = if criteria[:category_field].present?
              search_in_category_field(scope, criteria)
            else
              search_data_matching_one_or_more(scope, criteria[:exact], negate)
            end

    scope
  end

  private

  def choice_from_slug(slug)
    locale, name = slug.split("-", 2)
    return if name.blank?

    field.choices.short_named(name, locale).first
  end

  def search_in_category_field(scope, criteria)
    p "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    p criteria
    
    category_field = Field.find_by(slug: criteria[:category_field])

    criteria[:exact] = criteria[:category_criteria]

    klass = "Search::#{category_field.type.sub(/^Field::/, '')}Strategy"
    strategy = klass.constantize.new(category_field, locale)
    scope = strategy.search(
      scope.joins("LEFT JOIN items ref_items ON items.data->>'#{field.uuid}' = ref_items.id::text"),
      criteria)

    scope
  end
end
