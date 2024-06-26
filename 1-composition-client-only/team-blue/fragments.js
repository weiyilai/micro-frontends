/* eslint-disable max-classes-per-file, no-use-before-define, no-console, class-methods-use-this */
/* globals HTMLElement, window */
(function fragments() {
  const prices = {
    t_porsche: '66,00 €',
    t_fendt: '54,00 €',
    t_eicher: '58,00 €',
  };

  const state = {
    count: 0,
  };

  class BlueBasket extends HTMLElement {
    connectedCallback() {
      this.refresh = this.refresh.bind(this);
      this.log('connected');
      this.render();
      window.addEventListener('blue:basket:changed', this.refresh);
    }

    refresh() {
      this.log('event recieved "blue:basket:changed"');
      this.render();
    }

    render() {
      const classname = state.count === 0 ? 'empty' : 'filled';
      this.innerHTML = `
        <div class="${classname}">basket: ${state.count} item(s)</div>
      `;
    }

    disconnectedCallback() {
      window.removeEventListener('blue:basket:changed', this.refresh);
      this.log('disconnected');
    }

    log(...args) {
      console.log('🛒 blue-basket', ...args);
    }
  }
  window.customElements.define('blue-basket', BlueBasket);

  class BlueBuy extends HTMLElement {
    static get observedAttributes() {
      return ['sku'];
    }

    connectedCallback() {
      this.addToCart = this.addToCart.bind(this);
      const sku = this.getAttribute('sku');
      this.log('connected', sku);
      this.render();
      this.shadowRoot.querySelector('button').addEventListener('click', this.addToCart);
    }

    addToCart() {
      state.count += 1;
      this.log('event sent "blue:basket:changed"');
      this.dispatchEvent(new CustomEvent('blue:basket:changed', {
        bubbles: true,
      }));
    }

    render() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }
      const sku = this.getAttribute('sku') || 't_porsche';
      const price = prices[sku];
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./team-blue/fragments.css">
        <button type="button">buy for ${price}</button>
      `;
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      this.log('attributeChanged', attr, oldValue, newValue);
      this.render();
    }

    disconnectedCallback() {
      this.shadowRoot.querySelector('button').removeEventListener('click', this.addToCart);
      const sku = this.getAttribute('sku');
      this.log('disconnected', sku);
    }

    log(...args) {
      console.log('🔘 blue-buy', ...args);
    }
  }
  window.customElements.define('blue-buy', BlueBuy);
}());
