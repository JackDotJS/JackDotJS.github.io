import type { Component } from 'solid-js';

import styles from './Commissions.module.css';

// TODO: add info regarding art trades

const Commissions: Component = () => {
  return (
    <main class={styles.comms}>
      <h2>commission info</h2>

      <h1>status: closed</h1>
      <h3>0/3 slots taken</h3>

      <table>
        <thead>
          <tr>
            <th>will do</th>
            <th>will <em>not</em> do</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>anthros and furries, including hybrid species</td>
            <td>anything racist, sexist, queer&shy;phobic, or otherwise discriminatory</td>
          </tr>
          <tr>
            <td>aliens, monsters, and any other non-human creatures (depends on how they look)</td>
            <td>nsfw/adult content, including "extremely questionable" content</td>
          </tr>
          <tr>
            <td>weapons, tools, and other items</td>
            <td>excessive gore</td>
          </tr>
          <tr>
            <td>fictional vehicles, including spaceships</td>
            <td>fetish art</td>
          </tr>
          <tr>
            <td>interior environments</td>
            <td>any excessively complex subjects</td>
          </tr>
          <tr>
            <td>logos and other 2d graphics</td>
            <td>softbody, cloth, and other complex physics simulations</td>
          </tr>
        </tbody>
      </table>

      <p>this is meant to be a general guide. if you're unsure of something, feel free to ask!</p>

      <h2>what i do</h2>
      <p>
        i'm a blender artist! i make 3d models, and it's something i've been doing for over 13 years. most of the time i'm just making my own things, but now i'm hoping to expand my talents by doing work for others (like you, perhaps!). whether it's for a video game project, or just some cool artwork to look at, i can probably do it for you! i can also use blender to make logos and other 2d graphics, which might sound weird? but trust me, it works lol.<br/>
        <br/>
        if you're interested, feel free to contact me! my preferred method of contact is via Discord, and you can find me through my own server, <a href="/links">which can found on the links page here.</a><br/>
        <br/>
        also feel free to check out <a href="/gallery">my gallery</a> for examples of my work!
      </p>

      <h2>pricing</h2>
      <p>
        all commissions start at $40 and will be raised based on the complexity of the work you want done. you will be required to pay at least 50% of the commission upfront (see <a href="#tos">ToS for details</a>). feel free to contact me for a quote!<br/>
        <br/>i admit that i'm still new to doing commission work like this, and i'm not yet sure what prices i'm comfortable with. basically, prices may vary.<br/>
      </p>

      <a id="tos"><h2>commission terms of service</h2></a>

      <p>last updated: <time datetime="2024-03-26">march 26, 2024</time></p>

      <a id="tos-general-terms"><h3>I. General Terms</h3></a>
      <ul>
        <li>By commissioning me, you are agreeing to these terms. Should you have any questions about these terms, please don't hesitate to contact me.</li>
        <li>I, the artist, reserve the right to update these terms at any time, without explanation.</li>
        <li>I reserve the right to refuse or discontinue a commission at any time, without explanation.</li>
        <li>I retain the rights over any commissioned works, unless you purchase the commercial rights (see <a href="#tos-payment-and-fees">"Payment & Fees"</a>).</li>
        <li>I do not claim rights to any character or other intellectual property used in the commissioned work.</li>
        <li>I may post work-in-progress and/or finished images of the commission on my social media pages with a watermark. If this is an issue, please inform me <em>before</em> (preferably) or <em>during</em> the commission process.</li>
        <li>Static image artwork will generally be delivered in .PNG format. I can also provide .JPEG formats, if desired.</li>
        <li>Source files for any work can be provided for an additional fee of 10$.</li>
        <li>Failure to comply with these terms may result in you being permanently blacklisted from commissioning me in the future.</li>
      </ul>

      <a id="tos-client-obligations"><h3>II. Client Obligations</h3></a>
      <ul>
        <li>As the client, you will provide a clear and concise description of the work you wish to commission me for.</li>
        <li>If applicable, you will provide clear reference images for the work.</li>
        <li>You will maintain professional conduct throughout the commission process.</li>
        <li>You will respond within a timely fashion.</li>
        <li>You will assume responsibility for any clear descriptions, references, and other important information you fail to provide that results in my inability to complete your commission to your full satisfaction.</li>
        <li>You will carefully read through my Terms of Service.</li>
        <li>You will provide payment for the commission work and any associated fees.</li>
        <li>You will provide an e-mail to which I can send invoices.</li>
        <li>If applicable, you will provide proof of consent for the use of other people's characters in the commission work. I will not do "surprise gifts".</li>
      </ul>

      <a id="tos-payment-and-fees"><h3>III. Payment & Fees</h3></a>
      <ul>
        <li>Payment is in USD and processed via PayPal invoices.</li>
        <li><em>You will be required to pay at least 50% of the commission price upfront, and the remaining 50% by completion of the commission.</em></li>
        <li>If you are not able to pay the last 50% on time, I am generally willing to give you a grace period of up to 1 week to sort out your finances.</li>
        <li>For commercial use of the commission, you must purchase the rights from me at 300% of the original price of the work.</li>
        <li>Additional fees will be charged for excessive or major revisions of the commission work (see <a href="#tos-revisions">"Revisions"</a>). The exact amount for these fees will be dependent upon the complexity of the commission and/or the complexity of the revision that is requested.</li>
        <li>For works that involve static images, additional fees will be charged for extremely high resolutions. (see <a href="#tos-work-process">"Work Process"</a>)</li>
      </ul>

      <a id="tos-refund-policy"><h3>IV. Refund Policy</h3></a>
      <ul>
        <li>Full refunds are available at any time before commission work has started. </li>
        <li><em>I will not offer any refunds for work that is fully (or nearly) completed.</em></li>
        <li>If you, the client, cancel the commission during the work process, the amount refunded will be equivalent to the amount of work not done. The amount is up to my discretion and will generally be handled on a case-by-case basis.</li>
        <li>If I, the artist, cancel the commission for any reason, I will offer a full refund. Additionally, I will offer a full refund if I cannot complete the work within 90 days of purchase.</li>
        <li>You may not file a chargeback against me after you have given approval of the finished work.</li>
      </ul>

      <a id="tos-work-process"><h3>V. Work Process</h3></a>
      <ul>
        <li>I will send you regular updates throughout the work process, via your communication method of choice.</li>
        <li>In-progress shots of the work will be sent as low-resolution, watermarked images.</li>
        <li>I will always do my best to complete your commission within a timely manner, but please understand that <em>this is not my full-time job</em>, and my real life responsibilities can and will get in the way from time to time. As such, should any major delay occur in the process of the commission, I will notify you as soon as possible.</li>
        <li>For works that involve static images, the resolution of the finished artwork will be around 2000x2000 px, and will vary depending on the needs of the work itself (e.g, aspect ratios). Extra large resolutions (up to 10000x10000 px) are available upon request, for an additional fee.</li>
      </ul>

      <a id="tos-revisions"><h3>VI. Revisions</h3></a>
      <ul>
        <li>One major revision is allowed in the early stages of the work process, and is covered in the initial commission price. Additional major revisions will incur additional fees (see <a href="#tos-payment-and-fees">"Payment & Fees"</a>).</li>
        <li>A limited amount of minor revisions are allowed throughout the entire work process, and are covered in the initial commission price. Excessive minor revisions to the point that forward progress on the work has halted will incur additional fees (again, see <a href="#tos-payment-and-fees">"Payment & Fees"</a>).</li>
        <li>Revisions due to my own negligence are free of charge.</li>
        <li>As the artist, it is up to my discretion as to what constitutes minor and major revisions.</li>
      </ul>

      <a id="tos-usage-policy"><h3>VII. Usage Policy</h3></a>
      <ul>
        <li>All commissioned work is for non-commercial purposes only, unless you purchase commercial rights to the work (see <a href="#tos-payment-and-fees">"Payment & Fees"</a>).</li>
        <li>As the client, you may generally use the finished work anywhere, in any way you like, as long as proper credit is given (including a link to my website). This also applies to commercial usage of the work.</li>
        <li>You may not claim the work as your own.</li>
        <li>You may not remove my watermark/signature.</li>
        <li>You may not use the work for anything involving NFTs (Non-Fungible Tokens), blockchain, cryptocurrency, or AI training in any way, shape, or form.</li>
        <li>You may not reproduce the work commercially (e.g, printing the work on t-shirts, mugs, and other merchandise items) without purchasing the rights from me (again, see <a href="#tos-payment-and-fees">"Payment & Fees"</a>).</li>
      </ul>
    </main>
  );
};

export default Commissions;