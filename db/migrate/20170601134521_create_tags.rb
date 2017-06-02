class CreateTags < ActiveRecord::Migration[5.0]
  def change
    create_table :tags do |t|
      t.float :x
      t.float :y
      t.references :character, foreign_key: true

      t.timestamps
    end
  end
end
