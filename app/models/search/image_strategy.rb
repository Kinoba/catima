class Search::ImageStrategy < Search::BaseStrategy
  def keywords_for_index(item)
    return if @field.legend.to_i.zero?
    return unless raw_value(item)
    return legend_from_hash(raw_value(item)) if raw_value(item).is_a?(Hash)
    raw_value(item).flat_map { |image| [legend_from_hash(image)] }.compact
  end

  private

  def legend_from_hash(hash)
    hash.key?("legend") ? hash.fetch("legend") : nil
  end
end
