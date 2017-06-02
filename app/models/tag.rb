class Tag < ApplicationRecord
  belongs_to :character

  validates :character, uniqueness: true
end
