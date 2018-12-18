# Wraps the AdvancedSearch ActiveRecord model with all the actual logic for
# performing the search and paginating the results.
#
class ItemList::AdvancedSearchResult < ItemList
  include Search::Strategies

  attr_reader :model
  delegate :catalog, :item_type, :criteria, :locale, :to_param, :to => :model
  delegate :fields, :to => :item_type

  def initialize(model:, page:nil, per:nil)
    super(model.catalog, page, per)
    @model = model
  end

  def permit_criteria(params)
    permitted = {}
    strategies.each do |strategy|
      permitted[strategy.field.uuid] = strategy.permitted_keys
    end
    p permitted
    params.permit(:criteria => permitted)
  end

  private

  def unpaginaged_items
    original_scope = item_type.public_sorted_items
    items = {
      "and" => [],
      "or" => []
    }
    strategies.each do |strategy|
      # p "unpaginaged_items : #{scope.inspect}"
      criteria = field_criteria(strategy.field)
      p "°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°"
      p strategy
      p criteria
      items[criteria[:field_condition]] << strategy.search(original_scope, criteria) if %w[or exclude and].include?(criteria[:field_condition])

      case criteria[:field_condition]
      when 'or'
        # items = strategy.search(original_scope, criteria)
        # strategy_search = strategy.search(original_scope, criteria)
        # p "ORRRR"
        # p strategy_search.to_sql
        # items << strategy_search
      when 'exclude'
        items << strategy.search(original_scope, criteria)
      when 'and'
        # items << strategy.search(original_scope, criteria)
      end
    end

    # WORKING FOR AND
    relations = items["and"].first
    items["and"].drop(1).each do |relation|
      relations = relations.merge(relation)
    end

    relations = items["or"].first if relations.nil?
    items["or"].each do |relation|
      relations = relations.or(relation)
    end

    p "FULL QUERY"
    # p relations.to_sql
    relations
  end

  def field_criteria(field)
    (criteria || {}).fetch(field.uuid, {}).with_indifferent_access
  end
end
