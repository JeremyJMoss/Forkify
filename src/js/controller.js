import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const controlRecipes = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;
  // Loading spinner
  recipeView.renderSpinner();

  // Loading recipe
  await model.loadRecipe(id);

  // Rendering recipe
  recipeView.render(model.state.recipe);
};

// creating event listeners for page loads and url bar changes
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
