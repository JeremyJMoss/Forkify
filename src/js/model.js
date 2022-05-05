import {async} from 'regenerator-runtime';
import {getJSON} from './helpers';
import { API_URL } from './config';
import { RES_PER_PAGE } from './config';


export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: ''
  }
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
    return state.search.results;
  }catch(err){
    throw err;
  }
}

export const getSearchResultsPage = function(){
  const page = state.search.page;
  
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;
  return state.search.results.slice(start, end);
}