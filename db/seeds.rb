# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Character.destroy_all
Game.destroy_all
Tag.destroy_all

characters = %w(Waldo Wenda Odlaw Wizard\ Whitebeard Woof)

characters.each do |c|
  Character.create!(name: c);
end

Game.create!(name: 'Person', time: 123);
