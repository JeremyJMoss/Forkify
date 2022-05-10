import icons from 'url:../../img/icons.svg';
import View from "./view.js"

export class ResultsView extends View{
    _parentEl = document.querySelector(".results");
    _errMessage = "No recipes found for your query. Please try again!"
    _message = "";

    _generateMarkup(){
            return this._data.map(entry => this._generateMarkupPreview(entry)).join("");
    }

    _generateMarkupPreview(entry){
        const id = window.location.hash.slice(1)

        return `<li class="preview">
        <a class="preview__link ${id == entry.id ? "preview__link--active" : ""}" href="#${entry.id}">
        <figure class="preview__fig">
            <img src="${entry.image}" alt="Test" />
        </figure>
        <div class="preview__data">
            <h4 class="preview__title">${entry.title}</h4>
            <p class="preview__publisher">${entry.publisher}</p>
        </div>
        </a>
    </li>`
    }
}


export default new ResultsView();

