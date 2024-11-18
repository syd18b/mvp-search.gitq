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
    this.name = "";
    this.description = "";
    this.logo = "";
    this.theme = "";
    this.created = "";
    this.lastupdated = "";
    this.hexCode = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      value: { type: String },
      items: { type: Array },
      overview: { type: Object },
      name: { type: String },
      description: { type: String },
      logo: { type: String },
      theme: { type: String },
      created: { type: String },
      lastupdated: { type: String },
      hexCode: { type: String },
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
        h2 {
          font-size: var(--mvp-search-label-font-size, var(--ddd-font-size-xs));
          margin: 0;
        }

        .overview-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: var(--site-hex-code, #f9f9f9);
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin: 0 auto 20px auto;
          max-width: 600px; /* Limit width of the card */
          text-align: center;
        }

        #logo {
          max-height: 150px;
          max-width: 150px;
          margin-bottom: 15px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .text-wrap {
          text-align: left;
        }

        .cards {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
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
          this.name = data.metadata.site.name;
          this.description = data.description;
          this.logo = data.metadata.site.logo;
          this.theme = data.metadata.theme.name;
          this.created = data.metadata.site.created;
          this.lastupdated = data.metadata.site.updated;
          this.hexCode = data.metadata.theme.variables.hexCode;
          this.items = data.items;
          this.loading = false;
        } else {
          this.items = [];
        }
      });
  }

  dateToString(timeStamp) {
    const date = new Date(timeStamp * 1000);
    return date.toUTCString();
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

        <div
          class="overview-card"
          id="overview-card"
          style="--site-hex-code: ${this.hexCode};"
        >
          <h2 class="logo">logo:</h2>
          ${this.logo
            ? html`<img id="logo" src="https://haxtheweb.org/${this.logo}" />`
            : ""}

          <div class="text-wrap">
            <h2 id="name">name:</h2>
            ${this.name ? html`<div>${this.name}</div>` : ""}

            <h2 id="description">description:</h2>
            ${this.description ? html`<div>${this.description}</div>` : ""}
            ${this.theme
              ? html`<h2 id="theme">theme:</h2>
                  <div>${this.theme}</div>`
              : ""}

            <h2 class="created">created:</h2>
            ${this.created
              ? html`<div>${this.dateToString(this.created)}</div>`
              : ""}

            <h2 class="last-updated">last updated:</h2>
            ${this.lastupdated
              ? html`<div>${this.dateToString(this.lastupdated)}</div>`
              : ""}

            <h2 class="hex-code">Hex Code:</h2>
            ${this.hexCode ? html`<div>${this.hexCode}</div>` : ""}
          </div>
        </div>

        <div id="cards" class="cards">
          ${this.items.map(
            (item) => html`
              <mvp-item
                title=${item.title}
                lastUpdated=${this.dateToString(item.metadata.updated)}
                description=${item.description}
                image=${item.metadata.images[0]}
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
