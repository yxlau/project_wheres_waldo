class CreateTags < ActiveRecord::Migration[5.0]
  def change
    create_table :tags do |t|
      t.integer :x
      t.integer :y
      t.references :character, foreign_key: true

      t.timestamps
    end
  end
end
