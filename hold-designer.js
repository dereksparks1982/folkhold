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
      '.fh-door-stage{display:grid;place-items:center;min-height:350px;padding:24px;border-radius:16px;background:radial-gradient(circle at 50% 25%,#efe0c7 0,#c7ad8b 58%,#927451 100%);border:1px solid #b89466;perspective:900px}',
      '.fh-door-frame{--door:#6b4a2e;--door2:#8a6240;--frame:#4c3828;position:relative;width:220px;height:305px;padding:13px;background:var(--frame);box-shadow:0 16px 30px #0005,inset 0 0 0 3px #241b14}',
      '.fh-door-frame.round{border-radius:110px 110px 7px 7px}.fh-door-frame.square{border-radius:7px}.fh-door-frame.gothic{clip-path:polygon(50% 0,100% 18%,100% 100%,0 100%,0 18%);padding-top:34px}',
      '.fh-door-preview{position:relative;width:100%;height:100%;border:0;padding:0;cursor:pointer;background:repeating-linear-gradient(90deg,var(--door) 0,var(--door) 34px,var(--door2) 35px,var(--door2) 67px);box-shadow:inset 0 0 0 3px #2c1c12,inset 0 0 28px #0005;transform-origin:left center;transition:transform .45s ease;color:#f5e9d6}',
      '.fh-door-frame.round .fh-door-preview{border-radius:94px 94px 2px 2px}.fh-door-frame.gothic .fh-door-preview{clip-path:polygon(50% 0,100% 16%,100% 100%,0 100%,0 16%)}.fh-door-preview.open{transform:rotateY(-68deg)}',
      '.fh-door-band{position:absolute;left:5%;right:5%;height:14px;background:linear-gradient(#514f4a,#242421);border:1px solid #8b806c;box-shadow:0 2px 4px #0008}.fh-door-band.a{top:28%}.fh-door-band.b{top:66%}.fh-door-band.light{height:8px;opacity:.72}.fh-door-band.none{display:none}',
      '.fh-door-plate{position:absolute;z-index:3;top:42%;left:50%;transform:translate(-50%,-50%);min-width:112px;max-width:88%;padding:7px 10px;background:#4b3322;color:#f1d498;border:2px solid #b58b4f;box-shadow:0 4px 8px #0007;text-align:center;font:bold 14px Georgia,serif}',
      '.fh-door-knocker{position:absolute;z-index:3;right:21px;top:53%;width:28px;height:36px;border:5px solid #b4935f;border-radius:50%;box-shadow:0 2px 3px #0008}.fh-door-keyhole{position:absolute;z-index:3;right:27px;top:69%;width:10px;height:22px;background:#17120e;border-radius:50% 50% 3px 3px;box-shadow:0 0 0 2px #a77b49}',
      '.fh-door-mat{margin-top:13px;max-width:310px;padding:8px 13px;background:#5e4936;color:#f3e4ca;border:2px solid #83694d;text-align:center;font:11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}',
      '.fh-door-copy p{color:#655b50;line-height:1.55}.fh-door-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}.fh-door-note{font-size:12px;color:#786d61;margin-top:9px}',
      '.fh-door-dialog{width:min(650px,calc(100vw - 22px));border:0;padding:0;background:transparent}.fh-door-form{background:#fff8ee;color:#2b231d;border:2px solid #a98552;border-radius:18px;padding:24px;box-shadow:0 28px 90px #0008}.fh-door-form h2{margin:0 0 15px}.fh-door-controls{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fh-door-controls label{display:grid;gap:6px;font-weight:bold}.fh-door-controls input,.fh-door-controls select{width:100%;padding:10px;border:1px solid #c5ae8a;border-radius:9px;background:#fffdf8;color:#2b231d}.fh-door-controls .wide{grid-column:1/-1}.fh-door-dialog-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin-top:19px}',
      '@media(max-width:760px){.fh-door-section{grid-template-columns:1fr;padding:17px}.fh-door-stage{min-height:325px}.fh-door-frame{width:190px;height:265px}.fh-door-controls{grid-template-columns:1fr}.fh-door-controls .wide{grid-column:auto}}'
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
      '<div class="fh-door-stage"><div><div class="fh-door-frame round" data-fh-door-frame>' +
      '<button class="fh-door-preview" type="button" data-fh-door aria-label="Hold front door. Double-click to leave a knock.">' +
      '<span class="fh-door-band a"></span><span class="fh-door-band b"></span><span class="fh-door-plate" data-fh-door-plate></span>' +
      '<span class="fh-door-knocker" aria-hidden="true"></span><span class="fh-door-keyhole" aria-hidden="true"></span></button></div>' +
      '<div class="fh-door-mat" data-fh-door-welcome></div></div></div>' +
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
      frame.className = 'fh-door-frame ' + design.shape;
      frame.style.setProperty('--door', colors[0]);
      frame.style.setProperty('--door2', colors[1]);
      frame.style.setProperty('--frame', colors[2]);
      door.classList.toggle('open', design.open);
      section.querySelectorAll('.fh-door-band').forEach(band => {
        band.classList.remove('none','light','heavy');
        band.classList.add(design.iron);
      });
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
    section.querySelector('[data-fh-door]').addEventListener('dblclick', () => {
      if (!confirm('Do you wish to leave a knock?')) return;
      window.dispatchEvent(new CustomEvent('folkhold:knock', { detail: { hold: design.name, source: 'front-door' } }));
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