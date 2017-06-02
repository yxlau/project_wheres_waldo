class GamesController < ApplicationController
  def index
    @games = Game.order('time ASC').limit(5)

    respond_to do |f|
      f.html
      f.json { render json: @games, status: :ok}
    end
  end

  def create
    @game = Game.new(game_params)

    if @game.save
      respond_to do |f|
        f.html
        f.json { render json: {message: 'Game successfully saved'}, status: :ok}
      end
    else
      respond_to do |f|
        f.html
        f.json { render json: {message: 'Game not saved'}, status: :ok}
      end

    end
  end

  private

  def game_params
    params.require(:games).permit(:name, :time)
  end
end
