(() => {
  'use strict';

  const KEY = 'folkhold.holdDoor.v1';
  const DEFAULTS = {
    finish: 'oak',
    shape: 'round',
    iron: 'heavy',
    name: "Derek's Hold",
    welcome: 'Everyone is Welcome',
    open: false
  };
  const FINISHES = {
    oak: ['#6b4a2e','#8a6240','#4c3828'],
    walnut: ['#3f2b21','#5a3a29','#2d211b'],
    weathered: ['#645b4e','#817565','#464038'],
    green: ['#294c3d','#3f6a55','#302d26']
  };

  function clean(raw) {
    const d = Object.assign({}, DEFAULTS, raw || {});
    if (!FINISHES[d.finish]) d.finish = DEFAULTS.finish;
    if (!['round','square','gothic'].includes(d.shape)) d.shape = DEFAULTS.shape;
    if (!['none','light','heavy'].includes(d.iron)) d.iron = DEFAULTS.iron;
    d.name = String(d.name || DEFAULTS.name).slice(0, 40);
    d.welcome = String(d.welcome || DEFAULTS.welcome).slice(0, 80);
    d.open = Boolean(d.open);
    return d;
  }

  function read() {
    try { return clean(JSON.parse(localStorage.getItem(KEY) || 'null')); }
    catch { return Object.assign({}, DEFAULTS); }
  }

  function save(d) {
    localStorage.setItem(KEY, JSON.stringify(clean(d)));
  }

  function addStyles() {
    if (document.getElementById('folkhold-door-designer-style')) return;
    const style = document.createElement('style');
    style.id = 'folkhold-door-designer-style';
    style.textContent = [
      '.fh-door-section{margin:18px 0 24px;padding:24px;display:grid;grid-template-columns:minmax(250px,.8fr) minmax(0,1.2fr);gap:28px;align-items:center}',
      '.fh-door-stage{display:grid;place-items:center;min-height:445px;padding:24px;border-radius:16px;background:radial-gradient(circle at 50% 25%,#efe0c7 0,#c7ad8b 58%,#927451 100%);border:1px solid #b89466}',
      '.fh-door-stage .fh-shared-door{align-self:center;justify-self:center;display:block;width:250px}',
      '.fh-shared-door.fh-square .door{border-radius:4px 4px 2px 2px!important}.fh-shared-door.fh-square .door::after{border-radius:2px!important}.fh-shared-door.fh-gothic .door{clip-path:polygon(50% 0,100% 24%,100% 100%,0 100%,0 24%)!important;border-radius:0!important}',
      '.fh-shared-door.fh-custom-finish .door{background:repeating-linear-gradient(90deg,var(--fh-door-one) 0 28px,var(--fh-door-two) 28px 31px,var(--fh-door-three) 31px 57px)!important}.fh-shared-door.fh-light .door::before{height:7px!important}.fh-shared-door.fh-none .door::before{display:none!important}.fh-shared-door.fh-open .door{transform:perspective(900px) rotateY(-40deg)!important;transform-origin:left center!important}',
      '.fh-door-stage .door{cursor:pointer!important}.fh-door-stage .door:focus-visible{outline:3px solid var(--brass-light);outline-offset:5px}',
      '.fh-door-stage .door-sign,.fh-door-stage .doormat{max-width:250px}',
      '.fh-door-stage .doormat{text-transform:none!important}',
      '.fh-door-section .fh-door-note{font-size:12px}',
      '.fh-door-copy h2{margin:0 0 10px}',
      '.fh-door-copy p{color:#655b50;line-height:1.55}.fh-door-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}.fh-door-note{font-size:12px;color:#786d61;margin-top:9px}',
      '.fh-door-dialog{width:min(650px,calc(100vw - 22px));border:0;padding:0;background:transparent}.fh-door-form{background:#fff8ee;color:#2b231d;border:2px solid #a98552;border-radius:18px;padding:24px;box-shadow:0 28px 90px #0008}.fh-door-form h2{margin:0 0 15px}.fh-door-controls{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fh-door-controls label{display:grid;gap:6px;font-weight:bold}.fh-door-controls input,.fh-door-controls select{width:100%;padding:10px;border:1px solid #c5ae8a;border-radius:9px;background:#fffdf8;color:#2b231d}.fh-door-controls .wide{grid-column:1/-1}.fh-door-dialog-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin-top:19px}',
      '@media(max-width:760px){.fh-door-section{grid-template-columns:1fr;padding:17px}.fh-door-stage{min-height:415px}.fh-door-controls{grid-template-columns:1fr}.fh-door-controls .wide{grid-column:auto}}'
    ].join('');
    document.head.append(style);
  }

  function install() {
    const hold = document.querySelector('[data-screen="hold"]');
    const cover = hold && hold.querySelector('.hold-cover');
    if (!hold || !cover || document.getElementById('folkhold-front-door')) return;

    addStyles();
    const section = document.createElement('section');
    section.id = 'folkhold-front-door';
    section.className = 'panel fh-door-section';
    section.innerHTML =
      '<div class="fh-door-stage"><div class="hero-door fh-shared-door" data-fh-door-frame>' +
      '<div class="door-sign" data-fh-door-plate></div>' +
      '<div class="door fh-door-preview" data-fh-door role="button" tabindex="0" aria-label="Hold front door. Double-click to leave a knock.">' +
      '<span class="door-keyhole" aria-hidden="true"></span></div>' +
      '<div class="doormat" data-fh-door-welcome></div></div></div>' +
      '<div class="fh-door-copy"><span class="eyebrow">YOUR FRONT DOOR</span><h2 data-fh-door-title></h2>' +
      '<p>The front door is a public identity surface. Rooms behind it can still be public, Keyed, or private.</p>' +
      '<div class="fh-door-actions"><button class="secondary" type="button" data-fh-customize>Customize Door</button>' +
      '<button class="secondary" type="button" data-fh-toggle>Open Door</button></div>' +
      '<p class="fh-door-note">Double-click the door to leave a Knock. Door choices stay in this browser until account/D1 persistence is active.</p></div>';
    cover.insertAdjacentElement('afterend', section);

    const dialog = document.createElement('dialog');
    dialog.className = 'fh-door-dialog';
    dialog.innerHTML =
      '<form method="dialog" class="fh-door-form"><span class="eyebrow">HOLD DESIGNER</span><h2>Front Door</h2>' +
      '<div class="fh-door-controls">' +
      '<label>Finish<select name="finish"><option value="oak">Oak</option><option value="walnut">Walnut</option><option value="weathered">Weathered wood</option><option value="green">Green-painted wood</option></select></label>' +
      '<label>Shape<select name="shape"><option value="round">Round arch</option><option value="square">Square</option><option value="gothic">Pointed arch</option></select></label>' +
      '<label>Ironwork<select name="iron"><option value="heavy">Heavy bands</option><option value="light">Light bands</option><option value="none">No bands</option></select></label>' +
      '<label>Door state<select name="doorState"><option value="closed">Closed</option><option value="open">Open</option></select></label>' +
      '<label class="wide">Name plate<input name="name" maxlength="40"></label>' +
      '<label class="wide">Welcome phrase<input name="welcome" maxlength="80"></label></div>' +
      '<div class="fh-door-dialog-actions"><button type="button" class="secondary" data-fh-reset>Reset</button><button value="cancel" class="secondary">Cancel</button><button value="save" class="primary">Save Door</button></div></form>';
    document.body.append(dialog);

    const form = dialog.querySelector('form');
    let design = read();

    function render() {
      design = clean(design);
      const colors = FINISHES[design.finish];
      const frame = section.querySelector('[data-fh-door-frame]');
      const door = section.querySelector('[data-fh-door]');
      // The Hub and Hold now use one canonical medieval door design and settings.
      // No separate gold ring/knocker exists on the Hold door.
      for(const shared of [document.querySelector('[data-screen="home"] .hero-door'),frame]){
        if(!shared)continue;
        shared.classList.add('fh-shared-door');
        shared.classList.toggle('fh-square',design.shape==='square');
        shared.classList.toggle('fh-gothic',design.shape==='gothic');
        shared.classList.toggle('fh-custom-finish',design.finish!=='oak');
        shared.classList.toggle('fh-light',design.iron==='light');
        shared.classList.toggle('fh-none',design.iron==='none');
        shared.classList.toggle('fh-open',design.open);
        shared.style.setProperty('--fh-door-one',colors[0]);
        shared.style.setProperty('--fh-door-two',colors[1]);
        shared.style.setProperty('--fh-door-three',colors[2]);
        const sign=shared.querySelector('.door-sign');
        const welcome=shared.querySelector('.doormat');
        if(sign)sign.textContent=design.name;
        if(welcome)welcome.textContent=design.welcome;
      }
      door.setAttribute('aria-label','Knock on '+design.name);
      section.querySelector('[data-fh-door-plate]').textContent = design.name;
      section.querySelector('[data-fh-door-title]').textContent = design.name;
      section.querySelector('[data-fh-door-welcome]').textContent = design.welcome;
      section.querySelector('[data-fh-toggle]').textContent = design.open ? 'Close Door' : 'Open Door';
      const status = cover.querySelector('.status-line strong');
      if (status) status.textContent = design.welcome;
    }

    function fill() {
      form.elements.finish.value = design.finish;
      form.elements.shape.value = design.shape;
      form.elements.iron.value = design.iron;
      form.elements.doorState.value = design.open ? 'open' : 'closed';
      form.elements.name.value = design.name;
      form.elements.welcome.value = design.welcome;
    }

    function openDesigner(event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      fill();
      dialog.showModal();
    }

    const legacy = cover.querySelector('[data-action="customize"]');
    if (legacy) {
      legacy.textContent = 'Customize Front Door';
      legacy.dataset.action = 'customize-door';
      legacy.addEventListener('click', openDesigner);
    }
    section.querySelector('[data-fh-customize]').addEventListener('click', openDesigner);
    section.querySelector('[data-fh-toggle]').addEventListener('click', () => {
      design.open = !design.open;
      save(design);
      render();
    });
    const knock = () => {
      const existing = document.getElementById('folkhold-knock-dialog');
      if(existing && !existing.open) existing.showModal();
      else if(!existing && confirm('Do you wish to leave a knock?')) {
        window.dispatchEvent(new CustomEvent('folkhold:knock', { detail: { hold: design.name, source: 'front-door' } }));
      }
    };
    section.querySelector('[data-fh-door]').addEventListener('dblclick',knock);
    section.querySelector('[data-fh-door]').addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();knock();}
    });
    dialog.querySelector('[data-fh-reset]').addEventListener('click', () => {
      design = Object.assign({}, DEFAULTS);
      save(design);
      fill();
      render();
    });
    dialog.addEventListener('close', () => {
      if (dialog.returnValue !== 'save') return;
      design = clean({
        finish: form.elements.finish.value,
        shape: form.elements.shape.value,
        iron: form.elements.iron.value,
        name: form.elements.name.value,
        welcome: form.elements.welcome.value,
        open: form.elements.doorState.value === 'open'
      });
      save(design);
      render();
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once:true });
  else install();
})();