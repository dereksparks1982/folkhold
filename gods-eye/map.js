(() => {
  'use strict';

  // Travel Companion map renderer: OpenLayers. No dependency on the former map engine.
  const urls=Object.freeze({
    css:'https://cdn.jsdelivr.net/npm/ol@10.10.0/ol.css',
    js:'https://cdn.jsdelivr.net/npm/ol@10.10.0/dist/ol.js',
    tiles:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    places:'https://photon.komoot.io/api/'
  });
  const world=[22,10],$=id=>document.getElementById(id);
  const valid=(lat,lon)=>Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180;
  let engine=null, map=null, ownSource=null, foundSource=null, nearbySource=null, routeLayer=null;
  let popup=null, popupLabel=null, libraryPromise=null, opening=null, busy=false,lastQueryAt=0;
  const cache=new Map();

  function status(message){const node=$('gods-eye-status');if(node)node.textContent=message;}
  function project(lat,lon){return globalThis.ol.proj.fromLonLat([lon,lat]);}

  function library(){
    if(globalThis.ol?.Map&&globalThis.ol?.source?.OSM)return Promise.resolve();
    if(libraryPromise)return libraryPromise;
    libraryPromise=new Promise((resolve,reject)=>{
      const link=document.createElement('link');
      link.rel='stylesheet';link.href=urls.css;document.head.append(link);
      const script=document.createElement('script');
      script.src=urls.js;
      script.onload=()=>globalThis.ol?.Map?resolve():reject(new Error('OpenLayers not available'));
      script.onerror=()=>reject(new Error('Map library could not load'));
      document.head.append(script);
    }).catch(error=>{libraryPromise=null;throw error;});
    return libraryPromise;
  }
  function circleStyle(fill,radius){
    const O=globalThis.ol;
    return new O.style.Style({image:new O.style.Circle({
      radius,fill:new O.style.Fill({color:fill}),
      stroke:new O.style.Stroke({color:'#fff',width:3})
    })});
  }
  function featureFor(lat,lon,name){
    const O=globalThis.ol;
    const f=new O.Feature({geometry:new O.geom.Point(project(lat,lon))});
    f.set('mapLabel',String(name||'Place'));
    return f;
  }
  function showPopup(lat,lon,name){
    if(!popup)return;
    popupLabel.textContent=String(name||'Place');
    popup.setPosition(project(lat,lon));
  }
  function addPopup(O){
    const container=document.createElement('div');container.className='fh-map-popup';
    const close=document.createElement('button');close.type='button';close.className='fh-map-popup-close';
    close.textContent='×';close.setAttribute('aria-label','Close place label');
    const label=document.createElement('span');label.className='fh-map-popup-label';
    close.addEventListener('click',()=>popup.setPosition(undefined));
    container.append(label,close);
    popupLabel=label;
    popup=new O.Overlay({element:container,positioning:'bottom-center',offset:[0,-16],stopEvent:true});
    map.addOverlay(popup);
    map.on('singleclick',event=>{
      const f=map.forEachFeatureAtPixel(event.pixel,feature=>feature);
      if(!f?.get('mapLabel')){popup.setPosition(undefined);return;}
      label.textContent=String(f.get('mapLabel'));
      popup.setPosition(f.getGeometry().getCoordinates());
    });
  }
  function clearRoute(){
    if(map&&routeLayer)map.removeLayer(routeLayer);
    routeLayer=null;
  }
  function clearNearby(){
    if(nearbySource)nearbySource.clear();
  }
  function focus(lat,lon,zoom=15){
    if(!map||!valid(lat,lon))return;
    map.getView().animate({center:project(lat,lon),zoom,duration:220});
  }
  function drawRoute(points){
    if(!map||!Array.isArray(points)||points.length<2)return false;
    const validPoints=points.filter(p=>Array.isArray(p)&&valid(p[0],p[1]));
    if(validPoints.length<2)return false;
    const O=globalThis.ol;
    clearRoute();
    const geometry=new O.geom.LineString(validPoints.map(([lat,lon])=>project(lat,lon)));
    routeLayer=new O.layer.Vector({
      source:new O.source.Vector({features:[new O.Feature({geometry})]}),
      style:new O.style.Style({stroke:new O.style.Stroke({color:'#236651',width:5})})
    });
    map.addLayer(routeLayer);
    map.getView().fit(geometry.getExtent(),{padding:[35,35,35,35],duration:250,maxZoom:16,size:map.getSize()});
    return true;
  }
  function showNearby(entries){
    if(!map||!nearbySource)return;
    clearNearby();
    const features=[];
    for(const p of entries){
      if(valid(p.lat,p.lon))features.push(featureFor(p.lat,p.lon,p.label));
    }
    nearbySource.addFeatures(features);
  }
  function renderer(){
    return Object.freeze({focus,showPopup,drawRoute,clearRoute,showNearby,clearNearby});
  }
  async function openMap(){
    const screen=document.querySelector('[data-screen="gods-eye"]');
    if(!screen?.classList.contains('active'))return;
    if(map){setTimeout(()=>map.updateSize(),80);return;}
    if(opening)return opening;
    status('Loading the Travel Companion map…');
    opening=(async()=>{
      try{
        await library();
        if(!screen.classList.contains('active')||map)return;
        const O=globalThis.ol;
        ownSource=new O.source.Vector();
        foundSource=new O.source.Vector();
        nearbySource=new O.source.Vector();
        map=new O.Map({
          target:'gods-eye-map',
          layers:[
            new O.layer.Tile({source:new O.source.OSM({url:urls.tiles})}),
            new O.layer.Vector({source:foundSource,style:circleStyle('#3f644d',9)}),
            new O.layer.Vector({source:ownSource,style:circleStyle('#285f9b',8)}),
            new O.layer.Vector({source:nearbySource,style:circleStyle('#9a5c2b',6)})
          ],
          view:new O.View({center:project(world[0],world[1]),zoom:2,maxZoom:19})
        });
        addPopup(O);
        engine=renderer();
        window.dispatchEvent(new CustomEvent('folkhold:gods-eye-map-ready',{detail:{map,renderer:engine}}));
        status('Drag or pinch to explore. Search a place, or choose Use My Location.');
        setTimeout(()=>map.updateSize(),160);
      }catch{
        status('The map could not load. Check your connection and try opening Travel Companion again.');
      }finally{opening=null;}
    })();
    return opening;
  }
  function pin(lat,lon,label,own=false){
    if(!map||!valid(lat,lon))return;
    const source=own?ownSource:foundSource;
    source.clear();
    source.addFeature(featureFor(lat,lon,own?'Your approximate position':label));
    focus(lat,lon,own?14:12);
    window.dispatchEvent(new CustomEvent('folkhold:gods-eye-point',{
      detail:{lat,lon,label,own}
    }));
  }
  function title(feature){
    const p=feature?.properties||{};
    return [p.name,p.street,p.housenumber,p.city,p.state,p.country].filter(Boolean).join(', ')||'Unnamed place';
  }
  async function search(event){
    event.preventDefault();
    const query=$('gods-eye-query')?.value.trim(),list=$('gods-eye-results');
    if(!query||query.length<2||busy||!list)return;
    await openMap();if(!map)return;
    const key=query.toLowerCase(),now=Date.now();
    if(!cache.has(key)&&now-lastQueryAt<1250){status('Wait a moment before searching again.');return;}
    busy=true;
    const button=$('gods-eye-search').querySelector('button[type="submit"]');
    button.disabled=true;list.replaceChildren();status('Searching for places…');
    try{
      let features=cache.get(key);
      if(!features){
        lastQueryAt=now;
        const u=new URL(urls.places);u.searchParams.set('q',query);u.searchParams.set('limit','5');
        const response=await fetch(u,{referrerPolicy:'strict-origin-when-cross-origin'});
        if(!response.ok)throw new Error('Place search unavailable');
        const data=await response.json();
        features=Array.isArray(data.features)?data.features.slice(0,5):[];
        cache.set(key,features);
      }
      let count=0,first=null;
      for(const item of features){
        const [lon,lat]=item.geometry?.coordinates||[];
        if(!valid(lat,lon))continue;
        const label=title(item),li=document.createElement('li'),btn=document.createElement('button');
        btn.type='button';btn.textContent=label;
        btn.addEventListener('click',()=>{pin(lat,lon,label);status('Showing '+label+'.');});
        li.append(btn);list.append(li);count++;
        if(!first)first=[lat,lon,label];
      }
      if(first)pin(...first);
      status(count?count+' place result'+(count===1?'':'s')+'. Select one to view it.':'No places found. Try a different search.');
    }catch{status('Place search is currently unavailable. You can still explore the map.');}
    finally{busy=false;button.disabled=false;}
  }
  async function locate(){
    if(!map){status('Open the map first.');return;}
    if(!window.isSecureContext){status('Location requires a secure HTTPS connection. You can still search for a place.');return;}
    if(!navigator.geolocation){status('This browser does not provide location access. You can still search for a city or address.');return;}
    if(document.permissionsPolicy?.allowsFeature?.('geolocation')===false){
      status('This page is blocked from requesting location. You can still search for a place.');return;
    }
    const button=$('gods-eye-locate');
    if(button?.disabled)return;
    if(button)button.disabled=true;
    const done=()=>{if(button)button.disabled=false;};
    let permission='unknown';
    try{
      if(navigator.permissions?.query)permission=(await navigator.permissions.query({name:'geolocation'})).state;
    }catch{/* Permission query not available in every browser. */}
    if(permission==='denied'){
      status('Location is blocked in Firefox. Check site permissions beside the address bar, allow Location, then try again. You can still search manually.');
      done();return;
    }
    status(permission==='granted'?'Finding your approximate location…':'Waiting for browser location permission or an approximate position…');
    navigator.geolocation.getCurrentPosition(pos=>{
      done();
      const {latitude,longitude,accuracy}=pos.coords;
      if(!valid(latitude,longitude)){status('Location coordinates were invalid. Search for a place instead.');return;}
      pin(latitude,longitude,'Your current position',true);
      status('Approximate position shown (accuracy '+Math.round(accuracy)+' m). Your position has not been shared with another Folkhold member.');
    },err=>{
      done();
      if(err?.code===1){
        status('Location permission was denied or blocked. In Firefox, check site permissions near the address bar. You can still search for a place.');
      }else if(err?.code===3){
        status('Location request timed out. This computer may not have a working location provider. Try again or search for a place manually.');
      }else if(err?.code===2){
        status('The browser could not determine your position. Desktop location can use nearby networks; GPS is not required. Try a manual place search.');
      }else{
        status('Location is unavailable right now. You can still search for a city, landmark, or address.');
      }
    },{enableHighAccuracy:false,maximumAge:300000,timeout:12000});
  }
  function start(){
    $('gods-eye-search')?.addEventListener('submit',search);
    $('gods-eye-locate')?.addEventListener('click',locate);
    $('gods-eye-world')?.addEventListener('click',()=>{if(map){focus(world[0],world[1],2);status('World view.');}});
    document.addEventListener('click',event=>{
      if(event.target.closest?.('[data-view="gods-eye"]'))setTimeout(openMap,75);
    });
    window.addEventListener('hashchange',()=>{if(location.hash==='#gods-eye')setTimeout(openMap,75);});
    if(location.hash==='#gods-eye')setTimeout(openMap,100);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
