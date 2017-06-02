class GamesController < ApplicationController
  def index
    @games = Game.order('time ASC').limit(5)

    respond_to do |f|
      f.html
      f.json { render json: @games, status: :ok}
    end
  end
end
