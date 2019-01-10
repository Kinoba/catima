class Search::ReferenceStrategy < Search::BaseStrategy
  include Search::MultivaluedSearch

  permit_criteria :exact, :all_words, :one_word, :less_than, :less_than_or_equal_to, :greater_than, :greater_than_or_equal_to, :field_condition, :filter_field_slug, :condition, :default, :start => {}, :end => {}

  def keywords_for_index(item)
    primary_text_for_keywords(item)
  end

  def search(scope, criteria)
    p "__________________________________________________________________________________________"

    negate = criteria[:field_condition] == "exclude"

    p criteria
    p criteria[:exact]
    p criteria[:default]
    # User searched by tag
    if criteria[:default].present?
      criterias = criteria[:default].split(',')

      criteria[:default] = []
      criterias.each do |c|
        criteria[:default] << c
      end

      scope = search_data_matching_all(scope, criteria[:default], negate)
    end

    p "----------------------------------------------------------------------------------------------------------------------------------------"
    scope = search_in_ref_field(scope, criteria) if criteria[:filter_field_slug].present?

    scope
  end

  def browse(scope, item_id)
    search_data_matching_one_or_more(scope, item_id)
  end

  private

  def primary_text_for_keywords(item)
    ids = raw_value(item)
    return if ids.blank?

    ids = [ids] unless ids.is_a?(Array)
    ids.each_with_object([]) do |key, array|
      item = Item.find_by(id: key)
      array << item.default_display_name(locale) if item
    end
  end

  def search_in_ref_field(scope, criteria)
    p "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    p criteria
    p criteria[:filter_field_slug]
    ref_field = Field.find_by(slug: criteria[:filter_field_slug])
    p ref_field
    return scope if ref_field.nil?

    klass = "Search::#{ref_field.type.sub(/^Field::/, '')}Strategy"
    strategy = klass.constantize.new(ref_field, locale)
    scope = strategy.search(
      scope.select('"parent_items".*')
        .from("items parent_items")
        .joins("LEFT JOIN items ON parent_items.data->>'#{field.uuid}' = items.id::text"),
      criteria)
    p strategy.inspect
    scope
  end
end
