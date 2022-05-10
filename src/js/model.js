import {async} from 'regenerator-runtime';
import {getJSON} from './helpers';
import { API_URL } from './config';
import { RES_PER_PAGE } from './config';


export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1
  },
  bookmarks: []
};

export const loadRecipe = async function (id) {
    try{
      const data = await getJSON(`${API_URL}${id}`);
      const { recipe } = data.data;
      state.recipe = {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
      };

      if(state.bookmarks.some(bookmark => bookmark.id === id)){
        state.recipe.bookmarked = true;
      }
      else{
        state.recipe.bookmarked = false;
      }
    }catch(err){
      throw err;
    }
};


export const loadSearchResults = async function(query){
  try{
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      }
    })
    state.search.page = 1;
    return state.search.results;
  }catch(err){
    throw err;
  }
}

export const getSearchResultsPage = function(page = state.search.page){
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;
  return state.search.results.slice(start, end);
}

export const updateServings = function(newServings){
  state.recipe.ingredients.forEach(ingredient => {
    if(!ingredient.quantity) return;
    const singleServing = ingredient.quantity / state.recipe.servings;
    ingredient.quantity = singleServing * newServings;
  });
  state.recipe.servings = newServings;
}

const persistBookmarks = function(){
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
  state.bookmarks.push(recipe)
  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
}

export const deleteBookmark = function(id){
  const index = state.bookmarks.findIndex(bookmark => bookmark.id == id);
  state.bookmarks.splice(index, 1);

  if(id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
}

export const getBookmarks = function(){
  const storage = localStorage.getItem("bookmarks");
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
}