import { useState, useRef, useEffect } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');`;

const css = `
  ${FONT}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dr {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e4dc;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  }
  .orb {
    position: fixed; width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(234,88,12,0.06) 0%, transparent 68%);
    pointer-events: none; z-index: 0; top: -280px; left: 50%; transform: translateX(-50%);
  }
  .orb2 {
    position: fixed; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%);
    pointer-events: none; z-index: 0; bottom: -200px; right: -100px;
  }

  .wrap { position: relative; z-index: 1; max-width: 740px; margin: 0 auto; padding: 0 24px; }

  .nav { display: flex; align-items: center; justify-content: space-between; padding: 26px 0 0; }
  .logo {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 21px;
    letter-spacing: -0.5px; color: #fff; display: flex; align-items: center; gap: 9px;
  }
  .logo-dot {
    width: 8px; height: 8px; border-radius: 50%; background: #ea580c;
    box-shadow: 0 0 12px rgba(234,88,12,0.9);
    animation: logopin 2.2s ease-in-out infinite;
  }
  @keyframes logopin { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.55;transform:scale(.8)} }
  .nav-pill {
    font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    color: #4a4642; border: 1px solid #1a1816; border-radius: 100px; padding: 4px 12px;
  }

  .hero { padding: 76px 0 60px; text-align: center; }
  .eyebrow {
    display: inline-block; font-size: 11px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase; color: #ea580c;
    border: 1px solid rgba(234,88,12,0.28); border-radius: 100px;
    padding: 4px 14px; margin-bottom: 26px;
  }
  .h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5.6vw, 55px);
    font-weight: 800; line-height: 1.07; letter-spacing: -1.5px;
    color: #fff; margin-bottom: 18px;
  }
  .h1 em { font-style: normal; color: #ea580c; }
  .sub {
    font-size: 17px; color: #6a6560; font-weight: 300; line-height: 1.6;
    max-width: 420px; margin: 0 auto 52px;
  }

  .ba {
    display: grid; grid-template-columns: 1fr 1fr;
    border: 1px solid #1a1816; border-radius: 14px; overflow: hidden;
    text-align: left; margin-bottom: 72px;
  }
  @media(max-width:560px){.ba{grid-template-columns:1fr}}
  .ba-side { padding: 22px; }
  .ba-l { background: rgba(127,29,29,0.07); border-right: 1px solid #1a1816; }
  .ba-r { background: rgba(6,78,59,0.07); }
  .ba-lbl {
    font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .lbl-red { color: #ef4444; }
  .lbl-grn { color: #10b981; }
  .dot { width: 5px; height: 5px; border-radius: 50%; }
  .dot-r { background: #ef4444; }
  .dot-g { background: #10b981; }
  .ba-orig {
    font-size: 12.5px; line-height: 1.6; color: #4a4642; font-style: italic;
    padding: 11px; border-radius: 7px;
    background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.04);
    margin-bottom: 14px;
  }
  .ba-bad {
    font-size: 12.5px; line-height: 1.6; color: #7c2020; padding: 11px;
    border-radius: 7px; background: rgba(127,29,29,0.1); border: 1px solid rgba(239,68,68,0.08);
  }
  .ba-good {
    font-size: 12.5px; line-height: 1.65; color: #a7f3d0; padding: 11px;
    border-radius: 7px; background: rgba(6,78,59,0.14); border: 1px solid rgba(16,185,129,0.14);
    margin-top: 36px;
  }

  .divider { height: 1px; background: linear-gradient(90deg,transparent,#1a1816 50%,transparent); margin-bottom: 52px; }

  .input-sec { margin-bottom: 44px; }
  .slabel {
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.13em;
    text-transform: uppercase; color: #3a3834; margin-bottom: 16px;
  }
  .toggles { display: flex; gap: 8px; margin-bottom: 22px; flex-wrap: wrap; }
  .tbtn {
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    padding: 7px 15px; border-radius: 100px; border: 1px solid #1a1816;
    background: transparent; color: #5a5550; cursor: pointer; transition: all .16s;
  }
  .tbtn:hover { border-color: #2a2826; color: #907e78; }
  .tbtn.on { background: rgba(234,88,12,0.09); border-color: rgba(234,88,12,.32); color: #ea580c; }

  .ta {
    font-family: 'DM Sans', sans-serif; width: 100%; min-height: 136px;
    background: rgba(255,255,255,0.018); border: 1px solid #1a1816;
    border-radius: 13px; padding: 17px 20px; color: #e8e4dc;
    font-size: 15px; line-height: 1.65; resize: vertical; outline: none;
    transition: border-color .2s; margin-bottom: 14px;
  }
  .ta::placeholder { color: #2e2c28; }
  .ta:focus { border-color: rgba(234,88,12,.28); }

  .sbtn {
    font-family: 'Syne', sans-serif; width: 100%; padding: 15px;
    background: #ea580c; color: #fff; font-size: 15px; font-weight: 700;
    letter-spacing: .02em; border: none; border-radius: 11px; cursor: pointer;
    transition: all .18s;
  }
  .sbtn:hover:not(:disabled) { background: #c2410c; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(234,88,12,.22); }
  .sbtn:disabled { background: #1e1c18; color: #3a3830; cursor: not-allowed; }

  .loading {
    padding: 44px; text-align: center; border: 1px solid #1a1816;
    border-radius: 14px; background: rgba(255,255,255,0.008); margin-bottom: 44px;
    animation: fadein .3s ease;
  }
  .ldots { display: flex; justify-content: center; gap: 6px; margin-bottom: 14px; }
  .ldot {
    width: 7px; height: 7px; border-radius: 50%; background: #ea580c;
    animation: ldotb 1.3s ease-in-out infinite;
  }
  .ldot:nth-child(2){animation-delay:.18s} .ldot:nth-child(3){animation-delay:.36s}
  @keyframes ldotb{0%,80%,100%{transform:scale(.45);opacity:.25}40%{transform:scale(1);opacity:1}}
  .ltext { font-size: 13px; color: #3a3830; font-style: italic; }

  .output { margin-bottom: 52px; animation: slideup .4s cubic-bezier(.16,1,.3,1); }
  @keyframes slideup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadein { from{opacity:0} to{opacity:1} }

  .urgency {
    background: rgba(239,68,68,0.045); border: 1px solid rgba(239,68,68,0.1);
    border-radius: 10px; padding: 14px 18px; margin-bottom: 24px;
  }
  .urgency-main { font-size: 14px; color: #f87171; font-weight: 600; line-height: 1.5; margin-bottom: 3px; }
  .urgency-sub { font-size: 12.5px; color: #7a3a3a; font-weight: 400; }

  .reply-lbl {
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: #10b981; margin-bottom: 12px;
  }
  .reply-lbl-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #10b981;
    box-shadow: 0 0 8px rgba(16,185,129,.7);
  }

  .reply-card {
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 16px;
    background: rgba(6,78,59,0.055);
    padding: 30px 32px;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 48px rgba(16,185,129,0.03);
  }
  .reply-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent);
  }
  .reply-txt-first {
    font-size: 17px; line-height: 1.8; color: #e8e4dc; font-weight: 400; letter-spacing: 0.01em;
    margin-bottom: 10px;
  }
  .reply-txt-rest {
    font-size: 17px; line-height: 1.8; color: #d4cfc8; font-weight: 300; letter-spacing: 0.01em;
    filter: blur(4px); user-select: none; opacity: 0.5;
  }

  .why {
    border: 1px solid #141210; border-radius: 12px;
    background: rgba(255,255,255,0.01); padding: 20px 24px; margin-bottom: 20px;
  }
  .why-lbl {
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #3a3834; margin-bottom: 14px;
  }
  .why-rows { display: flex; flex-direction: column; gap: 10px; }
  .why-row { display: flex; align-items: flex-start; gap: 11px; }
  .why-chk {
    width: 17px; height: 17px; flex-shrink: 0; border-radius: 50%; margin-top: 2px;
    background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 8.5px; color: #10b981; font-weight: 700;
  }
  .why-t { font-size: 13.5px; color: #6a6560; line-height: 1.55; }
  .why-t strong { color: #a09890; font-weight: 500; }

  .copy-btn {
    font-family: 'Syne', sans-serif; width: 100%; padding: 17px;
    background: #ffffff; color: #09090d; font-size: 15px; font-weight: 700;
    letter-spacing: 0.03em; border: none; border-radius: 11px; cursor: pointer;
    transition: all .18s; margin-bottom: 28px;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    box-shadow: 0 2px 20px rgba(255,255,255,0.05);
  }
  .copy-btn:hover { background: #f0ece6; transform: translateY(-1px); box-shadow: 0 8px 30px rgba(255,255,255,0.09); }
  .copy-btn.done {
    background: transparent; color: #10b981;
    border: 1px solid rgba(16,185,129,0.22); box-shadow: none;
  }

  .paywall-wrap { position: relative; border-radius: 14px; overflow: hidden; margin-bottom: 60px; }
  .peek {
    padding: 20px 24px 16px; background: rgba(255,255,255,0.01);
    border: 1px solid #141210; border-bottom: none;
    border-radius: 14px 14px 0 0;
  }
  .peek-lbl {
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #3a3834; margin-bottom: 14px;
  }
  .peek-row { display: flex; align-items: center; gap: 10px; margin-bottom: 9px; }
  .pdot { width: 6px; height: 6px; flex-shrink: 0; border-radius: 50%; }
  .pdot-g { background: #10b981; }
  .pdot-o { background: #ea580c; }
  .pdot-b { background: #3b82f6; }
  .pline { height: 9px; border-radius: 3px; background: #181614; }

  .blur-sec {
    position: relative; border: 1px solid #141210; border-top: none;
    border-radius: 0 0 14px 14px; overflow: hidden;
  }
  .blur-inner {
    padding: 16px 24px 80px;
    background: rgba(255,255,255,0.01);
    filter: blur(5px); user-select: none; pointer-events: none;
  }
  .brow { display: flex; align-items: center; gap: 10px; margin-bottom: 11px; }
  .bline { height: 11px; border-radius: 3px; background: #181614; }

  .blur-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 0%, rgba(9,9,13,0.55) 28%, rgba(9,9,13,0.97) 58%);
    display: flex; flex-direction: column; align-items: center;
    justify-content: flex-end; padding: 28px 24px 32px;
  }
  .pw-head {
    font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700;
    color: #fff; text-align: center; margin-bottom: 7px; letter-spacing: -0.2px;
  }
  .pw-sub {
    font-size: 13px; color: #4a4642; text-align: center;
    margin-bottom: 22px; line-height: 1.55; max-width: 320px;
  }
  .pw-btn {
    font-family: 'Syne', sans-serif; padding: 13px 28px;
    background: #ea580c; color: #fff; font-size: 14px; font-weight: 700;
    letter-spacing: 0.03em; border: none; border-radius: 9px; cursor: pointer;
    transition: all .18s; display: inline-flex; align-items: center; gap: 10px;
    box-shadow: 0 6px 26px rgba(234,88,12,0.28);
  }
  .pw-btn:hover { background: #c2410c; transform: translateY(-1px); box-shadow: 0 10px 32px rgba(234,88,12,0.33); }
  .pw-price {
    background: rgba(255,255,255,0.13); border-radius: 5px;
    padding: 2px 8px; font-size: 13px; font-weight: 700; color: #fff;
  }
  .pw-justify { font-size: 12px; color: #4a4642; margin-top: 10px; text-align: center; }
  .pw-speed { font-size: 11.5px; color: #3a3834; margin-top: 6px; text-align: center; letter-spacing: 0.02em; }

  .footer { padding: 48px 0 28px; text-align: center; border-top: 1px solid #0f0e0c; }
  .foot-logo { font-family:'Syne',sans-serif; font-size:14px; font-weight:800; color:#1e1c18; margin-bottom:5px; }
  .foot-txt { font-size:11px; color:#1e1c18; }
`;

const AUTH = [
  { k: "approve", l: "I can approve refunds" },
  { k: "need",    l: "I need approval" },
  { k: "deesc",   l: "De-escalate only" },
];

const EX = {
  angry: "Why would you ship me broken garbage and then make me wait 3 weeks for support? This is an absolute joke.",
  bad:   "We're sorry for the inconvenience. Please allow 3–5 business days for our team to review your request.",
  good:  "You're right — shipping a broken product and making you wait weeks is completely unacceptable. I've already escalated this internally and started the fix. I'm personally handling this until it's fully resolved.",
};

function riskFor(m) {
  const s = m.toLowerCase();
  if (["refund","lawsuit","scam","fraud","chargeback","horrible","terrible","never again","worst"].some(w=>s.includes(w))) return "high";
  return "medium";
}

export default function Defuse() {
  const [auth, setAuth] = useState("approve");
  const [msg,  setMsg]  = useState("");
  const [res,  setRes]  = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [risk, setRisk] = useState(null);
  const outRef = useRef(null);

  async function run() {
    if (!msg.trim()) return;
    setBusy(true); setRes(null); setDone(false);
    setRisk(riskFor(msg));

    const al = AUTH.find(a=>a.k===auth)?.l;

    const system = `You are a senior customer success expert. Write a decisive reply and explain why it works.

Return ONLY valid JSON — no markdown fences, no explanation:
{
  "reply": "the reply here",
  "reasons": ["reason 1", "reason 2", "reason 3"]
}

Reply rules:
- Direct and human. No corporate filler.
- Reference their exact frustration — not generic.
- Past tense for actions: "I've already escalated" not "I will escalate".
- Own the problem fully. Zero excuses.
- End with personal commitment that it's handled.
- Strictly under 75 words.
- Authority level: ${al}

Reasons rules (3 items, each ~8-10 words):
- Explain the psychological tactic behind a part of the reply.
- Wrap the key technique in <strong>bold</strong> HTML tags.
- No bullet symbols. Just the sentence.`;

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system,
          messages: [{ role: "user", content: msg }],
        }),
      });
      const d = await r.json();
      const raw = d.content?.map(b=>b.text||"").join("") || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setRes(parsed);
    } catch {
      setRes({ reply: "Something went wrong — please try again.", reasons: [] });
    } finally {
      setBusy(false);
    }
  }

  useEffect(()=>{
    if (res && outRef.current) {
      setTimeout(()=>outRef.current.scrollIntoView({behavior:"smooth",block:"start"}),80);
    }
  },[res]);

  function copy() {
    if (!res?.reply) return;
    navigator.clipboard.writeText(res.reply);
    setDone(true);
    setTimeout(()=>setDone(false),2400);
  }

  return (
    <div className="dr">
      <style>{css}</style>
      <div className="noise"/>
      <div className="orb"/>
      <div className="orb2"/>
      <div className="wrap">

        <nav className="nav">
          <div className="logo"><div className="logo-dot"/>Defuse</div>
          <div className="nav-pill">Customer rescue tool</div>
        </nav>

        <section className="hero">
          <div className="eyebrow">Live AI · Instant replies</div>
          <h1 className="h1">You're one reply away<br/>from <em>losing this customer.</em></h1>
          <p className="sub">Paste the message. Get the exact reply that keeps them.</p>
          <div className="ba">
            <div className="ba-side ba-l">
              <div className="ba-lbl lbl-red"><div className="dot dot-r"/>What they sent</div>
              <div className="ba-orig">{EX.angry}</div>
              <div className="ba-lbl lbl-red" style={{marginTop:18}}><div className="dot dot-r"/>Bad reply</div>
              <div className="ba-bad">{EX.bad}</div>
            </div>
            <div className="ba-side ba-r">
              <div className="ba-lbl lbl-grn"><div className="dot dot-g"/>Defuse reply</div>
              <div className="ba-good" style={{marginTop:36}}>{EX.good}</div>
            </div>
          </div>
        </section>

        <div className="divider"/>

        <section className="input-sec">
          <div className="slabel">Your authority level</div>
          <div className="toggles">
            {AUTH.map(a=>(
              <button key={a.k} className={`tbtn ${auth===a.k?"on":""}`} onClick={()=>setAuth(a.k)}>{a.l}</button>
            ))}
          </div>
          <div className="slabel" style={{marginTop:24}}>Paste the angry customer message</div>
          <textarea
            className="ta"
            placeholder="Paste the angry customer message…"
            value={msg}
            onChange={e=>setMsg(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey))run();}}
          />
          <button className="sbtn" onClick={run} disabled={busy||!msg.trim()}>
            {busy ? "Reading the situation…" : "⚡ Fix this message"}
          </button>
        </section>

        {busy && (
          <div className="loading">
            <div className="ldots"><div className="ldot"/><div className="ldot"/><div className="ldot"/></div>
            <div className="ltext">Writing the reply that keeps them…</div>
          </div>
        )}

        {res && !busy && (
          <section className="output" ref={outRef}>
            <div className="urgency">
              <div className="urgency-main">If you send the wrong reply, this customer is gone.</div>
              <div className="urgency-sub">You won't get a second chance.</div>
            </div>

            <div className="reply-lbl">
              <div className="reply-lbl-dot"/>
              High risk — customer is close to leaving
            </div>
            <div className="reply-card">
              {(() => {
                const full = res.reply || "";
                const match = full.match(/^(.+?[.!?])\s*([\s\S]*)$/);
                const first = match ? match[1] : full;
                const rest  = match ? match[2] : "";
                return <>
                  <p className="reply-txt-first">{first}</p>
                  {rest && <p className="reply-txt-rest">{rest}</p>}
                </>;
              })()}
            </div>

            {res.reasons?.length > 0 && (
              <div className="why">
                <div className="why-lbl">Why this works</div>
                <div className="why-rows">
                  {res.reasons.map((r,i)=>(
                    <div className="why-row" key={i}>
                      <div className="why-chk">✓</div>
                      <div className="why-t" dangerouslySetInnerHTML={{__html:r}}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className={`copy-btn ${done?"done":""}`} onClick={copy}>
              {done
                ? <><span style={{fontSize:15}}>✓</span> Copied to clipboard</>
                : <><span style={{fontSize:15}}>⎘</span> Copy this reply</>
              }
            </button>

            <div className="paywall-wrap">
              <div className="peek">
                <div className="peek-lbl">Full strategy — what to do next</div>
                <div className="peek-row"><div className="pdot pdot-g"/><div className="pline" style={{width:"59%"}}/></div>
                <div className="peek-row"><div className="pdot pdot-o"/><div className="pline" style={{width:"44%"}}/></div>
                <div className="peek-row"><div className="pdot pdot-b"/><div className="pline" style={{width:"52%"}}/></div>
              </div>
              <div className="blur-sec">
                <div className="blur-inner">
                  {[78,58,70,50,65,44,68].map((w,i)=>(
                    <div className="brow" key={i}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#222018",flexShrink:0}}/>
                      <div className="bline" style={{width:`${w}%`}}/>
                    </div>
                  ))}
                </div>
                <div className="blur-overlay">
                  <div className="pw-head">You're 1 reply away from losing this customer.</div>
                  <div className="pw-sub">Unlock the full playbook — follow-up scripts, churn prevention, and what to say if they push back.</div>
                  <button className="pw-btn">
                    Get the exact reply <span className="pw-price">$7</span>
                  </button>
                  <div className="pw-justify">1 saved customer covers this.</div>
                  <div className="pw-speed">Takes 8 seconds to send.</div>
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="footer">
          <div className="foot-logo">Defuse</div>
          <div className="foot-txt">Turn angry customers into loyal ones.</div>
        </footer>
      </div>
    </div>
  );
}
