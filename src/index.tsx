/* @refresh reload */
import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';

import './global.css';
import App from './App';

// Routes
const Specs = lazy(() => import(`./pages/Specs`));
const Commissions = lazy(() => import(`./pages/Commissions`));

render(() => (
  <Router root={App}>
    <Route path="/" />
    <Route path="/specs" component={Specs} />
    <Route path="/commissions" component={Commissions} />
  </Router>
), document.body);
