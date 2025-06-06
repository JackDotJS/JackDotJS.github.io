 
import { For, type Component, onMount, createSignal, useContext } from 'solid-js';
import { IconCheck } from '@tabler/icons-solidjs';
import { GalleryEntryData, LightBoxContext } from '../../components/Lightbox';
import metadata from './pageMetadata.json';

import styles from './Home.module.css';

const fetchAvatars = fetch(`/metadata/avatar.json`);

const Home: Component = () => {
  const [avatarGallery, setAvatarGallery] = createSignal<GalleryEntryData>();
  const [time, setTime] = createSignal(`0:00 PM`);

  const socialLinks = [
    {
      title: `bluesky`,
      url: `https://bsky.app/profile/jackdotjs.bsky.social`,
      style: styles.bluesky
    },
    {
      title: `github`,
      url: `https://github.com/JackDotJS`,
      style: styles.github
    },
    {
      title: `discord`,
      text: `@jackdotjs`,
      style: styles.discord
    },
    {
      title: `steam`,
      url: `https://steamcommunity.com/id/JackDotJS/`,
      style: styles.steam
    },
    {
      title: `youtube`,
      url: `https://www.youtube.com/@JackDotJS`,
      style: styles.youtube
    },
    {
      title: `ko-fi`,
      url: `https://ko-fi.com/jackdotjs`,
      style: styles.kofi
    },
  ]

  const updateMyTime = () => {
    setTime(new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: `America/Los_Angeles`
    }));
  }

  // FIXME: need a type for this
  const { setLBData }: any = useContext(LightBoxContext);

  onMount(() => {
    document.title = `${metadata.TITLE} - jackiedotjs`;

    updateMyTime();
    setInterval(updateMyTime, 1000);

    fetchAvatars.then(async (orgResponse) => {
      const response = orgResponse.clone();

      if (response.status !== 200) {
        return console.error(`couldn't fetch avatar gallery data: ${response.status}`);
      }
    
      const data: GalleryEntryData = JSON.parse(await response.text());
    
      // console.debug(data);
      setAvatarGallery(data);
    });
  });

  return (
    <main>
      <div class={styles.whoami}>
        <a class={styles.avatar} href="javascript:void(0)" onClick={() => setLBData(avatarGallery)}>
          <img src="/assets/avatars/icon.png" alt="Avatar" />
        </a>
        <div class={styles.summary}>
          <h1>i'm jackie. i make stuff.</h1>
          <p>
            3d artist, designer, programmer, writer. <em>(she/her)</em><br/>
            <br/>
            it's about <em>{time()}</em> my time.
          </p>
        </div>
      </div>

      <h2>here's some places you can find me at</h2>

      <div class={styles.linklist}>
        <For each={socialLinks}>
          {(item) => {
            if (item.text) {
              let container!: HTMLDivElement;
              let checkbox!: HTMLInputElement;
              let buttonContentWrapper!: HTMLDivElement;
              let notification!: HTMLSpanElement;
              let button!: HTMLButtonElement;

              let keepCheckboxState = false;

              // i already tried doing all this with css only.
              // its 1:30 in the morning and im tired of webdev.
              // i'm sorry

              const pointerEnterHandler = (e: PointerEvent) => {
                if (checkbox.checked) return;

                if (e.pointerType === `touch`) {
                  const buttonRect = container.getBoundingClientRect();
                  const relX = e.clientX - buttonRect.left;
                  
                  if (relX >= (buttonRect.width / 2)) {
                    // cursor is on right half
                    buttonContentWrapper.classList.remove(styles.flipButtonLocation)
                  } else {
                    // cursor is on left half
                    buttonContentWrapper.classList.add(styles.flipButtonLocation)
                  }
                }

                checkbox.checked = true;
              }

              const forceCheckboxTrue = () => {
                checkbox.checked = true;
              }

              const forceCheckboxFalse = () => {
                checkbox.checked = false;
              }

              const copyButtonClickHandler = async (e: Event) => {
                await navigator.clipboard.writeText(item.text);

                // trigger copied animation
                notification.classList.remove(styles.copyAnimator);
                void notification.offsetWidth;
                notification.classList.add(styles.copyAnimator);
              }

              const buttonFocusHandler = () => {
                if (container.querySelectorAll(`*:has(:focus-visible)`).length === 0) return;

                keepCheckboxState = true;
                forceCheckboxTrue();
              }

              const buttonBlurHandler = () => {
                keepCheckboxState = false;

                // console.debug(document.activeElement);

                if (document.activeElement == null) return;
                if (buttonIsActiveElement(document.activeElement)) return;
                if (container.querySelectorAll(`*:has(:hover)`).length === 0) return;

                forceCheckboxFalse();
              }

              const containerMouseLeaveHandler = () => {
                if (keepCheckboxState) return;
                forceCheckboxFalse();
              }

              const buttonIsActiveElement = (target: Node|Element|HTMLElement): boolean => {
                const descendants = container.querySelectorAll(`*`);
                let found = false;
                for (const node of descendants) {
                  if (target === node) {
                    found = true;
                    break;
                  }
                }
                
                // console.debug(found);

                return found;
              }

              document.addEventListener(`click`, (e: MouseEvent) => {
                if (e.target == null) return;
                if (!(e.target instanceof Node)) return;

                if (!buttonIsActiveElement(e.target)) {
                  checkbox.checked = false;
                }
              });

              return (
                <div 
                  ref={container} 
                  onpointerenter={pointerEnterHandler}
                  onmouseleave={containerMouseLeaveHandler}
                  onclick={forceCheckboxTrue}
                  class={item.style}
                >
                  <input ref={checkbox} type="checkbox" autocomplete="off"/>
                  <span>{item.title}</span>
                  <div ref={buttonContentWrapper}>
                    <button
                      ref={button} 
                      onclick={copyButtonClickHandler}
                      onfocus={buttonFocusHandler}
                      onblur={buttonBlurHandler}
                    >
                      copy
                    </button>
                    <div>
                      <span class={styles.textButtonContent}>{item.text}</span>
                      <span class={styles.textCopyNotification} ref={notification}> <IconCheck/> copied!</span>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <a
                href={item.url} 
                rel="external"
                class={item.style}
              >
                <span>{item.title}</span>
              </a>
            )
          }}
        </For>
      </div>

      <span>if it's not linked here, chances are it's not me. <em>you have been warned!</em></span>
    </main>
  );
};

export default Home;