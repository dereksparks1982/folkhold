(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let selected = null, start = null, end = null, map = null, L = null, path = null;
  let busy = false, lastRequest = 0;
  const status = message => { if ($('gods-eye-route-status')) $('gods-eye-route-status').textContent=message; };
  const good = point => point && Number.isFinite(point.lat) && Number.isFinite(point.lon) &&
    Math.abs(point.lat)<=90 && Math.abs(point.lon)<=180;
  const name = point => point?.label || (point ? point.lat.toFixed(4)+', '+point.lon.toFixed(4) : 'Not set');
  function render() {
    document.querySelector('[data-route-start]').textContent=start ? name(start) : 'Choose start or Use My Location';
    document.querySelector('[data-route-end]').textContent=end ? name(end) : 'Search and select destination';
    $('gods-eye-navigate').hidden=true;
  }
  function clearLine() { if(path && map)map.removeLayer(path);path=null; }
  function externalLink(mode) {
    if(!good(start)||!good(end))return;
    const u=new URL('https://www.google.com/maps/dir/');
    u.searchParams.set('api','1');
    u.searchParams.set('origin',start.lat+','+start.lon);
    u.searchParams.set('destination',end.lat+','+end.lon);
    u.searchParams.set('travelmode',mode==='pedestrian'?'walking':'driving');
    const a=$('gods-eye-navigate');a.href=u.href;a.hidden=false;
  }
  async function getRoute(event) {
    event.preventDefault();
    if(!good(start)||!good(end)){status('Select both a start and destination first.');return;}
    if(!map||!L){status('Open the map first.');return;}
    if(busy)return;
    // Demo router fair-use: manual action only, with local rate limiting.
    if(Date.now()-lastRequest<1500){status('Wait a moment before requesting another route.');return;}
    lastRequest=Date.now();busy=true;
    const button=$('gods-eye-route-form').querySelector('[type="submit"]');
    button.disabled=true;
    const mode=$('gods-eye-travel-mode').value;
    status('Finding a real road route…');
    const request = {
      locations:[{lat:start.lat,lon:start.lon},{lat:end.lat,lon:end.lon}],
      costing:mode==='pedestrian'?'pedestrian':'auto',
      format:'osrm',shape_format:'geojson',units:'kilometers',
      directions_options:{language:'en-US'}
    };
    try {
      // FOSSGIS Valhalla community demo; replace with a provisioned router before scale.
      const url=new URL('https://valhalla1.openstreetmap.de/route');
      url.searchParams.set('json',JSON.stringify(request));
      const response=await fetch(url,{headers:{'X-Client-Id':'folkhold.github.io'}});
      if(!response.ok)throw Error('Routing service unavailable');
      const data=await response.json();
      const route=data.routes?.[0], coords=route?.geometry?.coordinates;
      if(!Array.isArray(coords)||coords.length<2)throw Error('No route geometry returned');
      const line=coords.filter(c=>Array.isArray(c)&&c.length>=2).map(c=>[Number(c[1]),Number(c[0])]).filter(c=>Number.isFinite(c[0])&&Number.isFinite(c[1]));
      if(line.length<2)throw Error('Invalid route geometry');
      clearLine();
      path=L.polyline(line,{color:'#236651',weight:5,opacity:0.9}).addTo(map);
      map.fitBounds(path.getBounds(),{padding:[20,20]});
      const km=Number(route.distance)/1000;
      const min=Number(route.duration)/60;
      status('Road route: '+(Number.isFinite(km)?km.toFixed(1)+' km':'distance unavailable')+
        (Number.isFinite(min)?' · about '+Math.round(min)+' min':'')+'. Estimate only; verify local conditions.');
      externalLink(mode);
    } catch {
      clearLine();
      status('No road route available from this demo server. Use Open in Google Maps to navigate externally, or try closer places.');
      externalLink(mode);
    } finally {busy=false;button.disabled=false;}
  }
  function init() {
    if(!$('gods-eye-route'))return;
    window.addEventListener('folkhold:gods-eye-map-ready',event=>{
      map=event.detail.map;L=event.detail.leaflet;
    });
    window.addEventListener('folkhold:gods-eye-point',event=>{
      const p=event.detail;
      if(!good(p))return;
      if(p.own){start={lat:p.lat,lon:p.lon,label:'My current location'};}
      else {selected={lat:p.lat,lon:p.lon,label:p.label};end={...selected};}
      clearLine();render();
      status('Route points updated. Set your starting place, then Show Road Route.');
    });
    document.querySelector('[data-route-set-start]').addEventListener('click',()=>{
      if(!selected){status('First search and select a place on the map.');return;}
      start={...selected};clearLine();render();status('Starting place set. Search for your destination next.');
    });
    document.querySelector('[data-route-set-end]').addEventListener('click',()=>{
      if(!selected){status('Search and select a destination first.');return;}
      end={...selected};clearLine();render();status('Destination set.');
    });
    document.querySelector('[data-route-clear]').addEventListener('click',()=>{
      start=null;end=null;selected=null;clearLine();render();status('Route cleared. Search to set destinations.');
    });
    $('gods-eye-route-form').addEventListener('submit',getRoute);
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
