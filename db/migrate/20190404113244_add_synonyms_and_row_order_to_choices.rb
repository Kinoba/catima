class AddSynonymsAndRowOrderToChoices < ActiveRecord::Migration[5.2]
  def change
    change_table :choices, bulk: true do |t|
      t.jsonb :synonyms
      t.integer :row_order
    end
  end
end
