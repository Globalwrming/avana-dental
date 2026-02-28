import { useState, useEffect, useRef, useReducer, useCallback } from "react";

// ─────────────────────────────────────────────
// GOOGLE SHEETS SETUP
// ─────────────────────────────────────────────
// 1. Open Google Sheet → Extensions → Apps Script
// 2. Paste this function and deploy as Web App
//    (Execute as: Me, Access: Anyone)
//
//  function doPost(e) {
//    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//    var d = JSON.parse(e.postData.contents);
//    if (sheet.getLastRow() === 0) {
//      sheet.appendRow(["ID","Name","Phone","Teeth","Timeline",
//        "Consulted","Tag","Booked Date","Booked Time","Submitted At"]);
//    }
//    sheet.appendRow([d.id, d.first_name, d.phone, d.missing_teeth,
//      d.timeline, d.consulted_before, d.lead_tag,
//      d.booked_date||"", d.booked_time||"",
//      new Date().toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})]);
//    return ContentService.createTextOutput(
//      JSON.stringify({status:"ok"})
//    ).setMimeType(ContentService.MimeType.JSON);
//  }
//
// 3. Copy the Web App URL and paste it below:
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwZn1JRSOTLcWnjrE5M38Yz4seVVxGcuhTN3wkHmyE45KGgLkJpM3pUfHpY_TOeNXVxvA/exec";

function sendToSheets(data) {
  if (SHEETS_URL.includes("YOUR_SCRIPT_ID")) {
    console.log("[Sheets] Not configured — lead data:", data);
    return;
  }
  fetch(SHEETS_URL, {
    method: "POST", mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch(e => console.warn("[Sheets] Error:", e));
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',system-ui,sans-serif;background:#FAF8F4;color:#0A0E1A;-webkit-font-smoothing:antialiased;overflow-x:hidden;}

:root{
  --navy:#0F2547; --navy-mid:#1B3A6B; --navy-light:#2A5298;
  --gold:#B8962E; --gold-l:#D4AF5A; --gold-pale:#F5EDD6;
  --cream:#FAF8F4; --white:#fff;
  --gray-6:#4B5563; --gray-4:#9CA3AF; --gray-2:#E5E7EB; --gray-1:#F3F4F6;
  --blue-tint:#EEF3FB; --success:#047857; --error:#DC2626;
  --r:10px; --r-lg:16px;
  --sh-md:0 4px 16px rgba(15,37,71,.12);
  --sh-lg:0 12px 40px rgba(15,37,71,.18);
  --sh-xl:0 24px 64px rgba(15,37,71,.22);
}

@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulseGold{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.3)}}
@keyframes dotPulse{0%,80%,100%{opacity:.3;transform:scale(.9)}40%{opacity:1;transform:scale(1.1)}}
@keyframes spinPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(15,37,71,.15)}50%{transform:scale(1.05);box-shadow:0 0 0 12px rgba(15,37,71,0)}}
@keyframes calIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes floatIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

.nav{position:fixed;top:0;left:0;right:0;z-index:200;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 32px;transition:all .3s;}
.nav.light{background:transparent;}
.nav.solid{background:#fff;border-bottom:1px solid var(--gray-2);}
.nav-logo{font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:600;letter-spacing:.04em;}
.nav.light .nav-logo{color:#fff;} .nav.solid .nav-logo{color:var(--navy);}
.nav-logo span{color:var(--gold);}
.nav-btn{background:transparent;border:1px solid rgba(255,255,255,.25);border-radius:8px;padding:7px 14px;cursor:pointer;font-size:13px;font-family:'DM Sans',sans-serif;transition:all .2s;}
.nav.light .nav-btn{color:rgba(255,255,255,.7);} .nav.solid .nav-btn{color:var(--gray-4);border-color:var(--gray-2);}
.nav-back{background:transparent;border:none;cursor:pointer;font-size:14px;color:var(--gray-6);font-family:'DM Sans',sans-serif;}

.hero{min-height:100vh;background:linear-gradient(160deg,var(--navy) 0%,var(--navy-mid) 55%,#1e4080 100%);display:flex;align-items:center;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 70% 40%,rgba(184,150,46,.12) 0%,transparent 70%);pointer-events:none;}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:64px 64px;pointer-events:none;}
.hero-inner{position:relative;z-index:2;max-width:1200px;margin:0 auto;padding:120px 48px 80px;width:100%;}
.hero-eyebrow{display:inline-flex;align-items:center;gap:10px;background:rgba(184,150,46,.15);border:1px solid rgba(184,150,46,.4);border-radius:100px;padding:6px 16px;margin-bottom:32px;}
.hero-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--gold-l);animation:pulseGold 2s infinite;}
.hero-eyebrow-txt{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--gold-l);}
.hero-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(48px,6vw,84px);font-weight:300;line-height:1.08;color:#fff;letter-spacing:-.02em;margin-bottom:12px;}
.hero-h1 em{font-style:italic;color:var(--gold-l);display:block;font-weight:600;}
.hero-sub{font-size:18px;font-weight:300;line-height:1.7;color:rgba(255,255,255,.72);max-width:560px;margin-bottom:48px;}
.hero-ctas{display:flex;align-items:center;gap:20px;flex-wrap:wrap;}
.btn-gold{background:linear-gradient(135deg,var(--gold) 0%,var(--gold-l) 100%);color:var(--navy);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;padding:16px 36px;border:none;border-radius:var(--r);cursor:pointer;letter-spacing:.02em;transition:all .25s;box-shadow:0 4px 20px rgba(184,150,46,.4);}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(184,150,46,.5);}
.btn-ghost-hero{background:transparent;color:rgba(255,255,255,.8);font-family:'DM Sans',sans-serif;font-size:14px;padding:14px 0;border:none;cursor:pointer;display:flex;align-items:center;gap:8px;}
.trust-strip{display:flex;flex-wrap:wrap;gap:20px;margin-top:64px;padding-top:40px;border-top:1px solid rgba(255,255,255,.1);}
.trust-item{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,.7);font-size:13px;}
.trust-icon{width:32px;height:32px;border-radius:50%;background:rgba(184,150,46,.15);border:1px solid rgba(184,150,46,.3);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}

.sec{max-width:1200px;margin:0 auto;padding:96px 48px;}
.sec-label{font-size:11px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;display:flex;align-items:center;gap:12px;}
.sec-label::after{content:'';flex:1;max-width:48px;height:1px;background:var(--gold);opacity:.5;}
.sec-h2{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,4vw,56px);font-weight:300;line-height:1.1;color:var(--navy);letter-spacing:-.02em;margin-bottom:24px;}
.sec-h2 em{font-style:italic;color:var(--gold);}
.sec-body{font-size:16px;line-height:1.8;color:var(--gray-6);max-width:640px;margin-bottom:20px;}
.bg-white{background:#fff;} .bg-navy{background:var(--navy);} .bg-cream{background:var(--cream);}

.prob-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;}
.proto-table{margin-top:48px;border:1px solid rgba(255,255,255,.1);border-radius:var(--r-lg);overflow:hidden;}
.proto-row{display:grid;grid-template-columns:200px 1fr;border-bottom:1px solid rgba(255,255,255,.07);}
.proto-row:last-child{border-bottom:none;} .proto-row:hover{background:rgba(255,255,255,.03);}
.proto-stage{padding:28px 24px;border-right:1px solid rgba(255,255,255,.07);}
.proto-num{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;color:var(--gold);line-height:1;font-style:italic;}
.proto-name{font-size:13px;font-weight:600;color:rgba(255,255,255,.9);letter-spacing:.03em;margin-top:6px;}
.proto-desc{padding:28px 32px;font-size:15px;line-height:1.7;color:rgba(255,255,255,.65);display:flex;align-items:center;}

.doc-card{background:#fff;border-radius:var(--r-lg);padding:48px;box-shadow:var(--sh-lg);border:1px solid var(--gray-2);display:grid;grid-template-columns:200px 1fr;gap:48px;align-items:start;margin-top:48px;}
.doc-avatar{width:200px;height:200px;border-radius:var(--r-lg);background:linear-gradient(145deg,var(--navy-light),var(--navy));display:flex;align-items:center;justify-content:center;font-size:64px;color:rgba(255,255,255,.25);flex-shrink:0;}
.doc-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;}
.doc-tag{background:var(--blue-tint);color:var(--navy);font-size:12px;font-weight:500;padding:5px 12px;border-radius:100px;border:1px solid rgba(27,58,107,.15);}

.appt-steps{display:flex;flex-direction:column;position:relative;}
.appt-steps::before{content:'';position:absolute;left:28px;top:28px;bottom:28px;width:2px;background:linear-gradient(to bottom,var(--gold),transparent);}
.appt-step{display:flex;gap:28px;padding:24px 0;}
.appt-num{width:56px;height:56px;border-radius:50%;background:#fff;border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--gold);flex-shrink:0;position:relative;z-index:1;}
.appt-content h4{font-size:16px;font-weight:600;color:var(--navy);margin-bottom:6px;}
.appt-content p{font-size:14px;line-height:1.7;color:var(--gray-6);}

.qual-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-top:48px;}
.qual-card{border-radius:var(--r-lg);padding:36px;border:1px solid;}
.qual-for{background:#F0FDF4;border-color:#BBF7D0;} .qual-not{background:#FFF7ED;border-color:#FDE68A;}
.qual-h{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;margin-bottom:20px;}
.qual-for .qual-h{color:#065F46;} .qual-not .qual-h{color:#92400E;}
.qual-item{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;font-size:14px;line-height:1.6;}
.qual-dot{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;margin-top:2px;}
.qual-for .qual-dot{background:#D1FAE5;color:#065F46;} .qual-not .qual-dot{background:#FEF3C7;color:#92400E;}

.scar-box{background:linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 100%);border-radius:var(--r-lg);padding:56px 64px;text-align:center;position:relative;overflow:hidden;margin-top:48px;}
.scar-box::before{content:'';position:absolute;top:-50%;right:-20%;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(184,150,46,.1) 0%,transparent 70%);pointer-events:none;}
.scar-num{font-family:'Cormorant Garamond',serif;font-size:80px;font-weight:300;font-style:italic;color:var(--gold-l);line-height:1;margin-bottom:8px;}
.scar-lbl{font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:20px;}
.scar-txt{font-size:22px;line-height:1.6;color:rgba(255,255,255,.85);max-width:600px;margin:0 auto 36px;font-family:'Cormorant Garamond',serif;font-weight:300;font-style:italic;}

.funnel-wrap{min-height:100vh;background:var(--cream);display:flex;flex-direction:column;}
.funnel-bar{position:fixed;top:0;left:0;right:0;height:3px;background:var(--gray-2);z-index:100;}
.funnel-fill{height:100%;background:linear-gradient(90deg,var(--navy) 0%,var(--gold) 100%);transition:width .5s cubic-bezier(.34,1.56,.64,1);}
.funnel-head{padding:0 32px;height:60px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--gray-2);background:#fff;}
.funnel-logo{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--navy);letter-spacing:.04em;}
.funnel-logo span{color:var(--gold);}
.funnel-ctr{font-size:13px;color:var(--gray-4);}
.funnel-body{flex:1;display:flex;align-items:center;justify-content:center;padding:48px 24px;}
.funnel-screen{width:100%;max-width:520px;animation:slideIn .38s cubic-bezier(.25,.46,.45,.94) both;}
.f-q{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,4vw,40px);font-weight:400;line-height:1.2;color:var(--navy);margin-bottom:12px;}
.f-q .hi{color:var(--gold);font-style:italic;}
.f-sub{font-size:15px;color:var(--gray-6);line-height:1.6;margin-bottom:28px;}
.f-label{display:block;font-size:12px;font-weight:600;color:var(--gray-4);letter-spacing:.07em;text-transform:uppercase;margin-bottom:7px;}
.f-input{width:100%;background:#fff;border:1.5px solid var(--gray-2);border-radius:var(--r);padding:15px 16px;font-family:'DM Sans',sans-serif;font-size:16px;color:var(--navy);outline:none;transition:border-color .2s,box-shadow .2s;}
.f-input:focus{border-color:var(--navy);box-shadow:0 0 0 3px rgba(15,37,71,.08);}
.f-input.err{border-color:var(--error);}
.f-err{font-size:12px;color:var(--error);margin-top:5px;}
.f-micro{font-size:12px;color:var(--gray-4);margin-top:12px;margin-bottom:4px;display:flex;align-items:flex-start;gap:6px;line-height:1.55;}
.f-btn{width:100%;padding:16px;background:var(--navy);color:#fff;border:none;border-radius:var(--r);font-family:'DM Sans',sans-serif;font-size:16px;font-weight:500;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:18px;}
.f-btn:hover:not(:disabled){background:var(--navy-mid);transform:translateY(-1px);box-shadow:var(--sh-md);}
.f-btn:disabled{opacity:.4;cursor:not-allowed;}
.f-options{display:flex;flex-direction:column;gap:11px;}
.f-opt{background:#fff;border:1.5px solid var(--gray-2);border-radius:var(--r);padding:17px 20px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:space-between;gap:14px;font-size:15px;color:var(--navy);font-family:'DM Sans',sans-serif;text-align:left;}
.f-opt:hover{border-color:var(--navy);background:var(--blue-tint);}
.f-opt.sel{border-color:var(--navy);background:var(--blue-tint);}
.f-opt-chk{width:22px;height:22px;border-radius:50%;border:1.5px solid var(--gray-2);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;font-size:12px;color:transparent;}
.f-opt.sel .f-opt-chk{background:var(--navy);border-color:var(--navy);color:#fff;}
.f-loading{text-align:center;padding:16px;}
.f-load-icon{width:72px;height:72px;border-radius:50%;background:var(--blue-tint);border:2px solid var(--navy-light);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 24px;animation:spinPulse 2s infinite;}
.f-load-msg{font-size:16px;color:var(--gray-6);animation:fadeUp .4s ease;}
.f-load-dots{display:flex;justify-content:center;gap:6px;margin-top:16px;}
.f-load-dot{width:7px;height:7px;border-radius:50%;background:var(--gold);animation:dotPulse 1.2s infinite;}
.f-load-dot:nth-child(2){animation-delay:.2s;} .f-load-dot:nth-child(3){animation-delay:.4s;}

.ty-wrap{min-height:100vh;background:var(--cream);padding:40px 24px 80px;}
.ty-inner{max-width:680px;margin:0 auto;}
.ty-card{background:#fff;border-radius:var(--r-lg);padding:48px;box-shadow:var(--sh-xl);animation:fadeUp .5s ease both;text-align:center;}
.ty-icon{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:36px;margin:0 auto 28px;}
.ty-high .ty-icon{background:#D1FAE5;color:var(--success);}
.ty-med .ty-icon{background:var(--blue-tint);color:var(--navy);}
.ty-low .ty-icon{background:var(--gold-pale);color:var(--gold);}
.ty-h{font-family:'Cormorant Garamond',serif;font-size:clamp(26px,4vw,38px);font-weight:400;color:var(--navy);line-height:1.2;margin-bottom:14px;}
.ty-sub{font-size:16px;line-height:1.7;color:var(--gray-6);margin-bottom:20px;}
.ty-divider{display:flex;align-items:center;gap:10px;margin:18px 0;}
.ty-divider-line{flex:1;height:1px;background:var(--gray-2);}
.ty-divider-txt{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--gray-4);}
.ty-booked-banner{background:#D1FAE5;border-radius:var(--r);padding:14px 18px;display:flex;gap:12px;align-items:center;margin-top:16px;text-align:left;}

.cal-wrap{background:#fff;border-radius:var(--r-lg);border:1px solid var(--gray-2);box-shadow:var(--sh-lg);overflow:hidden;margin-top:24px;animation:calIn .45s ease both;}
.cal-head{padding:22px 26px 16px;border-bottom:1px solid var(--gray-2);}
.cal-badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:600;margin-bottom:8px;letter-spacing:.04em;}
.cal-h{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;color:var(--navy);margin-bottom:4px;}
.cal-sub{font-size:13px;color:var(--gray-4);}
.cal-steps{display:flex;border-bottom:1px solid var(--gray-2);background:var(--gray-1);}
.cal-step{flex:1;padding:9px 0;text-align:center;font-size:12px;transition:all .2s;border-bottom:2px solid transparent;}
.cal-step.active{font-weight:600;color:var(--navy);border-bottom-color:var(--navy);}
.cal-step.done{color:var(--success);cursor:pointer;}
.cal-step.inactive{color:var(--gray-4);}
.cal-body{padding:22px 26px;}
.cal-dates{display:flex;gap:7px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none;}
.cal-dates::-webkit-scrollbar{display:none;}
.cal-d{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 12px;border-radius:10px;border:1.5px solid var(--gray-2);background:#fff;cursor:pointer;transition:all .14s;min-width:56px;}
.cal-d:hover{border-color:var(--navy);background:var(--blue-tint);}
.cal-d.sel{border-color:var(--navy);background:var(--navy);}
.cal-d-day{font-size:10px;font-weight:500;color:var(--gray-4);letter-spacing:.04em;}
.cal-d-num{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400;color:var(--navy);line-height:1;}
.cal-d-mo{font-size:10px;color:var(--gray-4);}
.cal-d.sel .cal-d-day,.cal-d.sel .cal-d-num,.cal-d.sel .cal-d-mo{color:#fff;}
.cal-slots{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.cal-slot{padding:10px 13px;border-radius:8px;border:1.5px solid var(--gray-2);background:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--navy);transition:all .13s;display:flex;align-items:center;justify-content:space-between;gap:6px;}
.cal-slot:hover:not(:disabled){border-color:var(--navy);background:var(--blue-tint);}
.cal-slot.sel{border-color:var(--navy);background:var(--navy);color:#fff;}
.cal-slot:disabled{opacity:.35;cursor:not-allowed;text-decoration:line-through;}
.cal-slot-taken{font-size:11px;color:var(--gray-4);}
.cal-slot.sel .cal-slot-taken{color:rgba(255,255,255,.5);}
.cal-summary{background:var(--cream);border-radius:var(--r);padding:16px 20px;border:1px solid var(--gray-2);margin-bottom:16px;}
.cal-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--gray-2);}
.cal-row:last-child{border-bottom:none;}
.cal-row-lbl{font-size:13px;color:var(--gray-4);}
.cal-row-val{font-size:14px;font-weight:500;color:var(--navy);}
.cal-note{background:var(--blue-tint);border-radius:var(--r);padding:12px 15px;margin-bottom:18px;display:flex;gap:9px;align-items:flex-start;font-size:13px;color:var(--navy-mid);line-height:1.6;}
.btn-confirm{width:100%;padding:16px;background:linear-gradient(135deg,var(--gold) 0%,var(--gold-l) 100%);color:var(--navy);border:none;border-radius:var(--r);font-family:'DM Sans',sans-serif;font-size:16px;font-weight:600;cursor:pointer;transition:all .2s;}
.btn-confirm:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(184,150,46,.4);}
.btn-text{background:transparent;border:none;cursor:pointer;font-size:13px;color:var(--gray-4);font-family:'DM Sans',sans-serif;padding:8px 0;width:100%;margin-top:6px;}
.btn-outline{background:transparent;border:1px solid var(--gray-2);border-radius:var(--r);padding:8px 16px;cursor:pointer;font-size:13px;color:var(--gray-6);font-family:'DM Sans',sans-serif;}
.cal-booked{text-align:center;padding:12px 0 6px;animation:fadeUp .4s ease both;}
.cal-booked-icon{width:72px;height:72px;border-radius:50%;background:#D1FAE5;display:flex;align-items:center;justify-content:center;font-size:36px;margin:0 auto 18px;}
.cal-bring{background:var(--cream);border-radius:var(--r);padding:16px 18px;margin-top:18px;text-align:left;}
.cal-bring-item{display:flex;gap:10px;margin-bottom:8px;font-size:13px;color:var(--gray-6);}
.cal-bring-item:last-child{margin-bottom:0;}

.adm-wrap{min-height:100vh;background:#0F1629;display:flex;}
.adm-side{width:240px;background:#080E1E;border-right:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;flex-shrink:0;}
.adm-logo{padding:24px;border-bottom:1px solid rgba(255,255,255,.06);font-family:'Cormorant Garamond',serif;font-size:20px;color:#fff;letter-spacing:.04em;}
.adm-logo span{color:var(--gold);}
.adm-logo small{display:block;font-family:'DM Sans',sans-serif;font-size:11px;color:rgba(255,255,255,.3);font-weight:400;margin-top:3px;letter-spacing:.08em;text-transform:uppercase;}
.adm-nav{padding:12px;flex:1;}
.adm-nav-item{display:flex;align-items:center;gap:12px;padding:10px 13px;border-radius:8px;cursor:pointer;font-size:14px;color:rgba(255,255,255,.4);margin-bottom:2px;border:none;background:transparent;width:100%;text-align:left;transition:all .14s;}
.adm-nav-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.8);}
.adm-nav-item.act{background:rgba(184,150,46,.15);color:var(--gold-l);}
.adm-main{flex:1;overflow-y:auto;}
.adm-topbar{padding:17px 26px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;background:#0F1629;position:sticky;top:0;z-index:10;}
.adm-topbar h2{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:400;color:#fff;}
.adm-content{padding:26px;}
.adm-actions{display:flex;gap:9px;}
.adm-btn{background:rgba(184,150,46,.15);border:1px solid rgba(184,150,46,.3);color:var(--gold-l);padding:8px 15px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all .14s;}
.adm-btn:hover{background:rgba(184,150,46,.25);}
.adm-btn.primary{background:var(--navy-mid);border-color:var(--navy-light);color:#fff;}
.adm-btn.primary:hover{background:var(--navy-light);}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:26px;}
.stat-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:var(--r);padding:20px;}
.stat-lbl{font-size:11px;font-weight:600;color:rgba(255,255,255,.28);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;}
.stat-val{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;color:#fff;line-height:1;}
.stat-sub{font-size:12px;color:rgba(255,255,255,.28);margin-top:5px;}
.adm-tbl-wrap{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:var(--r-lg);overflow:hidden;}
.adm-tbl-head{padding:13px 20px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between;}
.adm-tbl-title{font-size:13px;font-weight:500;color:rgba(255,255,255,.55);}
.adm-filters{display:flex;gap:5px;}
.adm-filter{padding:5px 11px;border-radius:100px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.3);transition:all .13s;}
.adm-filter.act{background:rgba(184,150,46,.2);border-color:rgba(184,150,46,.4);color:var(--gold-l);}
.adm-tbl{width:100%;border-collapse:collapse;}
.adm-tbl th{padding:10px 17px;font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:rgba(255,255,255,.2);text-align:left;border-bottom:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.02);}
.adm-tbl td{padding:12px 17px;font-size:13px;color:rgba(255,255,255,.58);border-bottom:1px solid rgba(255,255,255,.04);}
.adm-tbl tr:last-child td{border-bottom:none;}
.adm-tbl tr:hover td{background:rgba(255,255,255,.02);color:rgba(255,255,255,.85);}
.adm-tbl .name-cell{color:rgba(255,255,255,.9);font-weight:500;}
.adm-tbl .mono{font-family:monospace;font-size:12px;}
.tag{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:11px;font-weight:600;letter-spacing:.04em;}
.tag.hi{background:rgba(16,185,129,.15);color:#6EE7B7;}
.tag.med{background:rgba(59,130,246,.15);color:#93C5FD;}
.tag.lo{background:rgba(156,163,175,.1);color:rgba(255,255,255,.33);}
.q-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:var(--r-lg);margin-bottom:13px;overflow:hidden;}
.q-head{padding:16px 20px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;gap:10px;}
.q-head:hover{background:rgba(255,255,255,.02);}
.q-screen{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:3px;}
.q-text{font-size:14px;color:rgba(255,255,255,.82);}
.q-body{padding:0 20px 20px;border-top:1px solid rgba(255,255,255,.06);}
.opt-row{display:flex;align-items:center;gap:9px;padding:8px 11px;background:rgba(255,255,255,.03);border-radius:7px;margin-top:7px;font-size:13px;color:rgba(255,255,255,.52);}
.opt-lbl{flex:1;}
.opt-meta{font-size:11px;color:rgba(255,255,255,.22);font-family:monospace;}
.login-wrap{min-height:100vh;background:var(--navy);display:flex;align-items:center;justify-content:center;padding:24px;}
.login-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:var(--r-lg);padding:46px;width:100%;max-width:370px;}
.sticky-cta{position:fixed;bottom:24px;right:24px;z-index:150;animation:floatIn 1s ease 3s both;}

/* ── FUNNEL EDITOR ── */
.fe-wrap{display:grid;grid-template-columns:1fr 360px;gap:20px;align-items:start;}
.fe-questions{display:flex;flex-direction:column;gap:12px;}
.fe-q-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:var(--r-lg);overflow:hidden;}
.fe-q-card.dragging{opacity:.5;}
.fe-q-head{padding:15px 18px;display:flex;align-items:center;gap:10px;cursor:pointer;}
.fe-q-head:hover{background:rgba(255,255,255,.03);}
.fe-q-badge{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);background:rgba(184,150,46,.15);border:1px solid rgba(184,150,46,.25);padding:3px 9px;border-radius:100px;flex-shrink:0;}
.fe-q-label-input{flex:1;background:transparent;border:none;color:rgba(255,255,255,.85);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;outline:none;cursor:text;}
.fe-q-label-input:focus{color:#fff;}
.fe-q-actions{display:flex;gap:6px;flex-shrink:0;}
.fe-icon-btn{background:transparent;border:none;cursor:pointer;width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;color:rgba(255,255,255,.3);transition:all .15s;}
.fe-icon-btn:hover{background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);}
.fe-icon-btn.danger:hover{background:rgba(220,38,38,.15);color:#FCA5A5;}
.fe-q-body{padding:0 16px 16px;border-top:1px solid rgba(255,255,255,.07);}
.fe-opts-label{font-size:10px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:rgba(255,255,255,.22);margin:14px 0 8px;}
.fe-opt-row{display:grid;grid-template-columns:1fr auto auto auto;gap:8px;align-items:center;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:10px 12px;margin-bottom:7px;}
.fe-opt-input{background:transparent;border:none;color:rgba(255,255,255,.8);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;width:100%;}
.fe-opt-input:focus{color:#fff;}
.fe-select{background:#0F1629;border:1px solid rgba(255,255,255,.12);border-radius:6px;color:rgba(255,255,255,.65);font-family:'DM Sans',sans-serif;font-size:12px;padding:4px 8px;outline:none;cursor:pointer;}
.fe-select:focus{border-color:var(--gold);}
.fe-add-opt{width:100%;padding:9px;background:transparent;border:1px dashed rgba(255,255,255,.12);border-radius:8px;color:rgba(255,255,255,.35);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all .15s;margin-top:4px;}
.fe-add-opt:hover{border-color:rgba(255,255,255,.3);color:rgba(255,255,255,.7);}
.fe-add-q{width:100%;padding:13px;background:transparent;border:1px dashed rgba(184,150,46,.3);border-radius:var(--r);color:var(--gold);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;}
.fe-add-q:hover{background:rgba(184,150,46,.07);border-color:rgba(184,150,46,.5);}
.fe-preview{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:var(--r-lg);padding:20px;position:sticky;top:80px;}
.fe-preview-title{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:16px;}
.fe-preview-screen{background:#FAF8F4;border-radius:var(--r);padding:20px;min-height:200px;}
.fe-preview-q{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400;color:#0F2547;line-height:1.3;margin-bottom:14px;}
.fe-preview-opt{background:#fff;border:1.5px solid #E5E7EB;border-radius:8px;padding:12px 15px;margin-bottom:8px;font-size:13px;color:#0F2547;display:flex;align-items:center;justify-content:space-between;}
.fe-preview-opt-tag{font-size:10px;font-weight:600;padding:2px 8px;border-radius:100px;}
.fe-save-bar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:rgba(184,150,46,.08);border:1px solid rgba(184,150,46,.2);border-radius:var(--r);margin-bottom:16px;}
.fe-saved{font-size:13px;color:var(--gold-l);}

@media(max-width:768px){
  .hero-inner{padding:90px 24px 60px;}
  .sec{padding:56px 24px;}
  .prob-grid,.qual-grid{grid-template-columns:1fr;gap:24px;}
  .doc-card{grid-template-columns:1fr;}
  .doc-avatar{width:100%;height:160px;}
  .proto-row{grid-template-columns:1fr;}
  .stat-grid{grid-template-columns:1fr 1fr;}
  .adm-side{display:none;}
  .scar-box{padding:40px 24px;}
  .ty-card{padding:30px 20px;}
  .cal-body{padding:18px 18px;}
}
`;

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const DEFAULT_FUNNEL_CONFIG = {
  questions: [
    { id:"missing_teeth", screen:3, label:"How many teeth are you currently missing?", options:[
      { value:"1-2",     label:"1 or 2 teeth",              next:null, redirect:"PARTIAL",    tag:null },
      { value:"several", label:"Several teeth (3 or more)", next:4,    redirect:null,         tag:null },
      { value:"most_all",label:"Most or all of my teeth",   next:4,    redirect:null,         tag:null },
    ]},
    { id:"timeline", screen:4, label:"When are you thinking about starting treatment?", options:[
      { value:"immediately", label:"As soon as possible",      next:5, redirect:null,         tag:"HIGH_INTENT" },
      { value:"3_months",    label:"Within the next 3 months", next:5, redirect:null,         tag:"MEDIUM_INTENT" },
      { value:"3_6_months",  label:"Within 3 to 6 months",     next:5, redirect:null,         tag:"MEDIUM_INTENT" },
      { value:"researching", label:"Just researching for now",  next:null, redirect:"LOW_INTENT", tag:"LOW_INTENT" },
    ]},
    { id:"consulted_before", screen:5, label:"Have you consulted about implants before?", options:[
      { value:"yes", label:"Yes, I've consulted elsewhere",    next:6, redirect:null, tag:null },
      { value:"no",  label:"No, this would be my first time", next:6, redirect:null, tag:null },
    ]},
  ]
};

const SAMPLE_LEADS = [
  { id:1, first_name:"Rajeev",  phone:"+91 98100 12345", missing_teeth:"most_all", timeline:"immediately", consulted_before:"no",  lead_tag:"HIGH_INTENT",   created_at:"2026-02-27 09:14" },
  { id:2, first_name:"Sunita",  phone:"+91 97300 55678", missing_teeth:"several",  timeline:"3_months",    consulted_before:"yes", lead_tag:"MEDIUM_INTENT", created_at:"2026-02-27 10:02" },
  { id:3, first_name:"Anil",    phone:"+91 98700 33210", missing_teeth:"most_all", timeline:"immediately", consulted_before:"no",  lead_tag:"HIGH_INTENT",   created_at:"2026-02-26 16:45" },
  { id:4, first_name:"Kavita",  phone:"+91 99100 87654", missing_teeth:"several",  timeline:"3_6_months",  consulted_before:"no",  lead_tag:"MEDIUM_INTENT", created_at:"2026-02-26 14:30" },
  { id:5, first_name:"Pradeep", phone:"+91 98200 44321", missing_teeth:"several",  timeline:"researching", consulted_before:"no",  lead_tag:"LOW_INTENT",    created_at:"2026-02-25 11:20" },
  { id:6, first_name:"Meena",   phone:"+91 98000 99812", missing_teeth:"most_all", timeline:"immediately", consulted_before:"yes", lead_tag:"HIGH_INTENT",   created_at:"2026-02-25 09:55" },
  { id:7, first_name:"Vikram",  phone:"+91 97500 22109", missing_teeth:"several",  timeline:"3_months",    consulted_before:"no",  lead_tag:"MEDIUM_INTENT", created_at:"2026-02-24 15:10" },
  { id:8, first_name:"Geeta",   phone:"+91 99500 66543", missing_teeth:"most_all", timeline:"3_6_months",  consulted_before:"yes", lead_tag:"MEDIUM_INTENT", created_at:"2026-02-24 12:40" },
];

// ─────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────
function LandingPage({ onStart }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);
  const fade = (d) => ({ opacity:vis?1:0, transform:vis?"none":"translateY(20px)", transition:`all .7s ease ${d}s` });

  const protocol = [
    {n:"01",name:"Structural Assessment",desc:"3D CBCT scan evaluates bone volume, density, and anatomy before any treatment recommendation is made."},
    {n:"02",name:"Case Design",desc:"Digital treatment mapping. Implant positions and prosthetic outcomes planned virtually before clinical work begins."},
    {n:"03",name:"Eligibility Confirmation",desc:"Medical history review, soft tissue evaluation, and systemic health clearance. Precision over speed."},
    {n:"04",name:"Precision Placement",desc:"Guided surgical implant placement by a trained implantologist. Each implant positioned to the millimetre."},
    {n:"05",name:"Structured Follow-Through",desc:"Osseointegration monitoring, prosthetic delivery, and a long-term review protocol built into the timeline."},
  ];
  const appt = [
    {t:"Case Review",d:"Your dentition history, previous treatments, and functional concerns are fully documented before the consultation."},
    {t:"Diagnostic Imaging",d:"A 3D CBCT scan is completed at the clinic — providing precise volumetric data on your bone structure."},
    {t:"Specialist Consultation",d:"You meet directly with our implantologist. He reviews your scan and presents a preliminary treatment pathway."},
    {t:"Investment Clarity",d:"A transparent breakdown of what your reconstruction involves, costs, and its timeline. No vague estimates."},
    {t:"Next Step Discussion",d:"If you are a good candidate and ready to proceed, we schedule Stage 1. If you need time, that is respected."},
  ];

  return (
    <div>
      <section className="hero">
        <div className="hero-grid"/>
        <div className="hero-inner">
          <div style={fade(.1)}>
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-dot"/>
              <span className="hero-eyebrow-txt">Avana Dental · Lucknow</span>
            </div>
          </div>
          <h1 className="hero-h1" style={fade(.2)}>Restore Every Tooth.<em>Reclaim Every Moment.</em></h1>
          <p className="hero-sub" style={fade(.35)}>At Avana Dental, we offer full mouth implant reconstruction for individuals ready for a permanent, structured solution — one that restores function and confidence through a specialist-led process.</p>
          <div className="hero-ctas" style={fade(.5)}>
            <button className="btn-gold" onClick={onStart} style={{fontSize:16,padding:"18px 40px"}}>Check Your Eligibility</button>
            <button className="btn-ghost-hero"><span style={{textDecoration:"underline",textUnderlineOffset:3}}>See how it works</span> ↓</button>
          </div>
          <div className="trust-strip" style={fade(.65)}>
            {[{icon:"🏆",text:"500+ Full Mouth Cases"},{icon:"🎯",text:"Specialist-Led Protocol"},{icon:"📍",text:"Lucknow, Uttar Pradesh"},{icon:"⭐",text:"Premium Clinic"}].map((t,i)=>(
              <div key={i} className="trust-item"><div className="trust-icon">{t.icon}</div><span>{t.text}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white"><div className="sec">
        <div className="prob-grid">
          <div>
            <div className="sec-label">The situation</div>
            <h2 className="sec-h2">More than a dental<br/><em>question</em></h2>
          </div>
          <div>
            <p className="sec-body">There is a version of your life where eating feels effortless again. Where you speak without hesitation. Where you smile — not because you are covering something up — but because there is nothing left to cover.</p>
            <p className="sec-body">At a certain point, the absence of teeth becomes more than a clinical issue. It becomes a quiet tax on how you move through the world. The foods you avoid. The moments you opt out of photographs.</p>
            <p className="sec-body">This is about structure. Your teeth are load-bearing. When missing for months or years, the architecture beneath them begins to change in ways that grow progressively harder to reverse.</p>
            <p className="sec-body" style={{marginBottom:0}}>The people who come to us are not looking for a quick fix. They are looking for permanence.</p>
          </div>
        </div>
      </div></section>

      <section className="bg-navy"><div className="sec">
        <div className="sec-label" style={{color:"rgba(184,150,46,.8)"}}>Our method</div>
        <h2 className="sec-h2" style={{color:"#fff",maxWidth:600}}>The Avana Full Mouth<br/><em>Reconstruction Protocol™</em></h2>
        <p className="sec-body" style={{color:"rgba(255,255,255,.6)"}}>Most clinics begin with a procedure. We begin with a plan.</p>
        <div className="proto-table">
          {protocol.map((s,i)=>(
            <div key={i} className="proto-row">
              <div className="proto-stage"><div className="proto-num">{s.n}</div><div className="proto-name">{s.name}</div></div>
              <div className="proto-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div></section>

      <section className="bg-white"><div className="sec">
        <div className="sec-label">Your specialist</div>
        <h2 className="sec-h2">Precision requires<br/><em>dedication</em></h2>
        <p className="sec-body">Full mouth implant reconstruction demands a level of clinical focus that goes beyond general dental training.</p>
        <div className="doc-card">
          <div><div className="doc-avatar">⚕</div></div>
          <div>
            <p style={{fontSize:12,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>Implantology Specialist</p>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:29,fontWeight:400,color:"var(--navy)",marginBottom:13,lineHeight:1.2}}>Dr. [Name], MDS<br/><span style={{fontSize:18,color:"var(--gray-6)",fontWeight:300}}>Avana Dental, Lucknow</span></h3>
            <p style={{fontSize:15,lineHeight:1.7,color:"var(--gray-6)",marginBottom:14}}>Dr. [Name] has dedicated [X] years to implant surgery and full-arch reconstruction. With over 500 cases completed, his approach is methodical, evidence-based, and driven by one outcome: predictable long-term results.</p>
            <p style={{fontSize:15,lineHeight:1.7,color:"var(--gray-6)",marginBottom:14}}>He does not rush cases. He does not skip diagnostic steps. Every patient receives a customised plan — built on data, not assumption — before any surgical work begins.</p>
            <div className="doc-tags">
              {["MDS — Oral Surgery","Guided Implant Surgery","500+ Implant Cases","IDA Member","ITI Fellow"].map(c=>(
                <span key={c} className="doc-tag">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div></section>

      <section className="bg-cream"><div className="sec">
        <div className="sec-label">Your first visit</div>
        <h2 className="sec-h2">What happens at<br/><em>your evaluation</em></h2>
        <p className="sec-body">This is not a sales appointment. It is a clinical assessment — structured accordingly.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,marginTop:44,alignItems:"start"}}>
          <div className="appt-steps">
            {appt.map((s,i)=>(
              <div key={i} className="appt-step">
                <div className="appt-num">{i+1}</div>
                <div className="appt-content"><h4>{s.t}</h4><p>{s.d}</p></div>
              </div>
            ))}
          </div>
          <div style={{paddingTop:8}}>
            <div style={{background:"#fff",borderRadius:"var(--r-lg)",padding:28,border:"1px solid var(--gray-2)",boxShadow:"var(--sh-md)",marginBottom:18}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:400,color:"var(--navy)",marginBottom:12,fontStyle:"italic",lineHeight:1.5}}>"The evaluation is a conversation — one that begins with your diagnostics and ends with complete clarity."</p>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"var(--blue-tint)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>⚕</div>
                <div><div style={{fontSize:14,fontWeight:500,color:"var(--navy)"}}>Dr. [Name]</div><div style={{fontSize:12,color:"var(--gray-4)"}}>Implantologist, Avana Dental</div></div>
              </div>
            </div>
            <div style={{background:"var(--blue-tint)",borderRadius:"var(--r)",padding:22,border:"1px solid rgba(27,58,107,.1)"}}>
              <p style={{fontSize:11,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",color:"var(--navy)",marginBottom:6}}>Duration</p>
              <p style={{fontSize:26,fontFamily:"'Cormorant Garamond',serif",fontWeight:300,color:"var(--navy)"}}>~ 75 minutes</p>
              <p style={{fontSize:14,color:"var(--gray-6)",marginTop:4}}>Including imaging, consultation, and investment discussion</p>
            </div>
          </div>
        </div>
      </div></section>

      <section className="bg-white"><div className="sec">
        <div className="sec-label">Is this for you?</div>
        <h2 className="sec-h2">Who this is<br/><em>designed for</em></h2>
        <div className="qual-grid">
          <div className="qual-card qual-for">
            <h3 className="qual-h">This is for you if —</h3>
            {["You are 35–70 and missing multiple or all teeth","You have been managing with temporary solutions and are ready for permanence","You value long-term structural integrity over short-term cost minimisation","You want complete clarity — diagnosis, process, cost, timeline — before committing","You are medically stable and willing to follow a structured protocol"].map((item,i)=>(
              <div key={i} className="qual-item"><div className="qual-dot">✓</div><span>{item}</span></div>
            ))}
          </div>
          <div className="qual-card qual-not">
            <h3 className="qual-h">This may not be right if —</h3>
            {["You are seeking the lowest available cost regardless of outcome quality","You are not willing to complete the diagnostic protocol before proceeding","You have uncontrolled systemic conditions not reviewed by a physician","You expect same-day results without a planning phase"].map((item,i)=>(
              <div key={i} className="qual-item"><div className="qual-dot">→</div><span>{item}</span></div>
            ))}
          </div>
        </div>
      </div></section>

      <section className="bg-cream"><div className="sec">
        <div className="scar-box">
          <div className="scar-num">6–8</div>
          <div className="scar-lbl">Evaluation slots per week</div>
          <p className="scar-txt">Due to the diagnostic intensity required, Dr. [Name] limits initial evaluations to a fixed number each week. This is a clinical necessity — not a marketing construct.</p>
          <button className="btn-gold" onClick={onStart} style={{fontSize:16,padding:"18px 44px",display:"inline-block"}}>Reserve Your Evaluation →</button>
          <p style={{fontSize:13,color:"rgba(255,255,255,.4)",marginTop:14}}>Takes 4 minutes. Completely private. No obligation.</p>
        </div>
      </div></section>
    </div>
  );
}

// ─────────────────────────────────────────────
// FUNNEL
// ─────────────────────────────────────────────
const initFunnel = { screen:1, firstName:"", phone:"", answers:{}, tag:"MEDIUM_INTENT" };

function funnelReducer(state, action) {
  switch(action.type) {
    case "SCREEN":  return { ...state, screen:action.v };
    case "NAME":    return { ...state, firstName:action.v };
    case "PHONE":   return { ...state, phone:action.v };
    case "ANSWER":  return { ...state, answers:{ ...state.answers, [action.k]:action.v } };
    case "TAG":     return { ...state, tag:action.v };
    case "RESET":   return { ...initFunnel };
    default:        return state;
  }
}

function Funnel({ onComplete, config }) {
  const FUNNEL_CONFIG = config;
  const [s, d] = useReducer(funnelReducer, initFunnel);
  const { screen, firstName, phone, answers, tag } = s;

  const [nameVal,  setNameVal]  = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [nameErr,  setNameErr]  = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [selOpt,   setSelOpt]   = useState(null);
  const [msgIdx,   setMsgIdx]   = useState(0);
  const [sk,       setSk]       = useState(0);

  const msgs = [`Reviewing your responses, ${firstName}...`, "Matching you with the right pathway...", `One moment, ${firstName}...`];
  const pct  = Math.round((screen/6)*100);

  useEffect(() => { setSelOpt(null); setSk(k=>k+1); }, [screen]);

  useEffect(() => {
    if (screen !== 6) return;
    const iv = setInterval(() => setMsgIdx(i=>(i+1)%msgs.length), 900);
    sendToSheets({ id:Date.now(), first_name:firstName, phone, missing_teeth:answers.missing_teeth||"", timeline:answers.timeline||"", consulted_before:answers.consulted_before||"", lead_tag:tag, booked_date:"", booked_time:"" });
    const t = setTimeout(() => { clearInterval(iv); onComplete(tag, firstName); }, 2800);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, [screen]);

  const getQ = useCallback((sc) => FUNNEL_CONFIG.questions.find(q=>q.screen===sc), []);

  const pickOpt = useCallback((opt) => {
    setSelOpt(opt.value);
    if (opt.tag) d({ type:"TAG", v:opt.tag });
    d({ type:"ANSWER", k:getQ(screen)?.id, v:opt.value });
    setTimeout(() => {
      if (opt.redirect==="PARTIAL")    { onComplete("PARTIAL", firstName);    return; }
      if (opt.redirect==="LOW_INTENT") {
        sendToSheets({ id:Date.now(), first_name:firstName, phone, missing_teeth:answers.missing_teeth||"", timeline:opt.value, consulted_before:"", lead_tag:"LOW_INTENT", booked_date:"", booked_time:"" });
        onComplete("LOW_INTENT", firstName);
        return;
      }
      d({ type:"SCREEN", v:opt.next });
    }, 300);
  }, [screen, firstName, phone, answers, getQ, onComplete]);

  const goNext = () => {
    const ne = !nameVal.trim() ? "Please enter your name." : "";
    const pe = phoneVal.replace(/\D/g,"").length < 7 ? "Please enter a valid phone number." : "";
    setNameErr(ne); setPhoneErr(pe);
    if (ne || pe) return;
    d({ type:"NAME", v:nameVal.trim() });
    d({ type:"PHONE", v:phoneVal.trim() });
    d({ type:"SCREEN", v:2 });
  };

  return (
    <div className="funnel-wrap">
      <div className="funnel-bar"><div className="funnel-fill" style={{width:`${pct}%`}}/></div>
      <div className="funnel-head">
        <div className="funnel-logo">Avana <span>Dental</span></div>
        {screen>1 && screen<6 && <div className="funnel-ctr">Step {screen-1} of 4</div>}
      </div>
      <div className="funnel-body">
        <div className="funnel-screen" key={sk}>

          {/* S1: Name + Mobile */}
          {screen===1 && (
            <>
              <p className="f-q">Let's get started — tell us about yourself.</p>
              <p className="f-sub">We'll personalise everything from here and have our team reach out personally.</p>
              <div style={{marginBottom:18}}>
                <label className="f-label">First Name</label>
                <input className={`f-input${nameErr?" err":""}`} placeholder="Your first name" value={nameVal} autoFocus onChange={e=>{setNameVal(e.target.value);setNameErr("");}} />
                {nameErr && <p className="f-err">{nameErr}</p>}
              </div>
              <div>
                <label className="f-label">Mobile Number</label>
                <input className={`f-input${phoneErr?" err":""}`} placeholder="+91 98xxx xxxxx" type="tel" value={phoneVal} onChange={e=>{setPhoneVal(e.target.value);setPhoneErr("");}} onKeyDown={e=>e.key==="Enter"&&goNext()} />
                {phoneErr && <p className="f-err">{phoneErr}</p>}
              </div>
              <p className="f-micro">🔒 Your details are stored securely. Our team calls once, during business hours only, from a local Lucknow number.</p>
              <button className="f-btn" onClick={goNext}>Continue <span>→</span></button>
            </>
          )}

          {/* S2: Welcome */}
          {screen===2 && (
            <>
              <p className="f-q">Thank you, <span className="hi">{firstName}</span>.</p>
              <p className="f-sub">We're going to ask you three quick questions to understand your situation before we speak.<br/><br/>This helps us give you accurate information — not a generic response.</p>
              <p style={{fontSize:13,color:"var(--gray-4)",marginBottom:28}}>Takes about 2 minutes.</p>
              <button className="f-btn" onClick={()=>d({type:"SCREEN",v:3})}>Let's Begin <span>→</span></button>
            </>
          )}

          {/* S3/4/5: Questions */}
          {[3,4,5].includes(screen) && (()=>{
            const q = getQ(screen);
            if (!q) return null;
            return (
              <>
                <p className="f-q">
                  {screen===3 && <><span className="hi">{firstName}</span>, how many teeth are you currently missing?</>}
                  {screen===4 && "When are you thinking about starting treatment?"}
                  {screen===5 && "Have you consulted about implants before?"}
                </p>
                <div className="f-options">
                  {q.options.map(opt=>(
                    <button key={opt.value} className={`f-opt${selOpt===opt.value?" sel":""}`} onClick={()=>pickOpt(opt)}>
                      <span>{opt.label}</span>
                      <div className="f-opt-chk">{selOpt===opt.value?"✓":""}</div>
                    </button>
                  ))}
                </div>
              </>
            );
          })()}

          {/* S6: Loading */}
          {screen===6 && (
            <div className="f-loading">
              <div className="f-load-icon">⚕</div>
              <p className="f-load-msg" key={msgIdx}>{msgs[msgIdx]}</p>
              <div className="f-load-dots"><div className="f-load-dot"/><div className="f-load-dot"/><div className="f-load-dot"/></div>
              <p style={{fontSize:13,color:"var(--gray-4)",marginTop:22}}>500+ patients have completed this process at Avana</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CALENDAR
// ─────────────────────────────────────────────
function getDates() {
  const out=[]; const d=new Date(); d.setDate(d.getDate()+1);
  while(out.length<14){if(d.getDay()!==0)out.push(new Date(d));d.setDate(d.getDate()+1);}
  return out;
}
function getSlots(dt,type) {
  const all=["10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];
  const taken=type==="HIGH_INTENT"?5:type==="MEDIUM_INTENT"?3:1;
  const seed=dt.getDate()+dt.getMonth();
  return all.map((t,i)=>({time:t,available:(i+seed)%all.length>=taken}));
}
const fmtD = (d) => `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;

function Calendar({ type, name, onBooked }) {
  const dates=getDates();
  const [selDate,setSelDate]=useState(null);
  const [selSlot,setSelSlot]=useState(null);
  const [step,setStep]=useState("date");
  const slots=selDate?getSlots(selDate,type):[];
  const cfg={
    HIGH_INTENT:  {badge:"Priority Booking",    bg:"#D1FAE5",          fc:"#065F46",       urgency:"⚡ Only a few slots remain this week.",            sl:"Priority Evaluation — 75 min",      btn:"Confirm Priority Appointment", note:"As a priority patient, your file will be reviewed before you arrive."},
    MEDIUM_INTENT:{badge:"Consultation Booking",bg:"var(--blue-tint)", fc:"var(--navy)",   urgency:"ℹ Appointments typically available within 5–7 days.",sl:"Implant Evaluation — 75 min",        btn:"Confirm Appointment",          note:"You'll receive a call to confirm and share preparation notes."},
    LOW_INTENT:   {badge:"Informational Consult",bg:"var(--gold-pale)", fc:"var(--gold)",   urgency:"ℹ Flexible scheduling — pick whatever suits you.",  sl:"Info Consultation — 30 min",        btn:"Reserve a Slot",               note:"Completely obligation-free. You are welcome to bring a family member."},
    PARTIAL:      {badge:"Partial Assessment",   bg:"var(--blue-tint)", fc:"var(--navy)",   urgency:"ℹ Evaluation includes 3D imaging and specialist review.",sl:"Partial Implant Evaluation — 60 min",btn:"Confirm Assessment",           note:"Your evaluation will cover both single and partial implant options."},
  };
  const c=cfg[type]||cfg.MEDIUM_INTENT;
  const ord={date:0,time:1,confirm:2,booked:3};
  const cur=ord[step];

  return (
    <div className="cal-wrap">
      <div className="cal-head">
        <span className="cal-badge" style={{background:c.bg,color:c.fc}}>{c.badge}</span>
        <h3 className="cal-h">{step==="date"&&"Choose your date"}{step==="time"&&(selDate?fmtD(selDate):"Choose a time")}{step==="confirm"&&"Review & confirm"}{step==="booked"&&"You're confirmed!"}</h3>
        <p className="cal-sub">{c.sl}</p>
      </div>
      <div className="cal-steps">
        {["Select Date","Select Time","Confirm"].map((lbl,i)=>{
          const key=["date","time","confirm"][i];
          const done=cur>i; const active=cur===i;
          return (
            <div key={lbl} className={`cal-step ${done?"done":active?"active":"inactive"}`}
              onClick={()=>{if(done){if(key==="date"){setStep("date");setSelSlot(null);}if(key==="time"&&step==="confirm")setStep("time");}}}>
              {done?"✓ ":""}{lbl}
            </div>
          );
        })}
      </div>
      <div className="cal-body">
        {step==="date" && (
          <>
            <p style={{fontSize:11,fontWeight:600,letterSpacing:".07em",textTransform:"uppercase",color:"var(--gray-4)",marginBottom:13}}>Available Dates</p>
            <div className="cal-dates">
              {dates.map((d,i)=>(
                <button key={i} className={`cal-d${selDate&&d.toDateString()===selDate.toDateString()?" sel":""}`} onClick={()=>{setSelDate(d);setSelSlot(null);}}>
                  <span className="cal-d-day">{DAYS[d.getDay()]}</span>
                  <span className="cal-d-num">{d.getDate()}</span>
                  <span className="cal-d-mo">{MONTHS[d.getMonth()]}</span>
                </button>
              ))}
            </div>
            <p style={{marginTop:13,fontSize:12,color:type==="HIGH_INTENT"?"#065F46":"var(--gray-4)",background:type==="HIGH_INTENT"?"#D1FAE5":"transparent",padding:type==="HIGH_INTENT"?"7px 11px":"0",borderRadius:7,display:"inline-block"}}>{c.urgency}</p>
            <button className="f-btn" disabled={!selDate} style={{marginTop:18}} onClick={()=>setStep("time")}>Continue to Select Time →</button>
          </>
        )}
        {step==="time" && selDate && (
          <>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:16}}>
              <button onClick={()=>setStep("date")} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:13,color:"var(--gray-4)",fontFamily:"'DM Sans',sans-serif",padding:0}}>← Change date</button>
              <span style={{fontWeight:600,fontSize:14,color:"var(--navy)"}}>{fmtD(selDate)}</span>
            </div>
            <p style={{fontSize:11,fontWeight:600,letterSpacing:".07em",textTransform:"uppercase",color:"var(--gray-4)",marginBottom:11}}>Available Times</p>
            <div className="cal-slots">
              {slots.map(s=>(
                <button key={s.time} className={`cal-slot${selSlot===s.time?" sel":""}`} disabled={!s.available} onClick={()=>setSelSlot(s.time)}>
                  <span>{s.time}</span>
                  {!s.available&&<span className="cal-slot-taken">Taken</span>}
                  {s.available&&selSlot===s.time&&<span>✓</span>}
                </button>
              ))}
            </div>
            <button className="f-btn" disabled={!selSlot} style={{marginTop:18}} onClick={()=>setStep("confirm")}>Continue to Confirm →</button>
          </>
        )}
        {step==="confirm" && selDate && selSlot && (
          <>
            <div className="cal-summary">
              {[{l:"Patient",v:name},{l:"Date",v:fmtD(selDate)},{l:"Time",v:selSlot},{l:"Type",v:c.sl},{l:"Location",v:"Avana Dental, Lucknow"}].map(r=>(
                <div key={r.l} className="cal-row"><span className="cal-row-lbl">{r.l}</span><span className="cal-row-val">{r.v}</span></div>
              ))}
            </div>
            <div className="cal-note"><span style={{fontSize:15,flexShrink:0}}>ℹ</span><span>{c.note}</span></div>
            <button className="btn-confirm" onClick={()=>{
              const info={date:fmtD(selDate),time:selSlot};
              setStep("booked"); onBooked(info);
              sendToSheets({id:Date.now(),first_name:name,phone:"",missing_teeth:"",timeline:"",consulted_before:"",lead_tag:type+"_BOOKED",booked_date:info.date,booked_time:info.time});
            }}>{c.btn} →</button>
            <button className="btn-text" onClick={()=>setStep("time")}>← Change time</button>
          </>
        )}
        {step==="booked" && selDate && selSlot && (
          <div className="cal-booked">
            <div className="cal-booked-icon">✓</div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:400,color:"var(--navy)",marginBottom:10}}>You're booked, {name}.</h3>
            <p style={{fontSize:15,color:"var(--gray-6)",lineHeight:1.6}}>Confirmed for <strong style={{color:"var(--navy)"}}>{fmtD(selDate)} at {selSlot}</strong> at Avana Dental, Lucknow.</p>
            <div className="cal-bring">
              <p style={{fontSize:13,fontWeight:600,color:"var(--navy)",marginBottom:10}}>What to bring</p>
              {["A government-issued photo ID","Any previous dental records or X-rays","A list of current medications (if any)","A family member is welcome"].map((item,i)=>(
                <div key={i} className="cal-bring-item"><span style={{color:"var(--gold)",fontWeight:600,flexShrink:0}}>→</span>{item}</div>
              ))}
            </div>
            <p style={{fontSize:13,color:"var(--gray-4)",marginTop:13}}>📞 Avana Dental · Mon–Sat, 10 AM – 7 PM · Lucknow</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// THANK YOU
// ─────────────────────────────────────────────
function ThankYou({ type, name, onBack }) {
  const [booked, setBooked] = useState(null);
  const cfgs = {
    HIGH_INTENT:   {cls:"ty-high",icon:"✓",title:`${name}, your assessment is confirmed.`,      sub:"You've been added to our priority list. Choose a slot below — your evaluation will be confirmed within the hour."},
    MEDIUM_INTENT: {cls:"ty-med", icon:"📋",title:`${name}, we have received your information.`,sub:"Schedule your evaluation below. Our team will send a confirmation once your slot is reserved."},
    LOW_INTENT:    {cls:"ty-low", icon:"📖",title:`${name}, thank you for your interest.`,      sub:"No commitment required. Book a free informational consultation below to visit the clinic and ask your questions."},
    PARTIAL:       {cls:"ty-med", icon:"ℹ", title:`${name}, let's talk partial implants.`,      sub:"You may be a candidate for single or partial implant solutions. Book your targeted assessment below."},
  };
  const c = cfgs[type] || cfgs.MEDIUM_INTENT;
  return (
    <div className="ty-wrap">
      <div className="ty-inner">
        <div className={`ty-card ${c.cls}`}>
          <div className="ty-icon">{c.icon}</div>
          <h1 className="ty-h">{c.title}</h1>
          <p className="ty-sub">{c.sub}</p>
          {booked ? (
            <div className="ty-booked-banner">
              <span style={{fontSize:22}}>✓</span>
              <div style={{textAlign:"left"}}>
                <p style={{fontSize:15,fontWeight:600,color:"#065F46"}}>Appointment confirmed</p>
                <p style={{fontSize:13,color:"#047857"}}>{booked.date} at {booked.time} · Avana Dental, Lucknow</p>
              </div>
            </div>
          ) : (
            <>
              <div className="ty-divider">
                <div className="ty-divider-line"/>
                <span className="ty-divider-txt">Book Your Visit</span>
                <div className="ty-divider-line"/>
              </div>
              <Calendar type={type} name={name} onBooked={setBooked} />
            </>
          )}
          <div style={{marginTop:26,paddingTop:20,borderTop:"1px solid var(--gray-2)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div style={{fontSize:13,color:"var(--gray-6)"}}><strong style={{color:"var(--navy)"}}>Avana Dental, Lucknow</strong> · Mon–Sat, 10 AM – 7 PM</div>
            <button className="btn-outline" onClick={onBack}>← Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FUNNEL EDITOR (live, fully editable)
// ─────────────────────────────────────────────
const TAG_OPTIONS = [
  { value:"",             label:"No tag" },
  { value:"HIGH_INTENT",  label:"HIGH" },
  { value:"MEDIUM_INTENT",label:"MEDIUM" },
  { value:"LOW_INTENT",   label:"LOW" },
];
const REDIRECT_OPTIONS = [
  { value:"",          label:"None" },
  { value:"PARTIAL",   label:"→ Partial page" },
  { value:"LOW_INTENT",label:"→ Low intent page" },
];

function FunnelEditor({ config, onConfigChange }) {
  const [expQ,    setExpQ]    = useState(0);
  const [saved,   setSaved]   = useState(false);
  const [preview, setPreview] = useState(0); // which question index to preview

  // Deep-clone helper
  const clone = (c) => JSON.parse(JSON.stringify(c));

  // ── Question-level edits ──
  const updateQLabel = (qi, val) => {
    const c = clone(config);
    c.questions[qi].label = val;
    onConfigChange(c);
    setSaved(false);
  };

  const moveQ = (qi, dir) => {
    const c = clone(config);
    const qs = c.questions;
    const target = qi + dir;
    if (target < 0 || target >= qs.length) return;
    [qs[qi], qs[target]] = [qs[target], qs[qi]];
    // Re-assign screen numbers (3,4,5...)
    qs.forEach((q, i) => { q.screen = i + 3; });
    // Fix next pointers
    qs.forEach(q => {
      q.options.forEach(o => {
        if (o.next !== null && !o.redirect) {
          // next stays relative — keep as-is for simplicity
        }
      });
    });
    onConfigChange(c);
    setExpQ(target);
    setSaved(false);
  };

  const deleteQ = (qi) => {
    if (config.questions.length <= 1) return;
    const c = clone(config);
    c.questions.splice(qi, 1);
    c.questions.forEach((q, i) => { q.screen = i + 3; });
    onConfigChange(c);
    setExpQ(Math.min(expQ, c.questions.length - 1));
    setSaved(false);
  };

  const addQuestion = () => {
    const c = clone(config);
    const nextScreen = 3 + c.questions.length;
    c.questions.push({
      id: "question_" + Date.now(),
      screen: nextScreen,
      label: "New question",
      options: [
        { value:"option_a", label:"Option A", next: nextScreen + 1, redirect:null, tag:null },
        { value:"option_b", label:"Option B", next: nextScreen + 1, redirect:null, tag:null },
      ]
    });
    onConfigChange(c);
    setExpQ(c.questions.length - 1);
    setSaved(false);
  };

  // ── Option-level edits ──
  const updateOpt = (qi, oi, field, val) => {
    const c = clone(config);
    c.questions[qi].options[oi][field] = val === "" ? null : val;
    // If redirect is set, clear next; if next is set, clear redirect
    if (field === "redirect" && val) c.questions[qi].options[oi].next = null;
    if (field === "next" && val)     c.questions[qi].options[oi].redirect = null;
    onConfigChange(c);
    setSaved(false);
  };

  const addOption = (qi) => {
    const c = clone(config);
    const q = c.questions[qi];
    q.options.push({
      value: "option_" + Date.now(),
      label: "New option",
      next: q.screen + 1,
      redirect: null,
      tag: null,
    });
    onConfigChange(c);
    setSaved(false);
  };

  const deleteOpt = (qi, oi) => {
    if (config.questions[qi].options.length <= 1) return;
    const c = clone(config);
    c.questions[qi].options.splice(oi, 1);
    onConfigChange(c);
    setSaved(false);
  };

  const handleSave = () => {
    // In production this would POST to your backend/Sheets
    // For now: save to localStorage as backup + show confirmation
    try {
      localStorage.setItem("avana_funnel_config", JSON.stringify(config));
    } catch(e) {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (!window.confirm("Reset funnel to default? This cannot be undone.")) return;
    onConfigChange(DEFAULT_FUNNEL_CONFIG);
    setSaved(false);
  };

  // Load from localStorage on mount if saved config exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem("avana_funnel_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.questions) onConfigChange(parsed);
      }
    } catch(e) {}
  }, []);

  const tc = t => t==="HIGH_INTENT"?"hi":t==="MEDIUM_INTENT"?"med":"lo";
  const tagColor = { HIGH_INTENT:"#6EE7B7", MEDIUM_INTENT:"#93C5FD", LOW_INTENT:"rgba(255,255,255,.35)" };
  const tagBg    = { HIGH_INTENT:"rgba(16,185,129,.15)", MEDIUM_INTENT:"rgba(59,130,246,.15)", LOW_INTENT:"rgba(156,163,175,.1)" };

  const prevQ = config.questions[preview] || config.questions[0];

  return (
    <>
      <div className="adm-topbar">
        <h2>Funnel Editor</h2>
        <div className="adm-actions">
          <button className="adm-btn" onClick={handleReset}>↺ Reset to default</button>
          <button className="adm-btn primary" onClick={handleSave}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
      <div className="adm-content">
        {saved && (
          <div className="fe-save-bar">
            <span className="fe-saved">✓ Changes saved and applied to the live funnel</span>
            <button className="adm-btn" style={{fontSize:12,padding:"5px 12px"}} onClick={()=>setSaved(false)}>Dismiss</button>
          </div>
        )}
        <p style={{fontSize:13,color:"rgba(255,255,255,.3)",marginBottom:20,lineHeight:1.6}}>
          Edit question text, option labels, routing, and intent tags. Changes apply to the funnel immediately.
          Click <strong style={{color:"rgba(255,255,255,.5)"}}>Save</strong> to persist across page reloads.
        </p>

        <div className="fe-wrap">
          {/* Left: question list */}
          <div>
            <div className="fe-questions">
              {config.questions.map((q, qi) => (
                <div key={q.id || qi} className="fe-q-card">
                  {/* Question header */}
                  <div className="fe-q-head" onClick={() => setExpQ(expQ === qi ? -1 : qi)}>
                    <span className="fe-q-badge">Q{qi + 1} · Screen {q.screen}</span>
                    <input
                      className="fe-q-label-input"
                      value={q.label}
                      onChange={e => { e.stopPropagation(); updateQLabel(qi, e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      placeholder="Question text..."
                    />
                    <div className="fe-q-actions" onClick={e => e.stopPropagation()}>
                      <button className="fe-icon-btn" title="Preview" onClick={() => setPreview(qi)}>👁</button>
                      <button className="fe-icon-btn" title="Move up"   onClick={() => moveQ(qi, -1)} disabled={qi===0} style={{opacity:qi===0?.3:1}}>↑</button>
                      <button className="fe-icon-btn" title="Move down" onClick={() => moveQ(qi, 1)}  disabled={qi===config.questions.length-1} style={{opacity:qi===config.questions.length-1?.3:1}}>↓</button>
                      <button className="fe-icon-btn danger" title="Delete question" onClick={() => deleteQ(qi)}>🗑</button>
                      <span style={{color:"rgba(255,255,255,.2)",fontSize:14,marginLeft:2}}>{expQ===qi?"▲":"▼"}</span>
                    </div>
                  </div>

                  {/* Options panel */}
                  {expQ === qi && (
                    <div className="fe-q-body">
                      <div className="fe-opts-label">Options</div>
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="fe-opt-row">
                          {/* Label */}
                          <input
                            className="fe-opt-input"
                            value={opt.label}
                            onChange={e => updateOpt(qi, oi, "label", e.target.value)}
                            placeholder="Option label..."
                          />
                          {/* Tag */}
                          <select
                            className="fe-select"
                            value={opt.tag || ""}
                            onChange={e => updateOpt(qi, oi, "tag", e.target.value)}
                            title="Intent tag"
                          >
                            {TAG_OPTIONS.map(t => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                          {/* Redirect */}
                          <select
                            className="fe-select"
                            value={opt.redirect || ""}
                            onChange={e => updateOpt(qi, oi, "redirect", e.target.value)}
                            title="Redirect to page"
                          >
                            {REDIRECT_OPTIONS.map(r => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                          {/* Delete */}
                          <button
                            className="fe-icon-btn danger"
                            onClick={() => deleteOpt(qi, oi)}
                            disabled={q.options.length <= 1}
                            style={{opacity:q.options.length<=1?.25:1}}
                            title="Remove option"
                          >🗑</button>
                        </div>
                      ))}
                      <button className="fe-add-opt" onClick={() => addOption(qi)}>+ Add option</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button className="fe-add-q" style={{marginTop:10}} onClick={addQuestion}>
              + Add question
            </button>
          </div>

          {/* Right: live preview panel */}
          <div className="fe-preview">
            <div className="fe-preview-title">
              Live Preview — Q{preview + 1}
              <span style={{color:"rgba(255,255,255,.18)",marginLeft:6,fontWeight:400}}>
                (click 👁 on any question)
              </span>
            </div>
            <div className="fe-preview-screen">
              <p className="fe-preview-q">{prevQ.label || "Question text..."}</p>
              {prevQ.options.map((opt, oi) => (
                <div key={oi} className="fe-preview-opt">
                  <span style={{fontSize:13,color:"#0F2547"}}>{opt.label || "Option label"}</span>
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    {opt.redirect && (
                      <span style={{fontSize:10,color:"#92400E",background:"#FEF3C7",padding:"2px 6px",borderRadius:100,fontWeight:600}}>
                        → {opt.redirect.replace("_INTENT","")}
                      </span>
                    )}
                    {opt.tag && (
                      <span className="fe-preview-opt-tag" style={{background:tagBg[opt.tag]||"#eee",color:tagColor[opt.tag]||"#333"}}>
                        {opt.tag.replace("_INTENT","")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop:14,padding:12,background:"rgba(255,255,255,.03)",borderRadius:8,fontSize:12,color:"rgba(255,255,255,.28)",lineHeight:1.6}}>
              <strong style={{color:"rgba(255,255,255,.45)"}}>Routing logic</strong>
              <div style={{marginTop:6}}>
                {prevQ.options.map((opt, oi) => (
                  <div key={oi} style={{display:"flex",justifyContent:"space-between",marginBottom:4,gap:8}}>
                    <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{opt.label||"Option"}</span>
                    <span style={{color:"rgba(255,255,255,.4)",flexShrink:0}}>
                      {opt.redirect ? `→ ${opt.redirect}` : opt.next ? `→ Screen ${opt.next}` : "→ end"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pw,setPw]=useState(""); const [err,setErr]=useState("");
  const check=()=>{if(pw==="admin123")onLogin();else setErr("Incorrect password.");};
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div style={{textAlign:"center",marginBottom:30}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:27,color:"#fff",marginBottom:5}}>Avana <span style={{color:"var(--gold)"}}>Dental</span></div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.3)",letterSpacing:".08em",textTransform:"uppercase"}}>Admin Panel</div>
        </div>
        <label className="f-label" style={{color:"rgba(255,255,255,.38)"}}>Password</label>
        <input className="f-input" type="password" placeholder="Enter password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&check()} style={{marginBottom:6}}/>
        {err&&<p style={{fontSize:12,color:"#FCA5A5",marginBottom:8}}>{err}</p>}
        <p style={{fontSize:12,color:"rgba(255,255,255,.22)",marginBottom:14}}>Demo password: admin123</p>
        <button className="f-btn" onClick={check}>Sign In →</button>
      </div>
    </div>
  );
}

function Admin({ onLogout, config, onConfigChange }) {
  const [tab,setTab]=useState("dashboard");
  const [filt,setFilt]=useState("ALL");
  const [expQ,setExpQ]=useState(null);
  const [leads,setLeads]=useState(SAMPLE_LEADS);
  const [loading,setLoading]=useState(false);
  const [lastFetch,setLastFetch]=useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(SHEETS_URL + "?action=getLeads");
      const data = await res.json();
      if (data && data.leads && data.leads.length > 0) {
        setLeads(data.leads);
        setLastFetch(new Date().toLocaleTimeString());
      }
    } catch(e) {
      console.warn("Could not fetch leads:", e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const high=leads.filter(l=>l.lead_tag==="HIGH_INTENT").length;
  const med=leads.filter(l=>l.lead_tag==="MEDIUM_INTENT").length;
  const low=leads.filter(l=>l.lead_tag==="LOW_INTENT").length;
  const total=leads.length;
  const shown=filt==="ALL"?leads:leads.filter(l=>l.lead_tag===filt);
  const tl={immediately:"ASAP","3_months":"3 mo","3_6_months":"3–6 mo",researching:"Research"};
  const tthl={"1-2":"1–2",several:"Several",most_all:"Most/All"};
  const tc=t=>t==="HIGH_INTENT"?"hi":t==="MEDIUM_INTENT"?"med":"lo";
  const ts=t=>t.replace("_INTENT","");
  const navs=[{id:"dashboard",label:"Dashboard",icon:"📊"},{id:"leads",label:"Leads",icon:"👥"},{id:"funnel",label:"Funnel Editor",icon:"🔀"},{id:"settings",label:"Settings",icon:"⚙️"}];
  const exportCSV=()=>{
    const rows=["ID,Name,Phone,Teeth,Timeline,Consulted,Tag,Date",...shown.map(l=>`${l.id},${l.first_name},${l.phone},${l.missing_teeth},${l.timeline},${l.consulted_before},${l.lead_tag},${l.created_at}`)].join("\n");
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([rows],{type:"text/csv"})); a.download="avana_leads.csv"; a.click();
  };
  return (
    <div className="adm-wrap">
      <div className="adm-side">
        <div className="adm-logo">Avana <span>Dental</span><small>Admin Panel</small></div>
        <nav className="adm-nav">
          {navs.map(n=>(
            <button key={n.id} className={`adm-nav-item${tab===n.id?" act":""}`} onClick={()=>setTab(n.id)}>
              <span style={{fontSize:15,width:20,textAlign:"center"}}>{n.icon}</span>{n.label}
            </button>
          ))}
          <button className="adm-nav-item" onClick={onLogout} style={{marginTop:6}}>
            <span style={{fontSize:15,width:20,textAlign:"center"}}>🚪</span>Sign Out
          </button>
        </nav>
      </div>
      <div className="adm-main">
        {tab==="dashboard"&&(
          <>
            <div className="adm-topbar"><h2>Dashboard</h2><div className="adm-actions">{lastFetch&&<span style={{fontSize:12,color:"rgba(255,255,255,.3)",marginRight:8}}>Updated {lastFetch}</span>}<button className="adm-btn" onClick={fetchLeads} disabled={loading}>{loading?"Refreshing...":"↻ Refresh"}</button><button className="adm-btn primary" onClick={()=>setTab("leads")}>View All Leads</button></div></div>
            <div className="adm-content">
              <div className="stat-grid">
                <div className="stat-card"><div className="stat-lbl">Total Leads</div><div className="stat-val">{total}</div><div className="stat-sub">All time</div></div>
                <div className="stat-card"><div className="stat-lbl">High Intent</div><div className="stat-val" style={{color:"#6EE7B7"}}>{high}</div><div className="stat-sub">{Math.round(high/total*100)}%</div></div>
                <div className="stat-card"><div className="stat-lbl">Medium Intent</div><div className="stat-val" style={{color:"#93C5FD"}}>{med}</div><div className="stat-sub">{Math.round(med/total*100)}%</div></div>
                <div className="stat-card"><div className="stat-lbl">Low Intent</div><div className="stat-val" style={{color:"rgba(255,255,255,.38)"}}>{low}</div><div className="stat-sub">{Math.round(low/total*100)}%</div></div>
              </div>
              <div className="adm-tbl-wrap">
                <table className="adm-tbl">
                  <thead><tr><th>Name</th><th>Phone</th><th>Teeth</th><th>Timeline</th><th>Tag</th><th>Date</th></tr></thead>
                  <tbody>{SAMPLE_LEADS.slice(0,6).map(l=>(
                    <tr key={l.id}>
                      <td className="name-cell">{l.first_name}</td><td className="mono">{l.phone}</td>
                      <td>{tthl[l.missing_teeth]||l.missing_teeth}</td><td>{tl[l.timeline]||l.timeline}</td>
                      <td><span className={`tag ${tc(l.lead_tag)}`}>{ts(l.lead_tag)}</span></td><td>{l.created_at}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {tab==="leads"&&(
          <>
            <div className="adm-topbar"><h2>Leads</h2><div className="adm-actions"><button className="adm-btn" onClick={fetchLeads} disabled={loading}>{loading?"Refreshing...":"↻ Refresh"}</button><button className="adm-btn" onClick={exportCSV}>⬇ Export CSV</button></div></div>
            <div className="adm-content">
              <div className="adm-tbl-wrap">
                <div className="adm-tbl-head">
                  <div className="adm-tbl-title">{shown.length} leads</div>
                  <div className="adm-filters">
                    {["ALL","HIGH_INTENT","MEDIUM_INTENT","LOW_INTENT"].map(f=>(
                      <button key={f} className={`adm-filter${filt===f?" act":""}`} onClick={()=>setFilt(f)}>{f==="ALL"?"All":f.replace("_INTENT","")}</button>
                    ))}
                  </div>
                </div>
                <table className="adm-tbl">
                  <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Teeth</th><th>Timeline</th><th>Consulted</th><th>Tag</th><th>Date</th></tr></thead>
                  <tbody>{shown.map(l=>(
                    <tr key={l.id}>
                      <td style={{color:"rgba(255,255,255,.18)"}}>{l.id}</td>
                      <td className="name-cell">{l.first_name}</td><td className="mono">{l.phone}</td>
                      <td>{tthl[l.missing_teeth]||l.missing_teeth}</td><td>{tl[l.timeline]||l.timeline}</td>
                      <td>{l.consulted_before}</td>
                      <td><span className={`tag ${tc(l.lead_tag)}`}>{ts(l.lead_tag)}</span></td><td>{l.created_at}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {tab==="funnel"&&(
          <FunnelEditor config={config} onConfigChange={onConfigChange} />
        )}
        {tab==="settings"&&(
          <>
            <div className="adm-topbar"><h2>Settings</h2></div>
            <div className="adm-content"><div style={{maxWidth:480}}>
              <div style={{marginBottom:16,padding:"13px 16px",background:"rgba(184,150,46,.1)",border:"1px solid rgba(184,150,46,.25)",borderRadius:"var(--r)"}}>
                <p style={{fontSize:13,fontWeight:600,color:"var(--gold-l)",marginBottom:3}}>Google Sheets Integration</p>
                <p style={{fontSize:12,color:"rgba(255,255,255,.38)",lineHeight:1.6}}>Paste your Apps Script Web App URL below. Follow setup instructions in the source code comments.</p>
              </div>
              <label className="f-label" style={{color:"rgba(255,255,255,.38)"}}>Apps Script Web App URL</label>
              <input className="f-input" defaultValue={SHEETS_URL} style={{background:"rgba(255,255,255,.06)",borderColor:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.75)",marginBottom:20}}/>
              {[{l:"Clinic Name",v:"Avana Dental"},{l:"Doctor Name",v:"Dr. [Name], MDS"},{l:"Clinic Phone",v:"+91 [number]"},{l:"Evaluation Slots/Week",v:"6"},{l:"High Intent SLA",v:"4 hours"}].map(s=>(
                <div key={s.l} style={{marginBottom:16}}>
                  <label className="f-label" style={{color:"rgba(255,255,255,.38)"}}>{s.l}</label>
                  <input className="f-input" defaultValue={s.v} style={{background:"rgba(255,255,255,.06)",borderColor:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.75)"}}/>
                </div>
              ))}
              <button className="adm-btn primary">Save Settings</button>
            </div></div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [page,    setPage]    = useState("landing");
  const [tyType,  setTyType]  = useState("MEDIUM_INTENT");
  const [tyName,  setTyName]  = useState("there");
  const [authed,  setAuthed]  = useState(false);
  const [config,  setConfig]  = useState(DEFAULT_FUNNEL_CONFIG);

  const goHome  = () => setPage("landing");
  const goFunnel= () => setPage("funnel");

  const navStyle = page==="landing" ? "nav light" : "nav solid";
  const showNav  = page!=="funnel" && !page.startsWith("admin");

  return (
    <>
      <style>{CSS}</style>

      {showNav && (
        <nav className={navStyle}>
          <div className="nav-logo">Avana <span>Dental</span></div>
          <div style={{display:"flex",gap:13,alignItems:"center"}}>
            {page!=="landing" && <button className="nav-back" onClick={goHome}>← Back to Home</button>}
            <button className="nav-btn" onClick={()=>{if(authed)setPage("admin");else setPage("admin-login");}}>Admin</button>
          </div>
        </nav>
      )}

      <div style={{paddingTop:showNav?60:0}}>
        {page==="landing"    && <LandingPage onStart={goFunnel}/>}
        {page==="funnel"     && <Funnel config={config} onComplete={(tag,name)=>{setTyType(tag);setTyName(name||"there");setPage("ty");}}/>}
        {page==="ty"         && <ThankYou type={tyType} name={tyName} onBack={goHome}/>}
        {page==="admin-login"&& <AdminLogin onLogin={()=>{setAuthed(true);setPage("admin");}}/>}
        {page==="admin"&&authed&& <Admin config={config} onConfigChange={setConfig} onLogout={()=>{setAuthed(false);setPage("landing");}}/>}
      </div>

      {page==="landing" && (
        <div className="sticky-cta">
          <button className="btn-gold" onClick={goFunnel} style={{fontSize:14,padding:"13px 26px",boxShadow:"0 8px 26px rgba(184,150,46,.44)"}}>
            Check Eligibility →
          </button>
        </div>
      )}
    </>
  );
}