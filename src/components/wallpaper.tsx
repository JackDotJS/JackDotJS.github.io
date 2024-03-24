import type { Component } from 'solid-js';

import background0 from '../assets/background-slideshow/background0.jpg';
import background1 from '../assets/background-slideshow/background1.jpg';
import background2 from '../assets/background-slideshow/background2.jpg';
import background3 from '../assets/background-slideshow/background3.jpg';
import background4 from '../assets/background-slideshow/background4.jpg';

const Wallpaper: Component = () => {
  return (
    <div id="backgrounds" aria-hidden="true">
      <img src={background0} />
      <img src={background1} />
      <img src={background2} />
      <img src={background3} />
      <img src={background4} />
    </div>
  );
};

export default Wallpaper;
