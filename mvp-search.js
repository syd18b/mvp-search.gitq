/**
 * Copyright 2024 syd18b
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./mvp-item";

/**
 * `mvp-search`
 *
 * @demo index.html
 * @element mvp-search
 */
export class mvpSearch extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "mvp-search";
  }

  constructor() {
    super();
    this.items = [];
    this.title = "";
    this.value = "";
    this.overview = {};
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      value: { type: String },
      items: { type: Array },
      overview: { type: Object },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }
        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }
        h3 span {
          font-size: var(--mvp-search-label-font-size, var(--ddd-font-size-s));
        }
      `,
    ];
  }

  // life cycle will run when anything defined in `properties` is modified
  updated(changedProperties) {
    // see if value changes from user input and is not empty
    if (changedProperties.has("value") && this.value) {
      this.updateResults(this.value);
    } else if (changedProperties.has("value") && !this.value) {
      this.items = [];
    }
    // @debugging purposes only
    if (changedProperties.has("items") && this.items.length > 0) {
      console.log(this.items);
    }
  }

  updateResults() {
    this.value = this.shadowRoot.querySelector("#site-url").value;
    this.loading = true;
    console.log(this.value);
    fetch(`${this.value}`)
      .then((d) => (d.ok ? d.json() : {}))
      .then((data) => {
        if (data) {
          this.items = data.items;
          this.loading = false;
        } else {
          this.items = [];
        }
      });
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="container">
        <h1>Site Analyzer</h1>
        <div>
          <label for="site-url">HAX Site URL:</label>
          <input
            type="text"
            id="site-url"
            placeholder="https://hax.theweb.org/site.json"
          />
          <button @click="${this.updateResults}">Analyze</button>
        </div>

        <div id="overview" class="overview"></div>

        <div id="cards" class="cards">
          <div id="overview"></div>
          ${this.items.map(
            (item, index) => html`
              <mvp-item
                title=${item.title}
                lastUpdated=${item.metadata.updated}
                description=${item.description}
                image=https://haxtheweb.org/${item.metadata.images[0]}
                slug=https://haxtheweb.org/${item.slug}
                path=https://haxtheweb.org/${item.location}
                addtional=${item.metadata.published}
              ></mvp-item>
            `
          )}
        </div>
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(mvpSearch.tag, mvpSearch);
