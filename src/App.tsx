import type { Component } from 'solid-js';

import './global.css';

import Wallpaper from './components/Wallpaper';
import Header from './components/Header';

// FIXME: WTF is this type???
const App: Component = (props: any) => {
  return (
    <>
      <Wallpaper />

      <Header />
      {props.children}
    </>
  );
};

export default App;
