 
import type { Component } from 'solid-js';

import styles from './Tools.module.css';

/**
 * TODO: lots of more tools i wanna work on.
 * also TODO: better styling
 */

const Tools: Component = () => {
  return (
    <main class={styles.tools}>
      <h2>tools that may or may not be useful</h2>
      <a href="/tools/ulid">
        <span>ULID Timestamp Tool</span>
      </a>

      {/* <a href="/tools/snowflake">
        <span>snowflake ID tool</span>
      </a>

      <a href="/tools/timestamp">
        <span>discord/revolt timestamp generator</span>
      </a>

      <a href="/tools/mcassets">
        <span>minecraft asset extractor</span>
      </a> */}
      <span>more coming soon!</span>
    </main>
  );
};

export default Tools;