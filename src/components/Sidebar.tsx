import { type Component } from 'solid-js';
import Header from './Header';
import Footer from './Footer';

import styles from './Sidebar.module.css';

const Sidebar: Component = () => {
  return (
    <>
      <input type="checkbox" id="toggleSidebar" class={styles.toggleSidebar}/>
      <div class={styles.sidebar}>
        <label for="toggleSidebar">menu</label>
        <Header />
        <Footer />
      </div>
      <div class={styles.mobileBar}>
        <label for="toggleSidebar">menu</label>
      </div>
    </>
  );
};

export default Sidebar;
