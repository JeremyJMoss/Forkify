import icons from "url:../../img/icons.svg";
import View from "./view";
import {RES_PER_PAGE} from "../config.js";

class PaginationView extends View {
    _parentEl = document.querySelector(".pagination");

    _generateMarkup(){
        const numPages = this._data.results.length / RES_PER_PAGE;
        const maxPage = Math.ceil(numPages);
        let markup = "";
        // page 1, and there are no other pages
        if (numPages <= 1){
            return markup;
        }
        // page 1 and there are other pages
        if (this._data.page == 1){
            markup = `<button class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
        } 
        // on end page, pages > 1
        else if(this._data.page == maxPage) {
            markup = `<button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>`
        }
        // on another page other than 1 with more pages to go
        else{
            markup = `<button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>
            <button class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
        }
        return markup;
    }

    addHandlerPagination(handler){
      this._parentEl.addEventListener("click", handler);
    }
}

export default new PaginationView();