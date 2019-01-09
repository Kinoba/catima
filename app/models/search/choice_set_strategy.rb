class Search::ChoiceSetStrategy < Search::BaseStrategy
  include Search::MultivaluedSearch

  permit_criteria :exact, :all_words, :one_word, :less_than, :less_than_or_equal_to, :greater_than, :greater_than_or_equal_to, :field_condition, :filter_field_slug, :category_field, :category_criteria => {}

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

    if criteria[:category_field].present?
      condition = criteria[:category_criteria].keys[0]
      criteria[condition] = criteria[:category_criteria][condition]
      @field = Field.find_by(slug: criteria[:category_field])
      p criteria

      return scope if @field.nil?

      scope = exact_search(scope, criteria[:exact], negate)
      scope = all_words_search(scope, criteria[:all_words], negate)
      scope = one_word_search(scope, criteria[:one_word], negate)
    else
      scope = search_data_matching_one_or_more(scope, criteria[:exact], negate)
    end

    scope = search_data_matching_one_or_more(scope, criteria[:any], false) if criteria[:any].present?

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

    criteria[criteria[:category_criteria].keys[0]] = criteria[:category_criteria][criteria[:category_criteria].keys[0]]

    klass = "Search::#{category_field.type.sub(/^Field::/, '')}Strategy"
    strategy = klass.constantize.new(category_field, locale)
    scope = strategy.search(
      scope.select('"parent_items".*')
        .from("items parent_items")
        .joins("LEFT JOIN items ON parent_items.data->>'#{field.uuid}' = items.id::text"),
      criteria)
    # scope = strategy.search(
    #   scope.joins("LEFT JOIN items ref_items ON items.data->>'#{field.uuid}' = ref_items.id::text"),
    #   criteria)

    scope
  end

  def exact_search(scope, exact_phrase, negate)
    return scope if exact_phrase.blank?

    sql_operator = "#{'NOT' if negate} ILIKE"
    scope.where("#{data_field_expr} #{sql_operator} ?", exact_phrase.strip.to_s)
  end

  def one_word_search(scope, str, negate)
    return scope if str.blank?

    sql_operator = "#{'NOT' if negate} ILIKE"
    words = str.split.map(&:strip)
    sql = words.map { |_| "#{data_field_expr} #{sql_operator} ?" }.join(" OR ")
    scope.where(sql, *words.map { |w| "%#{w}%" })
  end

  def all_words_search(scope, str, negate)
    return scope if str.blank?

    sql_operator = "#{'NOT' if negate} ILIKE"
    words = str.split.map(&:strip)
    sql = words.map { |_| "#{data_field_expr} #{sql_operator} ?" }.join(" AND ")
    scope.where(sql, *words.map { |w| "%#{w}%" })
  end
end
