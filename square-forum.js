(function client() {
  const root=document.getElementById("square-together");
  const forum=document.getElementById("square-forum");
  const body=document.getElementById("square-forum-body");
  const status=document.getElementById("square-forum-status");
  if(!root||!forum||!body||!status)return;
  const base=String(window.FOLKHOLD_CLOUDFLARE?.apiBase||"").replace(/\/$/,"");
  const sections=[
    ["general","General Conversation","Pull up a chair and say your piece.","✦"],
    ["workshop","The Workshop","Making, mending and building.","⚒"],
    ["games","Games & Pastimes","Games, stories and old favorites.","♜"],
    ["journeys","Journeys & Places","Roads, travels and local knowledge.","⌖"],
    ["questions","Questions & Help","Ask the Square and share what you know.","?"]
  ];
  const state={screen:"categories",category:null,topic:null,posting:false};
  const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=String(text);return el};
  const btn=(text,action,cls)=>{const el=make("button",cls,text);el.type="button";el.dataset.forum=action;return el};
  const msg=text=>{status.textContent=text};
  const date=n=>new Date(Number(n)||Date.now()).toLocaleString([],{dateStyle:"medium",timeStyle:"short"});
  const title=id=>sections.find(s=>s[0]===id)?.[1]||"Discussions";
  function name(){let value=localStorage.getItem("folkhold.globalChatName");if(!value){value=`Guest-${Math.floor(1000+Math.random()*9000)}`;localStorage.setItem("folkhold.globalChatName",value)}return value.slice(0,32)}
  async function call(path,data){
    if(!base)throw Error("Cloudflare service URL is unavailable.");
    const req={headers:{Accept:"application/json"},credentials:"include"};
    if(data){req.method="POST";req.headers["Content-Type"]="application/json";req.body=JSON.stringify({...data,name:name()})}
    const res=await fetch(`${base}/api/forum/${path}`,req);
    let json;
    try{json=await res.json()}catch{throw Error(`Forum server returned ${res.status}.`)}
    if(!res.ok)throw Error(json.error||`Forum server returned ${res.status}.`);
    return json;
  }
  function view(screen,category=state.category,topic=null){state.screen=screen;state.category=category;state.topic=topic;body.replaceChildren();msg("")}
  function failure(err){msg(err.message||"Could not reach the forum.");body.replaceChildren(btn("Try again","retry","secondary"))}
  function bar(label,back,backText){
    const row=make("div","square-forum-bar");
    row.append(btn(backText||"← Categories",back),make("h3","",label));
    return row;
  }
  async function categories(){
    view("categories",null);msg("Loading discussions…");
    try{
      const data=await call("categories");
      if(state.screen!=="categories")return;
      msg("");
      for(const s of sections){
        const count=(data.categories||[]).find(c=>c.id===s[0])?.topics||0;
        const card=btn("","category","square-category");card.dataset.id=s[0];
        const words=make("span");words.append(make("strong","",s[1]),make("small","",s[2]));
        card.append(make("span","symbol",s[3]),words,make("span","count",`${count} topics`));
        body.append(card);
      }
    }catch(err){if(state.screen==="categories")failure(err)}
  }
  async function topics(id){
    view("topics",id);msg("Loading topics…");
    try{
      const data=await call(`topics?category=${encodeURIComponent(id)}`);
      if(state.screen!=="topics"||state.category!==id)return;
      msg("");body.append(bar(title(id),"categories"));
      if(!data.topics?.length)body.append(make("p","square-hint","No discussions here yet. Be the first."));
      for(const topic of data.topics||[]){
        const row=btn("","topic","square-topic-link");row.dataset.id=String(topic.id);
        row.append(make("strong","",topic.title),make("small","",`${topic.author} · ${topic.reply_count} replies · ${date(topic.last_at)}`));
        body.append(row);
      }
      body.append(btn("Start a topic","compose","primary"));
    }catch(err){if(state.screen==="topics")failure(err)}
  }
  function post(author,text,created){
    const el=make("article","square-post"),head=make("header");
    head.append(make("strong","",author),make("time","",date(created)));
    el.append(head,make("p","",text));body.append(el);
  }
  async function topic(id){
    const category=state.category;view("topic",category,id);msg("Loading topic…");
    try{
      const data=await call(`topic?id=${encodeURIComponent(id)}`);
      if(state.screen!=="topic"||String(state.topic)!==String(id))return;
      msg("");
      body.append(bar(data.topic.title,"topics","← Topics"));
      post(data.topic.author,data.topic.body,data.topic.created_at);
      body.append(make("h3","",`Replies (${data.topic.reply_count})`));
      if(data.moreReplies)body.append(make("p","square-hint","Showing the newest 100 replies."));
      for(const reply of data.replies||[])post(reply.author,reply.body,reply.created_at);
      const form=make("form","square-entry");form.dataset.form="reply";
      const label=make("label","", "Your reply"),text=make("textarea");
      text.name="body";text.required=true;text.maxLength=5000;label.append(text);
      const submit=make("button","primary","Post reply");submit.type="submit";
      form.append(label,submit);body.append(form);
    }catch(err){if(state.screen==="topic")failure(err)}
  }
  function compose(){
    view("compose",state.category||"general");
    const form=make("form","square-entry");form.dataset.form="topic";
    form.append(bar("Start a discussion","back","← Back"));
    const categoryLabel=make("label","", "Discussion area"),select=make("select");
    select.name="category";for(const s of sections){const opt=make("option","",s[1]);opt.value=s[0];opt.selected=s[0]===state.category;select.append(opt)}
    categoryLabel.append(select);
    const titleLabel=make("label","", "Title"),heading=make("input");
    heading.name="title";heading.maxLength=120;heading.required=true;titleLabel.append(heading);
    const bodyLabel=make("label","", "Message"),text=make("textarea");
    text.name="body";text.maxLength=5000;text.required=true;bodyLabel.append(text);
    const submit=make("button","primary","Publish topic");submit.type="submit";
    form.append(categoryLabel,titleLabel,bodyLabel,make("p","square-hint","Posts are public and permanent. Guest nicknames are unverified."),submit);
    body.append(form);
  }
  document.querySelectorAll(".square-switch [data-square-tab]").forEach(b=>b.addEventListener("click",()=>{
    root.dataset.squareTab=b.dataset.squareTab;
    document.querySelectorAll(".square-switch [data-square-tab]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
  }));
  forum.addEventListener("click",event=>{
    const el=event.target.closest("[data-forum]");
    if(!el||state.posting)return;
    switch(el.dataset.forum){
      case "categories":categories();break;
      case "category":topics(el.dataset.id);break;
      case "topics":topics(state.category);break;
      case "topic":topic(el.dataset.id);break;
      case "compose":compose();break;
      case "back":state.category?topics(state.category):categories();break;
      case "retry":state.screen==="topics"?topics(state.category):state.screen==="topic"?topic(state.topic):categories();
    }
  });
  forum.addEventListener("submit",async event=>{
    const form=event.target.closest("[data-form]");if(!form)return;
    event.preventDefault();if(state.posting||!form.reportValidity())return;
    state.posting=true;const submit=form.querySelector('[type="submit"]');submit.disabled=true;msg("Publishing…");
    try{
      const values=new FormData(form);
      if(form.dataset.form==="topic"){
        const id=values.get("category");
        const data=await call("topics",{category:id,title:values.get("title"),body:values.get("body")});
        state.category=id;await topic(data.topic.id);
      }else{const id=state.topic;await call(`topic?id=${id}`,{body:values.get("body")});await topic(id)}
    }catch(err){msg(err.message||"Could not publish.")}
    finally{state.posting=false;submit.disabled=false}
  });
  window.FolkholdSquareForum=Object.freeze({refresh:categories});
  categories();
})();
