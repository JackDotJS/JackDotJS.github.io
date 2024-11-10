 
import { createSignal, type Component } from 'solid-js';

import globalstyles from './ToolsGeneric.module.css';
import styles from './ULID.module.css';
import { decodeTime, isValid, ulid } from 'ulidx';
import { A } from '@solidjs/router';

// TODO: better styling

const ULIDTool: Component = () => {
  const [currentULID, setULID] = createSignal<string>(``);

  let textbox!: HTMLInputElement;

  const rtf = new Intl.RelativeTimeFormat(navigator.languages[0], { numeric: `always` });

  const createULID = () => {
    setULID(ulid());
  }

  const updateULID = () => {
    setULID(textbox.value);
  }

  const getULIDInfo = () => {
    const result = {
      valid: `N/A`,
      timestamp: `N/A`,
      relativeDate: `N/A`,
      utcDate: `N/A`,
      isoDate: `N/A`,
      localDate: `N/A`
    }

    if (currentULID().length === 0) return result;
    if (!isValid(currentULID())) {
      result.valid = `false`;
      return result;
    }

    result.valid = `true`;

    const decoded = decodeTime(currentULID());
    const currentTime = new Date().getTime();
    const millsElapsed = decoded - currentTime;

    const y = 1000 * 60 * 60 * 24 * 365;
    const mm = 1000 * 60 * 60 * 24 * 30.44;
    const w = 1000 * 60 * 60 * 24 * 7;
    const d = 1000 * 60 * 60 * 24;
    const h = 1000 * 60 * 60;
    const m = 1000 * 60;
    const s = 1000;

    const units = [
      { unit: `year`, ms: 1000 * 60 * 60 * 24 * 365 },
      { unit: `month`, ms: 1000 * 60 * 60 * 24 * 30.44 },
      { unit: `week`, ms: 1000 * 60 * 60 * 24 * 7 },
      { unit: `day`, ms: 1000 * 60 * 60 * 24 },
      { unit: `hour`, ms: 1000 * 60 * 60 },
      { unit: `minute`, ms: 1000 * 60 },
      { unit: `second`, ms: 1000 },
    ];

    for (const {unit, ms} of units) {
      if (Math.abs(millsElapsed) >= ms || unit === `second`) {
        result.relativeDate = rtf.format(
          Math.round(millsElapsed / ms),
          unit as Intl.RelativeTimeFormatUnit
        );
        break;
      }
    }

    result.timestamp = decoded.toString();
    result.utcDate = new Date(decoded).toUTCString();
    result.isoDate = new Date(decoded).toISOString();
    result.localDate = new Date(decoded).toLocaleString();

    return result;
  }

  return (
    <main class={styles.ulidtool}>
      <h2 class={globalstyles.title}>
        <A class={globalstyles.backButton} href="/tools" noScroll>
          &lt; back
        </A>
        ULID Timestamp Tool
      </h2>
      <div class={styles.inputWrapper}>
        <button onclick={createULID}>Generate New ULID</button>
        <input 
          ref={textbox} 
          type="text" 
          value={currentULID()} 
          placeholder="...or paste an existing ULID here"
          oninput={updateULID}
          onchange={updateULID}
        />
      </div>
      <p>Valid ULID?: <span>{getULIDInfo().valid}</span></p>
      <p>UNIX Timestamp (Milliseconds): <span>{getULIDInfo().timestamp}</span></p>
      <p>Date (Relative): <span>{getULIDInfo().relativeDate}</span></p>
      <p>Date (Localized): <span>{getULIDInfo().localDate}</span></p>
      <p>Date (UTC): <span>{getULIDInfo().utcDate}</span></p>
      <p>Date (ISO): <span>{getULIDInfo().isoDate}</span></p>
    </main>
  );
};

export default ULIDTool;