class AddSynonymsToChoices < ActiveRecord::Migration[5.2]
  def change
    add_column :choices, :synonyms, :jsonb
  end
end
