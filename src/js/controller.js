import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

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
  // Loading recipe
  await model.loadRecipe(id);

  // Rendering recipe
  recipeView.render(model.state.recipe);
  }catch(err){
    recipeView.renderError(err);
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
    resultsView.render(model.getSearchResultsPage(1));
  }catch(err){
    console.log(err);
  }
}

const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
}

init();

