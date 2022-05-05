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