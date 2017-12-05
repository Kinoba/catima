# rubocop:disable Rails/OutputSafety
class ItemViewPresenter
  attr_reader :view, :item_view, :options
  delegate :item_path, :to => :view

  def initialize(view, item_view, item, locale, options={})
    @view = view
    @item_view = item_view
    @item = item
    @locale = locale
    @options = options
  end

  def render
    tpl = JSON.parse(@item_view.template)
    local_tpl = tpl[@locale.to_s] || ''
    item_link = item_path(item_type_slug: @item.item_type, id: @item)
    local_tpl = local_tpl.sub('{{_itemLink}}', item_link)
    @item.fields.each do |field|
      presenter = "#{field.class.name}Presenter".constantize.new(@view, @item, field, {})
      local_tpl = local_tpl.sub('{{' + field.slug + '}}', presenter.value || '')
    end
    local_tpl.html_safe
  end
end
