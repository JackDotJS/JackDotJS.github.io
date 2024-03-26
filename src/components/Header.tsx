import type { Component } from 'solid-js';

import styles from './Header.module.css';

// TODO: fix this layout for smaller screens and mobile devices

const Header: Component = () => {
  return (
    <header class={styles.header}>
      <div class={styles.whoami}>
        <img class={styles.avatar} src="/assets/icon.png" alt="Icon of an orange bird head, with a tired expression on his face." />
        <div class={styles.summary}>
          <h1>i'm jack. i make stuff.</h1>
          <p>
            my pronouns are <b>he/him</b><br/>
            <br/>
            {/* TODO: add logic to update time value */}
            it's about <b id="mytime">0:00 PM</b> where i live
          </p>
        </div>
      </div>
      <nav class={styles.navigation}>
        <a href="/gallery">things i made</a>
        <a href="/specs">stuff i use</a>
        <a href="/commissions">commission info</a>
        <a href="/links">social links</a>
      </nav>
    </header>
  );
};

export default Header;
