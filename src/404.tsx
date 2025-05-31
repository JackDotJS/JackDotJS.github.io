import { type Component, onMount } from 'solid-js';

import styles from './404.module.css';

const NotFound: Component = () => {
  onMount(() => {
    document.title = `404 - jackiedotjs`;
  });

  return (
    <main class={styles.notFound}>
      <h1>404</h1>
      <span>idk what ur looking for, but it ain't here. sorry.</span>
    </main>
  );
};

export default NotFound;