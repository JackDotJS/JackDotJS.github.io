import { type JSXElement, type Component } from 'solid-js';

import './global.css';

import Header from './components/Header';
import Footer from './components/Footer';
import { Lightbox } from './components/Lightbox';

const App: Component<{ children?: string|JSXElement }> = (props) => {
  return (
    <Lightbox>
      <Header />
        {props.children}
      <Footer />
    </Lightbox>
  );
};

export default App;
