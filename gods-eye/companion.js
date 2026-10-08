(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const phrases=[
    ['Hello','Merhaba','mehr-HAH-bah'],
    ['Thank you','Teşekkür ederim','teh-shehk-KOOR eh-deh-REEM'],
    ['Where is the mosque?','Cami nerede?','jah-MEE neh-reh-DEH'],
    ['How much does this cost?','Bu ne kadar?','boo neh kah-DAHR'],
    ['Could you help me?','Bana yardım eder misiniz?','bah-NAH yar-DUHM eh-DEHR mee-see-NEEZ'],
    ['I do not speak Turkish well.','Türkçeyi iyi konuşamıyorum.','TOORK-cheh-yee ee-YEE koh-noo-shah-MUH-yo-room']
  ];
  let point=null;
  const text=(id,content)=>{if($(id))$(id).textContent=content;};
  const full=(s)=>s.trim().length>0;
  const shareContext=()=>{
    const p=point?'Selected place: '+point.label+' ('+point.lat.toFixed(4)+', '+point.lon.toFixed(4)+').':'No destination selected.';
    const mode=$('gods-eye-travel-mode')?.value||'Not set';
    return p+' You can explore nearby places, calculate Hanafi prayer times, check weather, plan a road route and compare currency prices here. Translation sends text to an external provider only on request.';
  };
  async function translate(event) {
    event.preventDefault();
    const from=$('gods-eye-language-from').value,to=$('gods-eye-language-to').value;
    const message=$('gods-eye-language-text').value.trim();
    if(!message)return;
    if(from===to){text('gods-eye-translation-result','Select two different languages.');return;}
    // MyMemory limits UTF-8 queries to 500 bytes; avoid truncating multi-byte scripts.
    if(new TextEncoder().encode(message).length>450){
      text('gods-eye-translation-result','Please shorten this message (up to 450 UTF-8 bytes).');return;
    }
    const button=$('gods-eye-translate-form').querySelector('[type="submit"]');button.disabled=true;
    text('gods-eye-translation-result','Translating through MyMemory…');
    try {
      const u=new URL('https://api.mymemory.translated.net/get');
      u.searchParams.set('q',message);u.searchParams.set('langpair',(from==='fa-AF'?'fa':from)+'|'+(to==='fa-AF'?'fa':to));
      const r=await fetch(u);if(!r.ok)throw Error('Translation unavailable');
      const data=await r.json();
      const content=data.responseData?.translatedText;
      if(!content||Number(data.responseStatus)>=400||typeof content!=='string')throw Error('No translation');
      const el=$('gods-eye-translation-result');
      el.replaceChildren();
      const heading=document.createElement('strong');heading.textContent=from==='fa-AF'||to==='fa-AF'?'Translation (Persian approximation for Dari; local wording may differ): ':'Translation (machine-assisted): ';
      const result=document.createElement('span');result.textContent=content;
      el.append(heading,result);
    }catch{text('gods-eye-translation-result','Translation service unavailable or rate-limited. Try a phrase from the local phrasebook.');}
    finally{button.disabled=false;}
  }
  function compare(event){
    event.preventDefault();
    const quote=Number($('gods-eye-fair-quote').value),ref=Number($('gods-eye-fair-reference').value);
    const currency=$('gods-eye-fair-currency').value;
    if(!Number.isFinite(quote)||!Number.isFinite(ref)||ref<=0||quote<0||ref>1e11||quote>1e11){
      text('gods-eye-fair-result','Enter a valid quote and a positive reference price.');return;
    }
    const pct=((quote/ref)-1)*100;
    const change=Math.abs(pct)<0.5?'almost the same as':pct>0?Math.abs(pct).toFixed(1)+'% higher than':Math.abs(pct).toFixed(1)+'% lower than';
    text('gods-eye-fair-result',
      quote.toLocaleString('en-US',{maximumFractionDigits:2})+' '+currency+' is '+change+
      (Math.abs(pct)<0.5?'':'')+' your reference of '+ref.toLocaleString('en-US',{maximumFractionDigits:2})+' '+currency+
      '. This only compares numbers you entered; it is not evidence of the local market price.');
  }
  function init(){
    if(!$('gods-eye-conversation'))return;
    $('gods-eye-language-to').value='tr';
    $('gods-eye-language-from').value='en';
    $('gods-eye-translate-form').addEventListener('submit',translate);
    $('gods-eye-language-swap').addEventListener('click',()=>{
      const a=$('gods-eye-language-from'),b=$('gods-eye-language-to');[a.value,b.value]=[b.value,a.value];
      text('gods-eye-translation-result','Languages swapped. Press Translate for the new direction.');
    });
    $('gods-eye-fair-form').addEventListener('submit',compare);
    const list=$('gods-eye-phrasebook');
    for(const [en,tr,pronunciation] of phrases){
      const btn=document.createElement('button');btn.type='button';
      const strong=document.createElement('strong');strong.textContent=en+' → '+tr;
      const small=document.createElement('small');small.textContent=pronunciation;
      btn.append(strong,small);
      btn.addEventListener('click',()=>{
        $('gods-eye-language-from').value='en';$('gods-eye-language-to').value='tr';
        $('gods-eye-language-text').value=en;
        text('gods-eye-translation-result',tr+' ('+pronunciation+'). Offline phrasebook. Pronunciation approximate.');
      });
      list.append(btn);
    }
    window.addEventListener('folkhold:gods-eye-point',event=>{
      const p=event.detail;
      if(Number.isFinite(p.lat)&&Number.isFinite(p.lon)){
        point={lat:p.lat,lon:p.lon,label:p.own?'Your current location':p.label};
        text('gods-eye-hitch-place','Working around: '+point.label+'.');
      }
    });
    $('gods-eye-hitch-summary').addEventListener('click',()=>text('gods-eye-hitch-result',shareContext()));
    window.FolkholdWayfarer=Object.freeze({
      context:()=>point?{...point}:null,
      availableTools:()=>['Travel map','Road directions','Nearby discovery','Weather','Currency exchange','Hanafi prayer times','Translation','Fair Price']
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
