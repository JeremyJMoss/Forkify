import icons from 'url:../../img/icons.svg';

export default class View{
    _data;
    
    render(data) {
        if(!data || (Array.isArray(data) && data.length == 0)){
          return this.renderError();
        }
        this._data = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
      }
      
      renderSpinner() {
        const markup = `<div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>`;
        this._clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
      }

      _clear() {
        this._parentEl.innerHTML = '';
      }

      update(data){
        this._data = data;
        const newMarkup = this._generateMarkup();
        const newDom = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDom.querySelectorAll("*"));
        const curElements = Array.from(this._parentEl.querySelectorAll("*"));
        
        // updating changed text
        newElements.forEach((newEl, i) => {
          const curEl = curElements[i];
          if (!newEl.isEqualNode(curEl) && newEl.firstChild.nodeValue.trim() !== ""){
            curEl.textContent = newEl.textContent;
          }


          // update changed attributes
          if (!newEl.isEqualNode(curEl)){
            Array.from(newEl.attributes).forEach(attr => 
              curEl.setAttribute(attr.name, attr.value));
          }
        })

      }
    
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