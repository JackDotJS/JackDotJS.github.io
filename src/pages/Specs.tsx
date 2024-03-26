import type { Component } from 'solid-js';

import styles from './Specs.module.css';

const Specs: Component = () => {
  return (
    <main class={styles.specs}>
      <h2>things i use</h2>
    
      <h3>pc specs</h3>
      <a href="https://pcpartpicker.com/user/JackDotJS/saved/pGjqbv">full build on pcpartpicker.com</a>
      <ul class={styles.specList}>
        <li><em>os:</em> Fedora Workstation 39 (KDE Plasma 5)</li>
        <li><em>cpu:</em> AMD Ryzen 7 7700X @ 4.5 GHz</li>
        <li><em>gpu:</em> NVIDIA GeForce RTX 4070 Ti @ 2310 MHz</li>
        <li><em>ram:</em> G.Skill Trident Z, 2x16GB DDR5 CL30 @ 6000 MHz</li>
      </ul>

      <h3>peripherals</h3>
      <ul class={styles.specList}>
        <li><em>display:</em> ViewSonic VP3481, 3440x1440 @ 100 Hz</li>
        <li><em>keyboard:</em> Keychron K1 SE w/ Mint Optical Switches</li>
        <li><em>mouse:</em> Logitech G305 @ 1000 DPI</li>
        <li><em>microphone:</em> Razer Seiren Mini</li>
        <li><em>headphones:</em> Bose QuietComfort 35 II</li>
      </ul>

      <h3>software</h3>
      {/* TODO: thinking i might ditch the categories idea and just have a grid of icons or something */}
      <p>
        <em>3d artwork and graphic design:</em><br/>
        <a href="https://www.blender.org/" rel="external">Blender</a>,
        <a href="https://www.getpaint.net/" rel="external">Paint.NET</a>
      </p>

      <p>
        <em>programming and web dev:</em><br/>
        <a href="https://code.visualstudio.com/" rel="external">Visual Studio Code</a>
      </p>

      <p>
        <em>video production:</em><br/>
        <a href="https://obsproject.com/" rel="external">OBS Studio</a>,
        <a href="https://www.blackmagicdesign.com/products/davinciresolve" rel="external">DaVinci Resolve</a>
      </p>
    </main>
  );
};

export default Specs;