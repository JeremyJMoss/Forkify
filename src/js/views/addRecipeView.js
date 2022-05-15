import View from "./view.js";
import icons from "url:../../img/icons.svg";

class addRecipeView extends View {
    _parentEl = document.querySelector(".upload");
    _message = "Recipe was successfully created :D"
    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _openBtn = document.querySelector(".nav__btn--add-recipe")
    _closeBtn = document.querySelector(".btn--close-modal");

    constructor(){
        super();
        this._addHandlerToggleModal(this._openBtn);
        this._addHandlerToggleModal(this._closeBtn);
        this._addHandlerToggleModal(this._overlay);
    }

    _addHandlerToggleModal(btn){
        btn.addEventListener("click", this.toggleModal.bind(this));
    }

    toggleModal(){
        [this._overlay, this._window].forEach(el => el.classList.toggle("hidden"));
    }

    addHandlerUpload(handler){
        this._parentEl.addEventListener("submit", function(e){
            e.preventDefault();
            /* creating new form data object using this keyword which while in event
            listener will reference the object we are putting listener on */
            const dataArray = [...new FormData(this._parentEl)];
            const data = Object.fromEntries(dataArray);
            handler(data);
        }.bind(this))
    }

    recreateRecipeWindow(){
        const markup = `
          <form class="upload">
            <div class="upload__column">
              <h3 class="upload__heading">Recipe data</h3>
              <label>Title</label>
              <input required="" name="title" type="text">
              <label>URL</label>
              <input required="" name="sourceUrl" type="text">
              <label>Image URL</label>
              <input required="" name="image" type="text">
              <label>Publisher</label>
              <input required="" name="publisher" type="text">
              <label>Prep time</label>
              <input required="" name="cookingTime" type="number">
              <label>Servings</label>
              <input required="" name="servings" type="number">
            </div>
    
            <div class="upload__column">
              <h3 class="upload__heading">Ingredients</h3>
              <label>Ingredient 1</label>
              <input type="text" required="" name="ingredient-1" placeholder="Format: 'Quantity,Unit,Description'">
              <label>Ingredient 2</label>
              <input type="text" name="ingredient-2" placeholder="Format: 'Quantity,Unit,Description'">
              <label>Ingredient 3</label>
              <input type="text" name="ingredient-3" placeholder="Format: 'Quantity,Unit,Description'">
              <label>Ingredient 4</label>
              <input type="text" name="ingredient-4" placeholder="Format: 'Quantity,Unit,Description'">
              <label>Ingredient 5</label>
              <input type="text" name="ingredient-5" placeholder="Format: 'Quantity,Unit,Description'">
              <label>Ingredient 6</label>
              <input type="text" name="ingredient-6" placeholder="Format: 'Quantity,Unit,Description'">
            </div>
    
            <button class="btn upload__btn">
              <svg>
                <use href="/icons.21bad73c.svg#icon-upload-cloud"></use>
              </svg>
              <span>Upload</span>
            </button>
          </form>`
        this._parentEl.innerHTML = markup;
    }
}

export default new addRecipeView();