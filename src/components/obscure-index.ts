import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import { Router } from "../router.ts";
import "./obscure-app";
import "./blog/obscure-blog-app";
import "./obscure-not-found";


@customElement("obscure-index")
export class Index extends LitElement {
  router = new Router(this, [
    { path: "/", render: () => html`<obscure-app></obscure-app>` },
    { path: "/blog", render: () => html`<obscure-blog-app></obscure-blog-app>` },
    { path: "/blog/:slug", render: (params) => html`<obscure-blog-app .slug=${params.slug}></obscure-blog-app>` },
  ]);

  render() {
    return html`
      <main>
        ${this.router.outlet() ?? html`
          <obscure-not-found .path=${this.router.currentPath}></obscure-not-found>
        `}
      </main>
    `;
  }

  createRenderRoot() {
    return this;
  }
}
