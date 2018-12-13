# == Schema Information
#
# Table name: advanced_searches
#
#  catalog_id   :integer
#  created_at   :datetime         not null
#  creator_id   :integer
#  criteria     :json
#  id           :integer          not null, primary key
#  item_type_id :integer
#  locale       :string           default("en"), not null
#  updated_at   :datetime         not null
#  uuid         :string
#

class AdvancedSearchesController < ApplicationController
  include ControlsCatalog

  def new
    @advance_search_confs = @catalog.advanced_search_configurations
    build_advanced_search
    find_advanced_search_configuration

    if @advanced_search_config.present?
      @item_types = @advanced_search_config.item_types
      @fields = @advanced_search_config.field_set
    else
      @item_types = @advanced_search.item_types
      @fields = @advanced_search.fields
    end
  end

  def create
    build_advanced_search
    if @advanced_search.update(advanced_search_params)
      # return redirect_back(fallback_location: root_path)
      redirect_to(:action => :show, :uuid => @advanced_search)
    else
      render("new")
    end
  end

  def show
    find_advanced_search_or_redirect
  end

  private

  def build_advanced_search
    type = catalog.item_types.where(:slug => params[:item_type]).first
    p "-----------------------"
    p type
    @advanced_search = scope.new do |model|
      model.item_type = type || catalog.item_types.sorted.first
      model.creator = current_user if current_user.authenticated?
    end
  end

  def find_advanced_search_or_redirect
    model = scope.where(:uuid => params[:uuid]).first
    redirect_to(:action => :new) if model.nil?

    p "----------"
    p model

    @search = ItemList::AdvancedSearchResult.new(
      :model => model,
      :page => params[:page]
    )
  end

  def advanced_search_params
    search = ItemList::AdvancedSearchResult.new(:model => @advanced_search)
    search.permit_criteria(params.require(:advanced_search))
  end

  def find_advanced_search_configuration
    @advanced_search_config = AdvancedSearchConfiguration.find_by(id: params[:advanced_search_conf])
  end

  def scope
    catalog.advanced_searches
  end
end
