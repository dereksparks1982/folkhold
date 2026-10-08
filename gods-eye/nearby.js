(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const types = Object.freeze({
    mosques: {radius:3200, clauses:['["amenity"="place_of_worship"]["religion"="muslim"]']},
    food: {radius:2300, clauses:['["amenity"~"^(restaurant|cafe|fast_food)$"]']},
    history: {radius:3800, clauses:['["historic"]','["tourism"="museum"]']},
    adventure: {radius:4500, clauses:['["tourism"~"^(viewpoint|attraction)$"]','["natural"~"^(peak|waterfall)$"]']},
    nightlife: {radius:3000, clauses:['["amenity"~"^(bar|pub|nightclub)$"]']}
  });
  let renderer=null,point=null,busy=false,lastRequest=0,requestSerial=0;
  const cache=new Map();
  const valid=(lat,lon)=>Number.isFinite(lat)&&Math.abs(lat)<=90&&Number.isFinite(lon)&&Math.abs(lon)<=180;
  const say=message=>{if($('gods-eye-nearby-status'))$('gods-eye-nearby-status').textContent=message;};
  const haversine=(a,b,c,d)=>{
    const R=6371, x=(c-a)*Math.PI/180, y=(d-b)*Math.PI/180;
    const z=Math.sin(x/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(y/2)**2;
    return 2*R*Math.atan2(Math.sqrt(z),Math.sqrt(1-z));
  };
  function buildQuery(kind,lat,lon) {
    const {radius,clauses}=types[kind];
    const parts=clauses.map(tag=>'nwr(around:'+radius+','+lat.toFixed(5)+','+lon.toFixed(5)+')'+tag+';').join('');
    return '[out:json][timeout:16];('+parts+');out center 35;';
  }
  function clear() {
    renderer?.clearNearby();
    $('gods-eye-nearby-results')?.replaceChildren();
  }
  function pointFor(item){
    const lat=Number(item.lat??item.center?.lat),lon=Number(item.lon??item.center?.lon);
    return valid(lat,lon)?{lat,lon}:null;
  }
  function title(item){return String(item.tags?.name||item.tags?.['name:en']||item.tags?.amenity||item.tags?.tourism||item.tags?.historic||'Unnamed place');}
  async function find(kind) {
    if(!types[kind]||busy)return;
    if(!point){say('Search a place or choose Use My Location first.');return;}
    if(!renderer){say('Wait for the Wayfarer map to load.');return;}
    const key=kind+':'+point.lat.toFixed(3)+':'+point.lon.toFixed(3);
    if(!cache.has(key)&&Date.now()-lastRequest<3000){say('Please wait a few seconds before another request.');return;}
    busy=true;lastRequest=Date.now();const serial=++requestSerial;
    document.querySelectorAll('[data-nearby]').forEach(b=>{
      b.disabled=true;b.setAttribute('aria-pressed',String(b.dataset.nearby===kind));
    });
    say('Looking for '+kind+' around '+point.label+'…');clear();
    try {
      let entries=cache.get(key);
      if(!entries){
        const query=buildQuery(kind,point.lat,point.lon);
        const response=await fetch('https://overpass.kumi.systems/api/interpreter?data='+encodeURIComponent(query),{
          headers:{Accept:'application/json'},referrerPolicy:'strict-origin-when-cross-origin'
        });
        if(!response.ok)throw Error('Provider busy');
        const data=await response.json();
        if(!Array.isArray(data.elements))throw Error('Invalid provider data');
        entries=data.elements.filter(item=>!!pointFor(item)).slice(0,35);
        cache.set(key,entries);
      }
      if(serial!==requestSerial)return;
      entries=entries.map(item=>({item,coords:pointFor(item)}))
        .filter(x=>x.coords)
        .sort((a,b)=>haversine(point.lat,point.lon,a.coords.lat,a.coords.lon)-haversine(point.lat,point.lon,b.coords.lat,b.coords.lon))
        .slice(0,20);
      renderer.showNearby(entries.map(({item,coords})=>({...coords,label:title(item)})));
      for(const {item,coords} of entries){
        const name=title(item),km=haversine(point.lat,point.lon,coords.lat,coords.lon);
        const li=document.createElement('li'),btn=document.createElement('button');
        btn.type='button';btn.textContent=name+' · '+(km<1?Math.round(km*1000)+' m':km.toFixed(1)+' km')+' away';
        btn.addEventListener('click',()=>{
          renderer.focus(coords.lat,coords.lon,16);renderer.showPopup(coords.lat,coords.lon,name);
        });
        li.append(btn);$('gods-eye-nearby-results').append(li);
      }
      say(entries.length+' nearby '+kind+' listing'+(entries.length===1?'':'s')+'. Select to zoom in. Listings may be outdated.');
    } catch {
      say('Nearby search is unavailable or rate-limited. Please try later or another location.');
    } finally {
      busy=false;document.querySelectorAll('[data-nearby]').forEach(b=>b.disabled=false);
    }
  }
  function start() {
    if(!$('gods-eye-nearby'))return;
    window.addEventListener('folkhold:gods-eye-map-ready',e=>{renderer=e.detail.renderer;});
    window.addEventListener('folkhold:gods-eye-point',e=>{
      const p=e.detail;if(!valid(p.lat,p.lon))return;
      point={lat:p.lat,lon:p.lon,label:p.own?'your location':p.label};
      requestSerial++;clear();say('Looking near '+point.label+'. Pick a category.');
    });
    document.querySelectorAll('[data-nearby]').forEach(btn=>btn.addEventListener('click',()=>find(btn.dataset.nearby)));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
