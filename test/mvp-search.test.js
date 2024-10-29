import { html, fixture, expect } from '@open-wc/testing';
import "../mvp-search.js";

describe("mvpSearch test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <mvp-search
        title="title"
      ></mvp-search>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
