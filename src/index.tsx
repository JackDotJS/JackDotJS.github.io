/* @refresh reload */
import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';

import './global.css';
import App from './App';

// TODO: figure out how to do routing transitions
// cus instant transitions are lame
// https://github.com/solidjs-community/solid-transition-group ??

// Routes
const Home = lazy(() => import(`./pages/index/Home` /* @vite-ignore */));
const Gallery = lazy(() => import(`./pages/gallery/Gallery` /* @vite-ignore */));
const Specs = lazy(() => import(`./pages/specs/Specs` /* @vite-ignore */));
const Commissions = lazy(() => import(`./pages/commissions/Commissions` /* @vite-ignore */));

// TODO: make an actual 404 page?
// https://github.com/solidjs/solid-router/blob/main/README.md#configure-your-routes

// TODO: dynamic routing for gallery?
// https://github.com/solidjs/solid-router?tab=readme-ov-file#dynamic-routes

render(() => (
  <Router root={App}>
    <Route path="/" component={Home} />
    <Route path="/gallery" component={Gallery} />
    <Route path="/specs" component={Specs} />
    <Route path="/commissions" component={Commissions} />
  </Router>
), document.body);
