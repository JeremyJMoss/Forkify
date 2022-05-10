import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from "./views/bookmarksView.js"

import 'core-js/stable';
import 'regenerator-runtime/runtime';


const controlRecipes = async function () {
  try{
  //Getting hash id
  const id = window.location.hash.slice(1);
  //Guard clause
  if (!id) return;
  // Loading spinner
  recipeView.renderSpinner();

  resultsView.update(model.getSearchResultsPage());
  // Loading recipe
  await model.loadRecipe(id);

  // Rendering recipe
  recipeView.render(model.state.recipe);
  }catch(err){
    recipeView.renderError();
  }
};

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();
    //Get search query
    const query = searchView.getQuery();
    //Guard clause
    if(!query) return;
    //Loading search results
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);

  }catch(err){
    console.log(err);
  }
}

const controlPageResults = function (page){
 resultsView.render(model.getSearchResultsPage(page))
 paginationView.render(model.state.search);
}

const controlServings = function(btn){ 
  if (!btn || model.state.recipe.servings == 1 && +btn.dataset.serving < 0) return;
  const newServingSize = model.state.recipe.servings + (+btn.dataset.serving);
  model.updateServings(newServingSize);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  if(!model.state.recipe.bookmarked) 
  {model.addBookmark(model.state.recipe)}
  else {model.deleteBookmark(model.state.recipe.id)};

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  if(model.state.bookmarks != []){
    bookmarksView.render(model.state.bookmarks);
  }
  else{
    bookmarksView.update(model.state.bookmarks);
  }
}

const init = function(){
  model.getBookmarks();
  bookmarksView.render(model.state.bookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPageResults);
}

init();

