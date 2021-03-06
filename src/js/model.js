import {async} from 'regenerator-runtime';
import {AJAX} from './helpers';
import { API_URL, RES_PER_PAGE, API_KEY } from './config';


export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1
  },
  bookmarks: []
};

const createRecipe = function(data){
  const { recipe } = data.data;
  return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key}) 
      };
    
}

export const loadRecipe = async function (id) {
    try{
      const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
      
      state.recipe = createRecipe(data);

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

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key})
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

// Adding bookmarks to local storage
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


// Retrieve bookmarks from local storage
export const getBookmarks = function(){
  const storage = localStorage.getItem("bookmarks");
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
}

// For development purposes only
export const clearBookmarks = function(){
  localStorage.clear("bookmarks");
}

export const uploadRecipe = async function(newRecipe){
  try{
  const ingredients = Object.entries(newRecipe)
  .filter(entry => entry[0].startsWith("ingredient") && entry[1] != "")
  .map(ingredient => {
    const splitValues = ingredient[1].split(",")
    if (splitValues.length != 3) throw new Error(
      "Wrong ingredient format! Please use the correct format"
    )
    return {quantity: splitValues[0] ? +splitValues[0] : null, unit: splitValues[1], description: splitValues[2]}
  })
  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients
  }
  const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
  state.recipe = createRecipe(data);
  addBookmark(state.recipe);
  } catch(err){
    throw err;
  }
}