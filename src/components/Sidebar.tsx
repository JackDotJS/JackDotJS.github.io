import { useLocation } from '@solidjs/router';
import { type Component, createEffect, createSignal, onMount } from 'solid-js';
import { IconCpu, IconDevicesPc, IconHome, IconMenu2, IconPencilDollar, IconPhoto } from '@tabler/icons-solidjs';

import styles from './Sidebar.module.css';

// TODO: fix tab navigation in mobile view

// TODO: add swipe to open sidebar in mobile view

const fetchBuild = fetch(`/gha-build.txt`)
const fetchHash = fetch(`/gha-hash.txt`)

interface UnitList {
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  [key: string]: number
}

const flavorTextStringList = [
  `one of the websites of all time`,
  `windows? more like winBLOWS haha lol`,
  `rock005.mdl`,
  `my fumking fromsting`,
  `cabbage`,
  `HUH???`,
  `:3`,
  `severe thunderstorm warning`,
  `CLEARLY you don't own an airfryer`,
  `THEN WHO WAS PHONE?`,
  `\${flavorText}`,
  `drink some water`,
  `stay hydrated!`,
  `*yru'oe`,
  `nights at five freddies`,
  `five fredies at night`,
  `friday night fredies`,
  `fuck`,
  `don't care mate`,
  `no`,
  `ajdfhdklfghj`,
  `ow`,
  `ouch`,
  `omg hiii!!!!!!`,
  `buals`,
  `jackiedotjs`,
  `lead poisoning enthusiast`,
  `now with 50% more lead!`,
  `mmmmmmmmmmm`,
  `batteries not included`,
  `can i get uhhhhh`,
  `MAX_CALL_STACK_EXCEEDED`,
  `STATUS: eating chair foam`,
  `#1 tire rubber consumer`,
  `screen space ambient occlusion`,
  `3 dollars`,
  `ROCK AND STONE`,
  `new york times bestseller`,
  `OH GREAT HEAVENS`,
  `this will be graphics in 2013`,
  `OHH MY PKCELLS`,
  `trans rights are human rights`,
  `have a fungus`,
  `a dink hard donk`,
  `really large solvent`,
  `evil hay sludge`,
  `sentenced to 10 minutes of twitter`,
  `i to am in this episode`,
  `this vexes me`,
  `THE MONEY`,
  `baja blastrogen`
]

const Sidebar: Component = () => {
  const [buildDate, setBuildDate] = createSignal(`[...]`);
  const [buildDateRelative, setBuildDateRelative] = createSignal(`[...]`);
  const [buildDateISO, setBuildDateISO] = createSignal(``);
  const [flavorTextString, setFlavorTextString] = createSignal(``);
  const [revHash, setRevHash] = createSignal(`[...]`);

  let currentToggleValue = false;
  let currentScrollPos = 0;
  let currentLocation = ``;

  let navContainer!: HTMLElement;
  let mobileMenuBar!: HTMLDivElement;
  let menuToggle!: HTMLInputElement;

  const pickFlavorText = () => {
    let randomIndex = Math.floor(Math.random() * flavorTextStringList.length);

    // ensure we don't pick the same string again
    if (flavorTextStringList[randomIndex] === flavorTextString()) {
      randomIndex += 1;
      if (randomIndex === flavorTextStringList.length) {
        randomIndex = 0;
      }
    }

    setFlavorTextString(flavorTextStringList[randomIndex]);
  }

  pickFlavorText();

  createEffect(() => {
    const location = useLocation();
    if (location.pathname === currentLocation) return;

    pickFlavorText();

    menuToggle.checked = false;
    currentScrollPos = 0;
    const toggleEvent = new CustomEvent(`change`);
    menuToggle.dispatchEvent(toggleEvent);

    const navLinks = navContainer.querySelectorAll(`a`);

    for (const a of navLinks) {
      if (!(a instanceof HTMLAnchorElement)) continue;

      const href = a.getAttribute(`href`);
      if (href == null) continue;

      a.className = ``;

      if (href == `/`) {
        if (location.pathname == href) {
          a.classList.add(styles.currentPage);
        }
      } else if (location.pathname.startsWith(href)) {
        a.classList.add(styles.currentPage);
      }
    }

    currentLocation = location.pathname;
  });

  const menuToggleHandler = () => {
    if (currentToggleValue === menuToggle.checked) return;

    if (menuToggle.checked) {
      // menu open
      currentScrollPos = window.scrollY;

      document.body.style.position = `fixed`;
      document.body.style.top = `-${currentScrollPos}px`;
    } else {
      // menu close
      document.body.style.position = ``;
      document.body.style.top = ``;
      window.scrollTo(0, currentScrollPos);
    }

    currentToggleValue = menuToggle.checked;
  }

  onMount(() => {
    fetchBuild.then(async (orgResponse) => {
      const response = orgResponse.clone();
      
      if (response.status !== 200) {
        return console.error(`couldn't fetch build date: ${response.status}`);
      }
    
      const text = await response.text();
      const num = parseInt(text);
    
      if (isNaN(num)) {
        return console.error(`gha-build: ${num}`);
      }
    
      const ghbuild = new Date(num * 1000);
    
      // uppercase letters are scary
      setBuildDate(ghbuild.toUTCString().toLocaleLowerCase());
      setBuildDateISO(ghbuild.toISOString());

      const units: UnitList = {
        year: 1000 * 60 * 60 * 24 * 365,
        month: (1000 * 60 * 60 * 24 * 365) / 12,
        day: 1000 * 60 * 60 * 24,
        hour: 1000 * 60 * 60,
        minute: 1000 * 60,
        second: 1000
      }

      const rtf = new Intl.RelativeTimeFormat(`en`, { numeric: `auto` });

      const updateRelativeDate = () => {
        const now = new Date();

        const elapsed = ghbuild.getTime() - now.getTime();

        let selectedUnit = `second`;

        for (const unit in units) {
          if (Math.abs(elapsed) > units[unit]) {
            selectedUnit = unit;
            break;
          }
        }

        const formatted = rtf.format(
          Math.round(elapsed/units[selectedUnit]), 
          selectedUnit as Intl.RelativeTimeFormatUnit
        );

        setBuildDateRelative(formatted);
      }

      updateRelativeDate();

      setInterval(() => {
        updateRelativeDate();
      }, 1000);
    });

    fetchHash.then(async (orgResponse) => {
      const response = orgResponse.clone();

      if (response.status !== 200) {
        return console.error(`couldn't fetch revision hash: ${response.status}`);
      }
    
      const text = await response.text();
    
      setRevHash(text.trim());
    });

    // uncheck sidebar toggle if the screen expands enough for mobile 
    // view to be disabled.
    //
    // since content scrolling is disabled when the sidebar is opened 
    // on mobile, this ensures scrolling is re-enabled as necessary.

    const mobileMenuObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio === 0) {
        console.debug(`mobile view disabled`)
        menuToggle.checked = false;
        const toggleEvent = new CustomEvent(`change`);
        menuToggle.dispatchEvent(toggleEvent);
      }
    });

    mobileMenuObserver.observe(mobileMenuBar);
  });

  return (
    <>
      <input 
        id="sidebarCheckbox" 
        type="checkbox"
        ref={menuToggle}
        onchange={menuToggleHandler}
        class={styles.sidebarCheckbox}
      />
      <div class={styles.sidebar}>
        <header>
          <a href="/">
            <img src="/assets/favicon.svg" />
          </a>
          <h1>jackiedotjs</h1>
          <a 
            onclick={pickFlavorText} 
            href="javascript:void(0)" 
            class={styles.flavorText}
          >
            <h3>
              {flavorTextString()}
            </h3>
          </a>
          <nav ref={navContainer}>
            <a href="/"> <IconHome/> home</a>
            <a href="/gallery"> <IconPhoto/> stuff i made</a>
            <a href="/specs"> <IconDevicesPc/> things i use</a>
            <a href="/commissions"> <IconPencilDollar/> commission info</a>
          </nav>
        </header>

        <footer>
          <div>
            last updated: <b><time datetime={buildDateISO()}>{buildDate()}</time></b> ({buildDateRelative()})
          </div>
          <div>
            rev: <b><a href={`https://github.com/JackDotJS/JackDotJS.github.io/commit/${revHash()}`}>{revHash()}</a></b>
          </div>
        </footer>
      </div>
      <div ref={mobileMenuBar} class={styles.mobileMenuBar}>
        <label for="sidebarCheckbox" class={styles.toggleSidebarButton}>
          <IconMenu2 />
        </label>
        <img src="/assets/favicon.svg" />
      </div>
    </>
  );
};

export default Sidebar;
