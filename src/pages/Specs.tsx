import type { Component } from 'solid-js';

import styles from './Specs.module.css';

const Specs: Component = () => {
  return (
    <main class={styles.specs}>
      <h2>things i use</h2>
    
      <h3>pc specs</h3>
      <a href="https://pcpartpicker.com/user/JackDotJS/saved/pGjqbv">full build on pcpartpicker.com</a>
      <ul class={styles.specList}>
        <li><em>os:</em> Fedora Linux 42 (KDE Plasma 6, Wayland)</li>
        <li><em>cpu:</em> AMD Ryzen 7 7700X</li>
        <li><em>gpu:</em> Sapphire PULSE Radeon RX 7900 XTX</li>
        <li><em>ram:</em> G.Skill Trident Z, 2x16GB DDR5 CL30</li>
      </ul>

      <h3>peripherals</h3>
      <ul class={styles.specList}>
        <li><em>display:</em> ViewSonic VP3481, 3440x1440 @ 100 Hz</li>
        <li><em>keyboard:</em> Keychron V3 w/ K Pro Mint Switches</li>
        <li><em>mouse:</em> MCHOSE G3 Ultra @ 1000 DPI</li>
        <li><em>controller:</em> PlayStation DualSense Wireless</li>
        <li><em>microphone:</em> Razer Seiren Mini</li>
        <li><em>headphones:</em> Bose QuietComfort 35 II</li>
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