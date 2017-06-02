Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'photos#show'

  resources :tags, only: [:index, :create, :destroy]
  resources :characters, only: [:index]
  resources :games, only: [:index, :create]
end
