import { type JSXElement, type Component } from 'solid-js';

import './global.css';

import Sidebar from './components/Sidebar';
import { Lightbox } from './components/Lightbox';

const App: Component<{ children?: string|JSXElement }> = (props) => {
  return (
    <Lightbox>
      <Sidebar />
      <div class="contentWrapper">
        {props.children}
      </div>
    </Lightbox>
  );
};

export default App;
