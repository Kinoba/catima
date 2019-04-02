require 'csv'

class Dump::CsvDump < ::Dump
  def initialize
  end

  def dump(catalog, directory)
    cat = Catalog.find_by(slug: catalog)
    raise "ERROR. Catalog '#{catalog}' not found." if cat.nil?

    # Check if directory exists; create if necessary,
    # if not empty raise an error.
    create_output_dir directory unless File.directory?(directory)

    # Write meta.json file. Contains information about
    # the dump, format version etc.
    write_meta directory

    cat.item_types.each do |item_type|
      File.write(File.join(directory, "#{item_type.slug}.csv"), '')
    end

    # First loop to check if there are categories among choices
    categories_fields = {}
    cat.items.each do |item|
      categories_fields[item.item_type.id] = []

      item.fields.each do |field|
        next unless field.is_a?(Field::ChoiceSet)

        value = field.value_for_item(item)
        next if value.blank?

        if field.multiple?
          value.each do |choice|
            next if choice.category.blank?

            choice.category.fields.map do |f|
              categories_fields[item.item_type.id] << f unless categories_fields[item.item_type.id].include?(f)
            end
          end
        elsif value.category.present?
          value.category.fields.each do |f|
            categories_fields[item.item_type.id] << f unless categories_fields[item.item_type.id].include?(f)
          end
        end
      end
    end

    cat.items.each do |item|
      CSV.open(File.join(directory, "#{item.item_type.slug}.csv"), "a+") do |csv|
        columns = item.fields.map(&:slug)

        if categories_fields[item.item_type.id].present?
          categories_fields[item.item_type.id].each do |field|
            columns << "#{Category.find(field.category_id)&.name}_#{field.slug}"
          end
        end

        csv << columns unless csv.include?(columns)

        values = item.fields.map { |f| f.field_value_for_all_item(item) }
        categories_fields[item.item_type.id].each do |f|
          values << f.field_value_for_all_item(item)
        end

        csv << values
      end
    end

    dump_files(cat, directory)
  end
end