class Search::ReferenceStrategy < Search::BaseStrategy
  include Search::MultivaluedSearch

  permit_criteria :exact, :all_words, :one_word, :less_than, :less_than_or_equal_to, :greater_than, :greater_than_or_equal_to, :field_condition

  def keywords_for_index(item)
    primary_text_for_keywords(item)
  end

  def search(scope, criteria)
    negate = criteria[:field_condition] == "exclude"
    scope = search_data_matching_one_or_more(scope, criteria[:exact], negate)

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
end
