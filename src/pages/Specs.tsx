import type { Component } from 'solid-js';

import styles from './Specs.module.css';

const Specs: Component = () => {
  return (
    <main class={styles.specs}>
      <h2>things i use</h2>
    
      <h3>pc specs</h3>
      <a href="https://pcpartpicker.com/user/JackDotJS/saved/pGjqbv">full build on pcpartpicker.com</a>
      <ul class={styles.specList}>
        <li><b>os:</b> Fedora Linux 40 (KDE Plasma 6)</li>
        <li><b>cpu:</b> AMD Ryzen 7 7700X @ 4.5 GHz</li>
        <li><b>gpu:</b> NVIDIA GeForce RTX 4070 Ti @ 2310 MHz</li>
        <li><b>ram:</b> G.Skill Trident Z, 2x16GB DDR5 CL30 @ 6000 MHz</li>
      </ul>

      <h3>peripherals</h3>
      <ul class={styles.specList}>
        <li><b>display:</b> ViewSonic VP3481, 3440x1440 @ 100 Hz</li>
        <li><b>keyboard:</b> Keychron V3 w/ K Pro Mint Switches</li>
        <li><b>mouse:</b> Logitech G305 @ 1000 DPI</li>
        <li><b>controller:</b> PlayStation DualSense Wireless</li>
        <li><b>microphone:</b> Razer Seiren Mini</li>
        <li><b>headphones:</b> Bose QuietComfort 35 II</li>
      </ul>

      <h3>software</h3>
      <div class={styles.icongrid}>
        <a href="https://www.blender.org/" rel="external">
          <img src="/assets/software_icons/blender.svg" />
          Blender
        </a>
        <a href="https://vscodium.com/" rel="external">
          <img src="/assets/software_icons/vscodium.svg" />
          VSCodium
        </a>
        <a href="https://www.gimp.org/" rel="external">
          <img src="/assets/software_icons/gimp.svg" />
          GIMP
        </a>
        <a href="https://obsproject.com/" rel="external">
          <img src="/assets/software_icons/obs.svg" />
          OBS Studio
        </a>
        <a href="https://kdenlive.org/" rel="external">
          <img src="/assets/software_icons/kdenlive.svg" />
          Kdenlive
        </a>
      </div>
    </main>
  );
};

export default Specs;