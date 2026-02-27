import { LitElement } from 'lit';
import { type TemplateResult } from 'lit';

export interface RouteParams {
  [key: string]: string;
}

export interface Route {
  path: string;
  render: (params: RouteParams) => TemplateResult;
}

interface RouteMatch {
  params: RouteParams;
}

export class Router {
  private _host: LitElement;
  private _routes: Route[];
  params: RouteParams = {};

  get currentPath(): string {
    return window.location.pathname;
  }

  constructor(host: LitElement, routes: Route[]) {
    this._host = host;
    this._routes = routes;

    this._onClick = this._onClick.bind(this);
    window.addEventListener('popstate', () => this._host.requestUpdate());
    document.addEventListener('click', this._onClick);
  }

  private _onClick(e: MouseEvent): void {
    const anchor = e
      .composedPath()
      .find((el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement);
    if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
    const url = new URL(anchor.href);
    if (url.origin !== window.location.origin) return;

    e.preventDefault();
    this.navigate(url.pathname);
  }

  navigate(path: string): void {
    if (path !== window.location.pathname) {
      history.pushState(null, '', path);
    }
    this._host.requestUpdate();
  }

  outlet(): TemplateResult | null {
    for (const route of this._routes) {
      const match = this._matchRoute(route.path, this.currentPath);
      if (match) {
        this.params = match.params;
        return route.render(match.params);
      }
    }
    return null;
  }

  private _matchRoute(pattern: string, path: string): RouteMatch | null {
    const paramNames: string[] = [];
    const regexStr = pattern.replace(/:([^/]+)/g, (_, name: string) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const match = path.match(new RegExp(`^${regexStr}$`));
    if (!match) return null;

    const params: RouteParams = {};
    paramNames.forEach((name, i) => (params[name] = match[i + 1]));
    return { params };
  }
}