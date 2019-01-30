module CatalogAdmin::SqlDumpHelper
  def render_header_comment(header)
    "\n--\t ••• #{header} •••\n\n"
  end

  def render_comment(comment)
    "-- #{comment}\n"
  end

  def render_footer_comment
    "\n-- ••••••\n\n"
  end

<<<<<<< HEAD
  def pretty_format_statement(statement)
    remove_ending_comma!(statement)
    add_return_carriages!(statement)
  end

  def remove_ending_comma!(statement)
    statement.gsub!(/,$/, '')
  end

  def add_return_carriages!(statement)
    statement.gsub!(/,/, ",\n")
  end

  def create_table(table_name, columns)
    pretty_format_statement(columns)

    "CREATE TABLE `#{table_name}` (\n#{columns}\n);\n\n"
  end

  def insert_into(table_name, columns, values)
    "INSERT INTO `#{table_name}`\n\t\t(#{columns})\nVALUES (#{values});\n\n"
  end

  def add_primary_key(table_name, primary_key_name)
    "ALTER TABLE `#{table_name}` ADD PRIMARY KEY (`#{primary_key_name}`);\n"
  end

  def add_foreign_key(table_name, fk_name, ref_table_name, ref_table_col)
    "ALTER TABLE `#{table_name}` ADD FOREIGN KEY (`#{fk_name}`) REFERENCES `#{ref_table_name}`(`#{ref_table_col}`);\n\n"
  end
=======
  def remove_ending_comma!(statement)
    statement.gsub!(/,$/, '')
  end
>>>>>>> WIP export to sql multiple references
end
