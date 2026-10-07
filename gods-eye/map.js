(() => {
  'use strict';
  const urls = Object.freeze({
    css: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    js: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    tiles: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    places: 'https://photon.komoot.io/api/'
  });
  const world = [22, 10];
  const $ = id => document.getElementById(id);
  const valid = (lat, lon) => Number.isFinite(lat) && Math.abs(lat) <= 90 && Number.isFinite(lon) && Math.abs(lon) <= 180;
  let map, owned, found, libraryPromise;
  let busy = false, lastQueryAt = 0;
  const cache = new Map();

  function status(message) { if ($('gods-eye-status')) $('gods-eye-status').textContent = message; }
  function loadLibrary() {
    if (globalThis.L?.map) return Promise.resolve();
    if (libraryPromise) return libraryPromise;
    libraryPromise = new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = urls.css; link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = 'anonymous'; document.head.append(link);
      const script = document.createElement('script'); script.src = urls.js;
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = 'anonymous'; script.onload = () => globalThis.L?.map ? resolve() : reject(new Error('Leaflet unavailable'));
      script.onerror = () => reject(new Error('Map library not available'));
      document.head.append(script);
    }).catch(error => { libraryPromise = null; throw error; });
    return libraryPromise;
  }
  async function openMap() {
    const screen = document.querySelector('[data-screen="gods-eye"]');
    if (!screen?.classList.contains('active')) return;
    if (map) { setTimeout(() => map.invalidateSize(), 80); return; }
    status('Loading the world map…');
    try {
      await loadLibrary();
      if (!screen.classList.contains('active') || map) return;
      const L = globalThis.L;
      map = L.map('gods-eye-map', {scrollWheelZoom: false, worldCopyJump: true}).setView(world, 2);
      L.tileLayer(urls.tiles, {maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'}).addTo(map);
      status('Drag or pinch to explore. Search a place or choose Use My Location.');
      setTimeout(() => map.invalidateSize(), 180);
    } catch {
      status('The map could not load. Check your connection and try entering God\'s Eye again.');
    }
  }
  function pin(lat,lon,label,isOwn=false) {
    if (!map || !valid(lat,lon)) return;
    const L = globalThis.L;
    if (isOwn) {
      if (owned) map.removeLayer(owned);
      owned = L.circleMarker([lat,lon], {radius:8,weight:3,color:'#fff',fillColor:'#285f9b',fillOpacity:1}).addTo(map);
      owned.bindPopup('Your approximate position');
    } else {
      if (found) map.removeLayer(found);
      found = L.circleMarker([lat,lon], {radius:9,weight:3,color:'#fff',fillColor:'#3f644d',fillOpacity:1}).addTo(map);
      const span = document.createElement('span'); span.textContent = label; found.bindPopup(span);
    }
    map.setView([lat,lon],isOwn ? 14 : 12);
  }
  function label(feature) {
    const p = feature?.properties || {};
    return [p.name,p.street,p.housenumber,p.city,p.state,p.country].filter(Boolean).join(', ') || 'Unnamed place';
  }
  async function search(event) {
    event.preventDefault();
    const q=$('gods-eye-query')?.value.trim(), list=$('gods-eye-results');
    if (!q || q.length<2 || busy || !list) return;
    await openMap();
    if (!map) return;
    const key=q.toLowerCase(), now=Date.now();
    if (!cache.has(key) && now-lastQueryAt<1250) { status('Wait a moment before searching again.'); return; }
    busy=true; const button=$('gods-eye-search').querySelector('button[type="submit"]');
    button.disabled=true; list.replaceChildren(); status('Searching for places…');
    try {
      let features=cache.get(key);
      if (!features) {
        lastQueryAt=now;
        const url=new URL(urls.places); url.searchParams.set('q',q); url.searchParams.set('limit','5');
        const response=await fetch(url,{referrerPolicy:'strict-origin-when-cross-origin'});
        if (!response.ok) throw new Error('Place provider unavailable');
        const data=await response.json();
        features=Array.isArray(data.features)?data.features.slice(0,5):[];
        cache.set(key,features);
      }
      let count=0, first=null;
      for (const feature of features) {
        const [lon,lat]=feature.geometry?.coordinates||[];
        if (!valid(lat,lon)) continue;
        const name=label(feature);
        const li=document.createElement('li'), btn=document.createElement('button');
        btn.type='button'; btn.textContent=name;
        btn.addEventListener('click',()=>{pin(lat,lon,name);status('Showing '+name+'.');});
        li.append(btn);list.append(li);count++;
        if(!first)first=[lat,lon,name];
      }
      if(first)pin(...first);
      status(count ? count+' place result'+(count===1?'':'s')+'. Select a result to view it.' : 'No places found. Try a different search.');
    } catch { status('Place search is unavailable right now. You can still explore the map.'); }
    finally {busy=false;button.disabled=false;}
  }
  function locate() {
    if(!map) {status('Open the map first.');return;}
    if(!navigator.geolocation) {status('Location is unavailable in this browser.');return;}
    status('Waiting for location permission…');
    navigator.geolocation.getCurrentPosition(pos => {
      const {latitude,longitude,accuracy}=pos.coords;
      if(!valid(latitude,longitude)) {status('Location coordinates were invalid.');return;}
      pin(latitude,longitude,'Your current position',true);
      status('Approximate position shown (accuracy '+Math.round(accuracy)+' m). This position has not been shared with another Folkhold member.');
    }, error => status(error?.code===1 ? 'Location permission denied. You can still search.' : 'Could not retrieve location. Try again when GPS is available.'),
    {enableHighAccuracy:false,maximumAge:300000,timeout:12000});
  }
  function start() {
    $('gods-eye-search')?.addEventListener('submit',search);
    $('gods-eye-locate')?.addEventListener('click',locate);
    $('gods-eye-world')?.addEventListener('click',()=>{if(map){map.setView(world,2);status('World view.');}});
    document.addEventListener('click',event=>{
      if(event.target.closest?.('[data-view="gods-eye"]')) setTimeout(openMap,75);
    });
    window.addEventListener('hashchange',()=>{if(location.hash==='#gods-eye')setTimeout(openMap,75);});
    if(location.hash==='#gods-eye')setTimeout(openMap,100);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
