(()=> {
  const term = document.createElement("div");
  term.style = `
    position:fixed;z-index:2147483647;top:20px;left:50%;
    transform:translateX(-50%);width:520px;max-width:90%;
    background:#050505;color:#00ff88;padding:18px 22px;
    border-radius:14px;font:14px Consolas,monospace;
    box-shadow:0 0 30px #000;border:1px solid #00ff8866
  `;
  term.innerHTML = `
    <div style="color:#fff;font:bold 18px Arial;margin-bottom:10px;text-align:center">
      Credit BY Nahid Hasan
    </div>
    <div id="nhlog">[START] Facebook Language Automation...</div>
  `;
  document.body.appendChild(term);

  const log = msg => {
    const box = document.getElementById("nhlog");
    box.innerHTML += "<br>" + msg;
  };

  const w = open(
    "https://www.facebook.com/settings?tab=language",
    "fb_lang",
    "width=360,height=520,left=-1000,top=-1000"
  );

  function ev(el){
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    ["mouseover","mousedown","mouseup","click"].forEach(t =>
      el.dispatchEvent(new w.MouseEvent(t,{
        bubbles:true,cancelable:true,view:w,clientX:x,clientY:y
      }))
    );
  }

  function clickEnglish(){
    try{
      const e = [...w.document.querySelectorAll("span,div")]
        .find(x => (x.innerText || x.textContent || "").trim() === "English (US)");
      if(e){
        log("[OK] English (US) found");
        ev(e.closest('[role="button"],[tabindex="0"],a') || e);
        log("[CLICK] English selected");
        return true;
      }
    }catch(e){}
    return false;
  }

  function openLangRow(){
    try{
      const doc = w.document;
      const points = [[315,280],[315,310],[315,340],[315,365]];
      for(const [x,y] of points){
        const e = doc.elementFromPoint(x,y);
        if(e){
          ev(e.closest('[role="button"],[tabindex="0"],a') || e);
          log("[CLICK] Language row scanned");
          return true;
        }
      }
    }catch(e){}
    return false;
  }

  let n = 0;
  const timer = setInterval(() => {
    n++;
    if(!w || w.closed){
      clearInterval(timer);
      log("[ERROR] Window closed");
      return;
    }

    if(n > 120){
      clearInterval(timer);
      log("[FAILED] Try again");
      return;
    }

    if(clickEnglish()){
      clearInterval(timer);
      log("[DONE] Reloading...");
      setTimeout(() => {
        try{ w.close(); }catch(e){}
        location.href = "https://www.facebook.com/?locale=en_US";
      }, 3500);
    } else {
      openLangRow();
    }
  }, 700);
})();
