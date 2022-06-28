import View from "./view";
import icons from 'url:../../img/icons.svg';

class RecipeView extends View{
  _parentEl = document.querySelector('.recipe');
  _errMessage = "We could not find that recipe. Please try another one!"
  _message = "";
  _allowableFractions = {50: "1/2", 25: "1/4", 33: "1/3", 75: "3/4", 66: "2/3"};

  addHandlerRender(handler){
    // creating event listeners for page loads and url bar changes
    ['hashchange', 'load'].forEach(ev =>
      window.addEventListener(ev, handler)
    );
  }

  addHandlerServings(handler){
    this._parentEl.addEventListener("click", function(e){
      const servingBtn = e.target.closest(".btn--update-servings");
      handler(servingBtn);
    });
  }

  addHandlerBookmark(handler){
    this._parentEl.addEventListener("click", function(e){
      const btn = e.target.closest(".btn--bookmark");
      if(!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    return `<figure class="recipe__fig">
          <img src=${this._data.image} alt="Food" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-serving="-1">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-serving="1">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="recipe__user-generated${this._data.key ? "" : " hidden"}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookmarked ? "-fill" : ""}"></use>
            </svg>
          </button>
        </div>

        
        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients
            .map(ing => this._generateIngredientMarkup(ing))
            .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href=${this._data.sourceUrl}
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }

  _generateIngredientMarkup(ing){
      return `<li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      ing.quantity ? this._createFraction(ing.quantity) : ''
    }</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ing.unit}</span>
      ${ing.description}
    </div>
  </li>`;
    }

  _createFraction(num) {
    const fractionAmount = Math.floor((num - Math.floor(num))* 100)
    const fractions = Object.keys(this._allowableFractions).map(fraction => Number(fraction));
    if (fractions.includes(fractionAmount)){
      return `${Math.floor(num) ? Math.floor(num) + " " : ""}${this._allowableFractions[fractionAmount]}`;
    }
    return num;
  }
}

export default new RecipeView();
