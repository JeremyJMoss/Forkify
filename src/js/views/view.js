import icons from 'url:../../img/icons.svg';

export default class View{
    _data;
    
    /**
     * Render the recieved object to the dom
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe) 
     * @returns {renderError()} If no data, render error to Dom instead of rendering markup to the Dom
     */
    render(data) {
        if(!data || (Array.isArray(data) && data.length == 0)){
          return this.renderError();
        }
        this._data = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
      }

      /**
       * renders a spinner to parent element in the dom
       */
      renderSpinner(){
        const markup = `<div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>`;
        this._clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
      }

      /**
       * clear html of parent element in dom
       */
      _clear() {
        this._parentEl.innerHTML = '';
      }

      /**
       * Updates the elements on the dom that have changed
       * @param {Object} data The data to help update the dom
       */
      update(data){
        this._data = data;
        const newMarkup = this._generateMarkup();
        const newDom = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDom.querySelectorAll("*"));
        const curElements = Array.from(this._parentEl.querySelectorAll("*"));
        
        // updating changed text
        newElements.forEach((newEl, i) => {
          const curEl = curElements[i];
          if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ""){
            curEl.textContent = newEl.textContent;
          }


          // update changed attributes
          if (!newEl.isEqualNode(curEl)){
            Array.from(newEl.attributes).forEach(attr => 
              curEl.setAttribute(attr.name, attr.value));
          }
        })

      }
    
      /**
       * renders error message to parent element
       * @param {string} [msg=_errMessage] error message to render to dom 
       */
      renderError(msg = this._errMessage){
        const markup = `<div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${msg}</p>
      </div>`
      this._clear();
      this._parentEl.insertAdjacentHTML("afterbegin", markup);
      }
    
      /**
       * renders success message to dom
       * @param {string} [msg=_message] success message to be rendered to dom 
       */
      renderMessage(msg = this._message){
        const markup = `  <div class="recipe">
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${msg}</p>
        </div>`
        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin", markup);
      }
}