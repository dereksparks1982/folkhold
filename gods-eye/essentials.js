(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  let place=null,busyWeather=false,busyPrayer=false,busyRate=false;
  let timezone=null,updatedPlaceSerial=0;
  const valid=p=>p&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&Math.abs(p.lat)<=90&&Math.abs(p.lon)<=180;
  const set=(id,text)=>{if($(id))$(id).textContent=text;};
  async function weather() {
    if(!valid(place)){set('gods-eye-weather-result','Select a place on the map or Use My Location first.');return;}
    if(busyWeather)return;
    busyWeather=true;const button=$('gods-eye-weather-button');button.disabled=true;
    const p={...place},serial=updatedPlaceSerial;
    set('gods-eye-weather-result','Loading current conditions near '+p.label+'…');
    try{
      const u=new URL('https://api.open-meteo.com/v1/forecast');
      u.searchParams.set('latitude',p.lat);u.searchParams.set('longitude',p.lon);
      u.searchParams.set('current','temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weather_code');
      u.searchParams.set('timezone','auto');
      const r=await fetch(u);if(!r.ok)throw Error('Weather unavailable');
      const d=await r.json(),c=d.current;
      if(serial!==updatedPlaceSerial)return;
      if(!c||!Number.isFinite(c.temperature_2m))throw Error('Invalid weather data');
      timezone=d.timezone||null;
      set('gods-eye-weather-result',p.label+': '+Math.round(c.temperature_2m)+'°C, feels '+Math.round(c.apparent_temperature)+'°C · humidity '+c.relative_humidity_2m+'% · wind '+c.wind_speed_10m+' km/h · precipitation '+c.precipitation+' mm. Source time: '+(c.time||'unspecified')+' ('+(timezone||'timezone unknown')+').');
    }catch{if(serial===updatedPlaceSerial)set('gods-eye-weather-result','Current weather is unavailable. Try again later.');}
    finally{busyWeather=false;button.disabled=false;}
  }
  function localDate(tz) {
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:tz||Intl.DateTimeFormat().resolvedOptions().timeZone,day:'2-digit',month:'2-digit',year:'numeric'}).formatToParts(new Date());
    const get=k=>parts.find(p=>p.type===k)?.value||'';
    return get('day')+'-'+get('month')+'-'+get('year');
  }
  function twelveHour(time) {
    const match=String(time||'').match(/^(\d{1,2}):(\d{2})/);
    if(!match)return time||'n/a';
    const hour=Number(match[1]);
    return (hour%12||12)+':'+match[2]+' '+(hour<12?'AM':'PM');
  }
  async function prayers() {
    if(!valid(place)){set('gods-eye-prayer-result','Select a place on the map first.');return;}
    if(busyPrayer)return;
    busyPrayer=true;const button=$('gods-eye-prayer-button');button.disabled=true;
    const p={...place},serial=updatedPlaceSerial;
    set('gods-eye-prayer-result','Retrieving calculated prayer times for '+p.label+'…');
    try {
      const date=localDate(timezone);
      const u=new URL('https://api.aladhan.com/v1/timings/'+encodeURIComponent(date));
      for(const [k,v] of Object.entries({latitude:p.lat,longitude:p.lon,method:$('gods-eye-prayer-method').value,school:'1'}))u.searchParams.set(k,v);
      const response=await fetch(u);
      if(!response.ok)throw Error('Prayer provider unavailable');
      const data=await response.json(),t=data.data?.timings;
      if(serial!==updatedPlaceSerial)return;
      if(!t||!t.Fajr||!t.Isha)throw Error('No valid timings');
      const container=$('gods-eye-prayer-result');container.replaceChildren();
      const heading=document.createElement('p');heading.textContent=p.label+' · '+(data.data?.date?.readable||date)+' · '+(data.data?.meta?.timezone||timezone||'place timezone')+' (Hanafi Asr)';
      const list=document.createElement('ol');list.className='fh-prayer-times';
      for(const key of ['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha']){
        const li=document.createElement('li'),strong=document.createElement('strong'),span=document.createElement('span');
        strong.textContent=key;span.textContent=twelveHour(t[key]);li.append(strong,span);list.append(li);
      }
      container.append(heading,list);
    } catch {if(serial===updatedPlaceSerial)set('gods-eye-prayer-result','Prayer times are unavailable. Verify with a local mosque.');}
    finally{busyPrayer=false;button.disabled=false;}
  }
  async function exchange(event) {
    event.preventDefault();if(busyRate)return;
    const amount=Number($('gods-eye-money-amount').value),base=$('gods-eye-money-from').value,quote=$('gods-eye-money-to').value;
    if(!Number.isFinite(amount)||amount<=0||amount>1e8)return;
    if(!/^[A-Z]{3}$/.test(base)||!/^[A-Z]{3}$/.test(quote))return;
    if(base===quote){set('gods-eye-currency-result',amount.toLocaleString('en-US')+' '+base+' = same amount '+quote+' (no conversion).');return;}
    busyRate=true;const button=$('gods-eye-currency-form').querySelector('[type="submit"]');button.disabled=true;
    set('gods-eye-currency-result','Retrieving published currency rates…');
    try{
      const u='https://api.frankfurter.dev/v2/rate/'+base+'/'+quote;
      const r=await fetch(u);if(!r.ok)throw Error('Rate unavailable');
      const data=await r.json();
      if(!Number.isFinite(Number(data.rate))||Number(data.rate)<=0)throw Error('Invalid rate');
      const result=amount*Number(data.rate);
      set('gods-eye-currency-result',amount.toLocaleString('en-US',{maximumFractionDigits:2})+' '+base+' ≈ '+
        result.toLocaleString('en-US',{maximumFractionDigits:2})+' '+quote+
        ' · reference rate '+Number(data.rate).toPrecision(6)+' ('+(data.date||'date unknown')+'). Does not include exchange fees.');
    }catch{set('gods-eye-currency-result','Currency rate unavailable. Try another pair or check your bank.');}
    finally{busyRate=false;button.disabled=false;}
  }
  function init() {
    if(!$('gods-eye-travel'))return;
    window.addEventListener('folkhold:gods-eye-point',event=>{
      const p=event.detail;if(!valid(p))return;
      place={lat:p.lat,lon:p.lon,label:p.own?'your location':p.label};
      timezone=null;updatedPlaceSerial++;
      set('gods-eye-weather-result','Ready for '+place.label+'. Press Check Weather.');
      set('gods-eye-prayer-result','Ready for '+place.label+'. Press Get Prayer Times.');
    });
    $('gods-eye-weather-button').addEventListener('click',weather);
    $('gods-eye-prayer-button').addEventListener('click',prayers);
    $('gods-eye-currency-form').addEventListener('submit',exchange);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
