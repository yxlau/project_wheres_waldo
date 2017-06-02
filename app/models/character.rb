class Character < ApplicationRecord
  has_many :tags, dependent: :destroy

  def self.untagged
    return Character.includes(:tags).where(tags: {id: nil})
  end
end
