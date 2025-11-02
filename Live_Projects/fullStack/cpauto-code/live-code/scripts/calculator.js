(function () {
  /** -------- ICON -------- **/
  const calculatorIconBase64 =
    "data:image/svg+xml;base64," +
    btoa(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><rect x='5' y='2' width='14' height='20' rx='2'/><line x1='9' y1='8' x2='15' y2='8'/><line x1='9' y1='12' x2='9.01' y2='12'/><line x1='12' y1='12' x2='12.01' y2='12'/><line x1='15' y1='12' x2='15.01' y2='12'/><line x1='9' y1='16' x2='9.01' y2='16'/><line x1='12' y1='16' x2='12.01' y2='16'/><line x1='15' y1='16' x2='15.01' y2='16'/></svg>`);

  /** -------- STYLES -------- **/
  const style = document.createElement("style");
  style.textContent = `
    .calculator-trigger {
      cursor:pointer;width:34px;height:34px;display:flex;align-items:center;justify-content:center;
      margin-left:8px;background:none;border:none;transition:opacity .2s ease;
    }
    .calculator-trigger img {width:100%;height:100%;opacity:.8;}
    .calculator-trigger:hover img {opacity:1;}

    .calculator-container {
      font-family:inherit;color:inherit;background:var(--modal-bg,#0a0a0a);
      padding:40px 24px;border-radius:12px;max-width:1100px;margin:0 auto;position:relative;
    }
    .calculator-container::before {
      content:"";position:absolute;inset:0;
      background:linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px),
                 linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px);
      background-size:30px 30px;pointer-events:none;border-radius:inherit;
    }
    .calculator-container .header {text-align:center;margin-bottom:40px;}
    .calculator-container .header h1 {font-weight:500;font-size:1.8rem;margin-bottom:10px;}
    .calculator-container .header p {opacity:0.7;font-size:0.95rem;}
    .diagram-container {position:relative;min-height:600px;}
    svg#connectionsSvg {position:absolute;inset:0;width:100%;height:100%;z-index:0;}
    .connection-line {
      stroke:rgba(255,255,255,0.1);stroke-width:2;fill:none;
      stroke-dasharray:1000;stroke-dashoffset:1000;
      transition:stroke .3s ease,stroke-width .3s ease;
    }
    .connection-line.active {
      animation:drawLine 1.2s ease forwards;
      stroke:#4a9eff;stroke-width:3;filter:drop-shadow(0 0 6px rgba(74,158,255,0.6));
    }
    @keyframes drawLine {to {stroke-dashoffset:0;}}
    .connection-line.selected {
      stroke:#7b68ee;stroke-width:3;
    }
    .node-row {display:flex;justify-content:center;flex-wrap:wrap;gap:30px;margin-bottom:70px;}
    .node {
      position:relative;cursor:pointer;transition:all .3s ease;pointer-events:all;
    }
    .node.disabled {opacity:0.3;pointer-events:none;}
    .node.start {
      width:100px;height:100px;border-radius:50%;
      background:linear-gradient(135deg,#f4e4a3,#d4c483);
      display:flex;align-items:center;justify-content:center;color:#222;font-weight:600;
      box-shadow:0 4px 20px rgba(244,228,163,0.3);
    }
    .node.service,.node.client,.node.end {
      padding:16px 20px;border-radius:8px;
      border:2px solid rgba(255,255,255,0.2);
      background:rgba(255,255,255,0.05);
      text-align:center;font-size:0.9rem;transition:all .3s ease;
    }
    .node.service:hover,.node.service.selected,
    .node.client:hover,.node.client.selected {
      border-color:#4a9eff;transform:translateY(-4px);
    }
    .node.complexity {
      width:140px;height:140px;transform:rotate(45deg);
      border:2px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);
    }
    .node.complexity .label {transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;height:100%;width:100%;
    }
    .node.complexity.selected {
      border-color:#7b68ee;box-shadow:0 0 15px rgba(123,104,238,0.5);
    }
    .summary-panel {
      border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:24px;margin-top:30px;
      background:rgba(20,20,20,0.7);
    }
    .summary-panel h2 {margin-bottom:8px;font-weight:500;}
  `;
  document.head.appendChild(style);

  /** -------- BUTTON -------- **/
  function insertCalcButton() {
    const header =  document.querySelector("header") || document.querySelector(".header") || document.querySelector(".navbar");
    if (!header) return console.warn("Header not found for calculator button.");
    const btn = document.createElement("button");
    btn.className = "calculator-trigger";
    btn.innerHTML = `<img src="${calculatorIconBase64}" alt="Calculator">`;
    const toggle = header.querySelector(".light-dark-toggle, .theme-toggle, [data-theme-toggle]");
    toggle && toggle.parentNode
      ? toggle.parentNode.insertBefore(btn, toggle.nextSibling)
      : header.appendChild(btn);
    btn.addEventListener("click", openCalculatorModal);
  }

  /** -------- MODAL CREATION -------- **/
  function createCalcModal() {
    const modalBg = document.createElement("div");
    modalBg.className = "modal-bg";
    const modal = document.createElement("div");
    modal.className = "modal calculator-modal";
    modal.innerHTML = `
      <div class="modal-content" style="max-width:1100px;width:90%;overflow:auto;max-height:90vh;">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div class="calculator-container">
          <div class="header">
            <h1>Interactive Pricing Calculator</h1>
            <p>Hover over nodes to explore pathways • Click to build your estimate</p>
          </div>
          <div class="diagram-container">
            <svg id="connectionsSvg"></svg>
            <div class="nodes-container">
              <div class="node-row"><div class="node start" id="start-node">START</div></div>
              <div class="node-row" id="service-row">
                <div class="node service" data-service="architecting">Architecting</div>
                <div class="node service" data-service="automating">Automating</div>
                <div class="node service" data-service="design">Web Design</div>
                <div class="node service" data-service="api">API</div>
              </div>
              <div class="node-row" id="complexity-row">
                <div class="node complexity disabled" data-level="simple"><div class="label">Simple</div></div>
                <div class="node complexity disabled" data-level="moderate"><div class="label">Moderate</div></div>
                <div class="node complexity disabled" data-level="advanced"><div class="label">Advanced</div></div>
              </div>
              <div class="node-row" id="client-row">
                <div class="node client disabled" data-discount="0">Standard</div>
                <div class="node client disabled" data-discount="15">Startup</div>
                <div class="node client disabled" data-discount="25">Nonprofit</div>
                <div class="node client disabled" data-discount="20">Creator</div>
              </div>
              <div class="node-row"><div class="node end" id="end-node">Get Estimate</div></div>
            </div>
          </div>
          <div class="summary-panel" id="summaryPanel" style="display:none;">
            <h2>Your Estimate</h2>
            <p id="summaryText"></p>
          </div>
        </div>
      </div>`;
    document.body.append(modalBg, modal);
    modalBg.addEventListener("click", closeCalculatorModal);
    modal.querySelector(".modal-close").addEventListener("click", closeCalculatorModal);
    return { modal, modalBg };
  }

  let calcModal, calcBg;

  function openCalculatorModal() {
    if (!calcModal) {
      const { modal, modalBg } = createCalcModal();
      calcModal = modal; calcBg = modalBg;
      initCalculator(calcModal);
    }
    calcBg.classList.add("is-visible");
    calcModal.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }
  function closeCalculatorModal() {
    if (!calcModal) return;
    calcBg.classList.remove("is-visible");
    calcModal.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  /** -------- CALCULATOR LOGIC -------- **/
  function initCalculator(root) {
    const state = { service:null, complexity:null, client:null, connections:[] };
    const pricing = {
      architecting:{simple:[400,800],moderate:[1000,2000],advanced:[2500,5000]},
      automating:{simple:[250,600],moderate:[800,1800],advanced:[2000,4000]},
      design:{simple:[600,1200],moderate:[1500,3000],advanced:[3500,6000]},
      api:{simple:[800,1500],moderate:[2500,5000],advanced:[4000,8000]}
    };
    const svg = root.querySelector("#connectionsSvg");

    function getNodeCenter(node){
      const r=node.getBoundingClientRect();
      const c=svg.getBoundingClientRect();
      return {x:r.left+r.width/2-c.left, y:r.top+r.height/2-c.top};
    }
    function drawLine(from,to){
      const {x:x1,y:y1}=getNodeCenter(from);
      const {x:x2,y:y2}=getNodeCenter(to);
      const midY=(y1+y2)/2;
      const path=document.createElementNS("http://www.w3.org/2000/svg","path");
      path.setAttribute("d",`M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`);
      path.classList.add("connection-line");
      svg.appendChild(path);
      state.connections.push({from,to,el:path});
    }
    function redraw(){
      svg.innerHTML=""; state.connections=[];
      const s=root.querySelector("#start-node");
      const services=root.querySelectorAll(".node.service");
      const comps=root.querySelectorAll(".node.complexity");
      const clients=root.querySelectorAll(".node.client");
      const end=root.querySelector("#end-node");
      services.forEach(n=>drawLine(s,n));
      services.forEach(a=>comps.forEach(b=>drawLine(a,b)));
      comps.forEach(a=>clients.forEach(b=>drawLine(a,b)));
      clients.forEach(a=>drawLine(a,end));
    }
    window.addEventListener("resize",redraw);
    redraw();

    const services=root.querySelectorAll(".node.service");
    const comps=root.querySelectorAll(".node.complexity");
    const clients=root.querySelectorAll(".node.client");
    const summary=root.querySelector("#summaryPanel");
    const summaryText=root.querySelector("#summaryText");

    services.forEach(s=>s.addEventListener("click",()=>{
      services.forEach(n=>n.classList.remove("selected"));
      s.classList.add("selected");
      state.service=s.dataset.service;
      comps.forEach(c=>c.classList.remove("disabled"));
      animateLinesFrom(s);
    }));
    comps.forEach(c=>c.addEventListener("click",()=>{
      if(!state.service) return alert("Select a service first");
      comps.forEach(n=>n.classList.remove("selected"));
      c.classList.add("selected");
      state.complexity=c.dataset.level;
      clients.forEach(cl=>cl.classList.remove("disabled"));
      animateLinesFrom(c);
    }));
    clients.forEach(cl=>cl.addEventListener("click",()=>{
      if(!state.complexity) return;
      clients.forEach(n=>n.classList.remove("selected"));
      cl.classList.add("selected");
      state.client={discount:+cl.dataset.discount};
      const [min,max]=pricing[state.service][state.complexity];
      const d=state.client.discount||0;
      const fmin=Math.round(min*(1-d/100)),fmax=Math.round(max*(1-d/100));
      summary.style.display="block";
      summaryText.textContent=`$${fmin.toLocaleString()} – $${fmax.toLocaleString()} (${d}% off)`;
      animateLinesFrom(cl);
    }));

    function animateLinesFrom(node){
      state.connections.forEach(conn=>{
        conn.el.classList.remove("active");
        if(conn.from===node||conn.to===node){
          conn.el.classList.add("active");
          conn.el.style.animation="none";
          void conn.el.offsetWidth; // reset animation
          conn.el.style.animation=null;
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", insertCalcButton);
})();
