class CharactersController < ApplicationController

  def index
    @characters = Character.untagged

    respond_to do |f|
      f.html
      f.json { render json: @characters, status: :ok}
    end
  end
end
