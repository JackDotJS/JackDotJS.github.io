import type { Component } from 'solid-js';

import './global.css';

import Wallpaper from './components/Wallpaper';
import Header from './components/Header';
import Footer from './components/Footer';

// FIXME: WTF is this type???
const App: Component = (props: any) => {
  return (
    <>
      <Header />
      {props.children}
      <Footer />

      <Wallpaper />
    </>
  );
};

export default App;
