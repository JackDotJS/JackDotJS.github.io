import { type JSXElement, type Component } from 'solid-js';

import './global.css';

import Wallpaper from './components/Wallpaper';
import Header from './components/Header';
import Footer from './components/Footer';
import { Lightbox } from './components/Lightbox';

const App: Component<{ children: string|JSXElement }> = (props) => {
  return (
    <>
      <Lightbox>
        <Header />
          {props.children}
        <Footer />
      </Lightbox>
      

      <Wallpaper />
    </>
  );
};

export default App;
