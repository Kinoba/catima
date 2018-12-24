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
      if %w[or exclude and].include?(criteria[:field_condition])
        items[criteria[:field_condition]] << strategy.search(original_scope, criteria)
      end
    end

    # AND relations are grouped together as well as OR relations because we don't know
    # the order of the field condition.
    # e.g.: (a OR b) AND c is not the same as (a AND b) OR c
    and_relations = items["and"].first
    items["and"].drop(1).each do |relation|
      and_relations = and_relations.merge(relation)
    end

    or_relations = items["or"].first
    items["or"].drop(1).each do |relation|
      or_relations = or_relations.or(relation)
    end

    p "FULL QUERY"
    # p and_relations.to_sql
    # p or_relations.to_sql
    return and_relations.or(or_relations) unless or_relations.blank?

    and_relations
  end

  def field_criteria(field)
    (criteria || {}).fetch(field.uuid, {}).with_indifferent_access
  end
end
