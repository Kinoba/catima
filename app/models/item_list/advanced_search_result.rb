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

    return original_scope if criteria.blank?

    items_strategies = {
      "and" => [],
      "or" => [],
      "exclude" => []
    }
    strategies.each do |strategy|
      # p "unpaginaged_items : #{scope.inspect}"
      criteria = field_criteria(strategy.field)
      p "°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°"
      p strategy
      p criteria

      # Simple fields
      if %w[or exclude and].include?(criteria[:field_condition])
        items_strategies[criteria[:field_condition]] << strategy.search(original_scope, criteria)
      end

      # React complex fields that can have multiple values
      next if criteria["0"].blank?

      criteria.keys.each do |key|
        if %w[or exclude and].include?(criteria[key][:field_condition])
          items_strategies[criteria[key][:field_condition]] << strategy.search(original_scope, criteria[key])
        end
      end
    end

    # AND relations are grouped together as well as OR relations because we don't know
    # the order of the field condition.
    # e.g.: (a OR b) AND c is not the same as (a AND b) OR c
    and_relations = items_strategies["and"].first
    items_strategies["and"].drop(1).each do |relation|
      and_relations = and_relations.merge(relation)
    end

    or_relations = items_strategies["or"].first
    items_strategies["or"].drop(1).each do |relation|
      or_relations = or_relations.or(relation)
    end

    exclude_relations = items_strategies["exclude"].first
    items_strategies["exclude"].drop(1).each do |relation|
      exclude_relations = exclude_relations.merge(relation)
    end

    and_relations = and_relations.merge(exclude_relations) if exclude_relations.present?

    p "FULL QUERY"
    # p and_relations.to_sql
    # p or_relations.to_sql
    return and_relations.or(or_relations) if or_relations.present?

    and_relations
  end

  def field_criteria(field)
    (criteria || {}).fetch(field.uuid, {}).with_indifferent_access
  end
end
