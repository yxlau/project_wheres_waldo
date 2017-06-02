class TagsController < ApplicationController

  def index
    @tags = Tag.all

    respond_to do |f|
      f.html
      f.json { render json: @tags.as_json(include: { character: {only: :name}}), status: :ok}
    end
  end

  def create
    @tag = Tag.new(tag_params)
    if @tag.save
      respond_to do |f|
        f.html
        f.json { render json: @tag, status: :created}
      end
    else
      respond_to do |f|
        f.html
        f.json { render json: {message: 'Destroyed'}, status: 400}
      end
    end
  end

  def destroy
    p '*' * 20
    p params
    @tag = Tag.find(params[:id])

    if @tag.destroy
      respond_to do |f|
        f.html
        f.json { render json: {message: 'Destroyed'}, status: :ok}
      end
    else
      respond_to do |f|
        f.html
        f.json { render json: {message: 'Destroyed'}, status: 400 }
      end
    end

  end

  private

  def tag_params
    params.require(:tag).permit(:x, :y, :character_id)
  end
end
