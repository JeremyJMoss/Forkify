import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from "./views/bookmarksView.js"
import addRecipeView from './views/addRecipeView.js';

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
    //Get search query
    const query = searchView.getQuery();
    //Guard clause
    if(!query) throw new Error("Please don't leave search field empty.");
    resultsView.renderSpinner();
    //Loading search results
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);

  }catch(err){
    resultsView.renderError(err.message);
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

  // Render or update  bookmarks
  model.state.bookmarks != [] ? 
  bookmarksView.render(model.state.bookmarks) : 
  bookmarksView.update(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try{
    //show loading spinner
    addRecipeView.renderSpinner();
    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    // update url bar with new key
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    //render bookmarks view
    bookmarksView.render(model.state.bookmarks);
    // render created recipe
    recipeView.render(model.state.recipe);
    // create success message
    addRecipeView.renderMessage();
    // close form window
    setTimeout(function(){
      addRecipeView.toggleModal()
      setTimeout(addRecipeView.recreateRecipeWindow, 500);
    }, MODAL_CLOSE_SEC * 1000);

  } catch(err){
    addRecipeView.renderError(err.message);
    setTimeout(function(){
      addRecipeView.recreateRecipeWindow();
    }, MODAL_CLOSE_SEC * 1000)
  }
}

// starting event listeners at start of application
const init = function(){
  model.getBookmarks();
  bookmarksView.render(model.state.bookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPageResults);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();

