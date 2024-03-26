/* @refresh reload */
import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';

import './global.css';
import App from './App';

// Routes
const Specs = lazy(() => import(`./pages/Specs`));

const root = document.getElementById(`root`);

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(`Root element not found!`);
}

render(() => (
  <Router root={App}>
    <Route path="/" />
    <Route path="/specs" component={Specs} />
  </Router>
), root!);
