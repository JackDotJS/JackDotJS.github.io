import { type Component, onMount } from 'solid-js';
import metadata from './pageMetadata.json';

import styles from './Specs.module.css';

const Specs: Component = () => {
  onMount(() => {
    document.title = `${metadata.TITLE} - jackiedotjs`;
  });

  return (
    <main>
      <h2>pc specs</h2>
      <ul class={styles.specList}>
        <li><em>os:</em> Fedora Linux 42 (KDE Plasma 6, Wayland)</li>
        <li><em>cpu:</em> AMD Ryzen 7 7700X</li>
        <li><em>gpu:</em> Sapphire PULSE Radeon RX 7900 XTX</li>
        <li><em>ram:</em> G.Skill Trident Z, 2x16GB DDR5 CL30</li>
      </ul>
      <a href="https://pcpartpicker.com/user/JackDotJS/saved/pGjqbv">full build on pcpartpicker.com</a>

      <h2>peripherals</h2>
      <ul class={styles.specList}>
        <li><em>display:</em> ViewSonic VP3481, 3440x1440 @ 100 Hz</li>
        <li><em>keyboard:</em> Keychron V3 w/ K Pro Mint Switches</li>
        <li><em>mouse:</em> MCHOSE G3 Ultra @ 1000 DPI</li>
        <li><em>gamepad:</em> PlayStation DualSense Wireless</li>
        <li><em>microphone:</em> Razer Seiren Mini</li>
        <li><em>headphones:</em> Bose QuietComfort 35 II</li>
      </ul>

      <h2>software</h2>
      <div class={styles.icongrid}>
        <a href="https://www.blender.org/" rel="external">
          <div>
            <img src="/assets/software_icons/blender.svg" />
          </div>
          Blender
        </a>
        <a href="https://vscodium.com/" rel="external">
          <div>
            <img src="/assets/software_icons/vscodium.svg" />
          </div>
          VSCodium
        </a>
        <a href="https://www.gimp.org/" rel="external">
          <div>
            <img src="/assets/software_icons/gimp.svg" />
          </div>
          GIMP
        </a>
        <a href="https://obsproject.com/" rel="external">
          <div>
            <img src="/assets/software_icons/obs.svg" />
          </div>
          OBS Studio
        </a>
        <a href="https://kdenlive.org/" rel="external">
          <div>
            <img src="/assets/software_icons/kdenlive.svg" />
          </div>
          Kdenlive
        </a>
      </div>
    </main>
  );
};

export default Specs;