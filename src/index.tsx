/* @refresh reload */
import { render } from 'solid-js/web';

import './global.css';
import App from './App';

const root = document.getElementById(`root`);

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(`Root element not found!`);
}

render(() => <App />, root!);
