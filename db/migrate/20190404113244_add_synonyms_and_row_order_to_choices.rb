class AddSynonymsAndRowOrderToChoices < ActiveRecord::Migration[5.2]
  def change
    change_table :users, bulk: true do |t|
      t.jsonb :synonyms
      t.integer :row_order
    end
  end
end
