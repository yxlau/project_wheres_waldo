class Character < ApplicationRecord
  has_many :tags

  def self.untagged
    return Character.includes(:tags).where(tags: {id: nil})
  end
end
