import { type Component } from 'solid-js';

import './global.css';

import Wallpaper from './components/Wallpaper';
import Header from './components/Header';
import Footer from './components/Footer';
import { Lightbox } from './components/Lightbox';

const App: Component<{ children: string|Element }> = (props) => {
  return (
    <>
      <Header />
        <Lightbox>
          {props.children}
        </Lightbox>
      <Footer />

      <Wallpaper />
    </>
  );
};

export default App;
