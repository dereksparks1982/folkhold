(() => {
  const HANA_FI_ORIGIN = 'hanafi';
  const HANA_FI_URL = 'https://dereksparks1982.github.io/Hanafi-Islam-Learning-Deck/';
  const ORIGIN_KEY = 'folkhold.navigationOrigin';

  const params = new URLSearchParams(window.location.search);
  const source = params.get('from');

  if (source === HANA_FI_ORIGIN) {
    sessionStorage.setItem(ORIGIN_KEY, HANA_FI_ORIGIN);
  } else if (!source) {
    sessionStorage.removeItem(ORIGIN_KEY);
  }

  if (sessionStorage.getItem(ORIGIN_KEY) !== HANA_FI_ORIGIN) return;

  const topbar = document.querySelector('.topbar');
  if (!topbar || document.querySelector('.hanafi-return')) return;

  const link = document.createElement('a');
  link.className = 'hanafi-return';
  link.href = HANA_FI_URL;
  link.textContent = '← Hanafi';
  link.setAttribute('aria-label', 'Return to Hanafi Learning Deck');
  link.addEventListener('click', () => sessionStorage.removeItem(ORIGIN_KEY));

  const avatar = topbar.querySelector('.avatar-button');
  topbar.insertBefore(link, avatar || null);

  if (!document.getElementById('folkhold-hanafi-return-style')) {
    const style = document.createElement('style');
    style.id = 'folkhold-hanafi-return-style';
    style.textContent = `
      .hanafi-return{
        flex:0 0 auto;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-width:max-content;
        padding:9px 11px;
        border:1px solid rgba(213,183,126,.55);
        border-radius:9px;
        background:#211d19;
        color:#eadbc6;
        font:12px Georgia,'Times New Roman',serif;
        text-decoration:none;
        white-space:nowrap;
      }
      .hanafi-return:hover{background:#302a23;color:#fff}
      .hanafi-return:focus-visible{outline:3px solid var(--brass-light);outline-offset:3px}
      @media(max-width:760px){
        .hanafi-return{padding:8px 9px;font-size:11px}
      }
    `;
    document.head.append(style);
  }
})();
