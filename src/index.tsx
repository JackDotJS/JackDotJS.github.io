/* @refresh reload */
import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';

import './global.css';
import App from './App';

// TODO: figure out how to do routing transitions
// cus instant transitions are lame

// Routes
const Gallery = lazy(() => import(`./pages/Gallery`));
const Specs = lazy(() => import(`./pages/Specs`));
const Commissions = lazy(() => import(`./pages/Commissions`));
const Links = lazy(() => import(`./pages/Links`));

render(() => (
  <Router root={App}>
    <Route path="/" />
    <Route path="/gallery" component={Gallery} />
    <Route path="/specs" component={Specs} />
    <Route path="/commissions" component={Commissions} />
    <Route path="/links" component={Links} />
  </Router>
), document.body);
