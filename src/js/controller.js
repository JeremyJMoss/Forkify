import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';

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
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);

  }catch(err){
    console.log(err);
  }
}

const controlPageResults = function (e){
 const btn = e.target.closest("button");
 if(!btn) return;
 const goToPage = +btn.querySelector("span").innerHTML.at(-1);
 resultsView.render(model.getSearchResultsPage(goToPage))
 paginationView.render(model.state.search);
}

const controlServings = function(e){
  const servingBtn = e.target.closest(".btn--update-servings");
  if (!servingBtn || model.state.recipe.servings == 1 && +servingBtn.dataset.serving < 0) return;
  const newServingSize = model.state.recipe.servings + (+servingBtn.dataset.serving); 
  model.updateServings(newServingSize);
  recipeView.update(model.state.recipe);
}


const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPageResults);
}

init();

