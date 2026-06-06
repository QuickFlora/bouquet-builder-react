import { useState } from 'react'
import { PRICE_MARKUP } from './data.js'
import { components, defTime, unitCost, money, recipeId, onHand, barcode, hash, LABOR_RATE } from './helpers.js'
export default function RecipeView({product:p,onEdit,onDelete,back}){
  const multi = p.cls==='Bouquet' && p.sizes && p.sizes.length>1
  const sizes = p.sizes||['standard']
  const [si,setSi]=useState(0)
  const [price,setPrice]=useState(p.priceType||'Normal')
  const [time,setTime]=useState(p.time||defTime(p,0))
  const [rate,setRate]=useState(p.rate||LABOR_RATE)
  const [markup,setMarkup]=useState(p.markup||PRICE_MARKUP[price]||100)
  const comps=components(p,si)
  let sub=0,items=0; comps.forEach(c=>{sub+=c.qty*unitCost(c.item,c.goods);items+=c.qty})
  const labor=time/60*rate, total=sub+labor, mt=total*markup/100, retail=total+mt
  const box=(p.box&&p.box[si])||'—', packed=(p.packed&&p.packed[si])||'—'
  return (
    <div className="wrap">
      <div className="crumb" style={{marginBottom:8,cursor:'pointer'}} onClick={back}><i className="ti ti-arrow-left"></i> Back to catalog</div>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:14}}>
        {p.src? <img src={p.src} style={{width:70,height:70,borderRadius:10,objectFit:'cover',background:'#f0f0f0'}}/> : <div style={{width:70,height:70,borderRadius:10,background:'var(--green-bg)',color:'var(--green)',display:'flex',alignItems:'center',justifyContent:'center'}}><i className="ti ti-flower" style={{fontSize:30}}></i></div>}
        <div><h1 style={{margin:0}}>{p.name}</h1><div className="sub" style={{margin:'2px 0 0'}}>{recipeId(p.sku)} · {p.cls} · {p.line}</div></div>
        <div style={{marginLeft:'auto',display:'flex',gap:8}}><button className="btn" onClick={onEdit}><i className="ti ti-edit"></i> Edit</button><button className="btn" onClick={()=>{if(confirm('Delete this recipe?'))onDelete(p.sku)}}><i className="ti ti-trash"></i> Delete</button></div>
      </div>
      <div className="imp"><i className="ti ti-sparkles" style={{fontSize:16}}></i><div><b>Improvements over the current POS pages:</b> live on-hand &amp; shelf-life per component, per-component barcode, item class, {multi?'size variants (12/24/36 stems), ':''}and live cost roll-up.</div></div>
      {multi && <div style={{display:'flex',gap:8,marginBottom:14}}>{sizes.map((s,i)=>(<span key={s} className={'sztab'+(i===si?' on':'')} onClick={()=>{setSi(i);setTime(defTime(p,i))}}>{s} stems</span>))}</div>}
      <div className="card" style={{padding:'18px 20px',marginBottom:16}}>
        <div style={{fontWeight:600,marginBottom:14}}>Recipe worksheet</div>
        <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:24}}>
          <div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="fg"><label>Recipe ID</label><input value={recipeId(p.sku)} readOnly/></div>
              <div className="fg"><label>Item ID / SKU</label><input value={p.sku} readOnly/></div>
              <div className="fg"><label>Price type</label><select value={price} onChange={e=>{setPrice(e.target.value);setMarkup(PRICE_MARKUP[e.target.value])}}>{Object.keys(PRICE_MARKUP).map(k=><option key={k}>{k}</option>)}</select></div>
              <div className="fg"><label>COGS account</label><input value="5000 · COGS – Floral" readOnly/></div>
            </div>
            <div className="fg"><label>Recipe description</label><input defaultValue={(p.desc)||(p.name+' — '+p.line)}/></div>
            <div className="fg"><label>Recipe instructions</label><textarea rows="2" defaultValue={p.instr||'Cut stems at 45°, condition 2 hrs. Build per BOM.'}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
              <div className="fg"><label>Recipe time (min)</label><input type="number" value={time} onChange={e=>setTime(+e.target.value)}/></div>
              <div className="fg"><label>Labor rate ($/hr)</label><input type="number" value={rate} onChange={e=>setRate(+e.target.value)}/></div>
              <div className="fg"><label>Markup (%)</label><input type="number" value={markup} onChange={e=>setMarkup(+e.target.value)}/></div>
            </div>
            <div style={{fontSize:12.5,color:'var(--muted)'}}>Box type <b>{box}</b> · Packed by <b>{packed}</b></div>
          </div>
          <div className="card" style={{padding:'14px 16px',background:'var(--bg)',border:'none'}}>
            <div className="costrow"><span>Items in recipe</span><b>{items}</b></div>
            <div className="costrow"><span>Sub total (goods)</span><b>{money(sub)}</b></div>
            <div className="costrow"><span>Labor cost</span><b>{money(labor)}</b></div>
            <div className="costrow"><span>Total cost</span><b>{money(total)}</b></div>
            <div className="costrow"><span>Markup total</span><b>{money(mt)}</b></div>
            <div className="costrow big"><span>Total retail</span><b>{money(retail)}</b></div>
          </div>
        </div>
      </div>
      <div className="card" style={{padding:'18px 20px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}><div style={{fontWeight:600}}>Bill of materials</div><div className="search" style={{cursor:'text'}}><i className="ti ti-search"></i> Item search — add component</div></div>
        <table><thead><tr><th>Item</th><th>Type</th><th style={{textAlign:'right'}}>Qty</th><th style={{textAlign:'right'}}>Unit cost</th><th style={{textAlign:'right'}}>Ext cost</th><th style={{textAlign:'right'}}>On hand</th><th>Shelf life</th><th>Barcode</th></tr></thead>
        <tbody>{comps.map((c,i)=>{const uc=unitCost(c.item,c.goods),ext=c.qty*uc,perish=c.goods==='Fresh';return (
          <tr key={i}><td>{c.item}</td><td><span className={'pill '+(perish?'p-info':'p-mut')}>{c.goods}</span></td><td style={{textAlign:'right'}}>{c.qty}</td><td style={{textAlign:'right'}}>{money(uc)}</td><td style={{textAlign:'right'}}>{money(ext)}</td><td style={{textAlign:'right'}}>{onHand(c.item).toLocaleString()}</td><td>{perish?<span className="pill p-warn">{5+hash(c.item)%6}d</span>:<span className="pill p-mut">—</span>}</td><td className="bc">{barcode(p.sku,i)}</td></tr>)})}
          <tr><td colSpan="4" style={{textAlign:'right',fontWeight:600}}>Sub total</td><td style={{textAlign:'right',fontWeight:600}}>{money(sub)}</td><td colSpan="3"></td></tr>
        </tbody></table>
      </div>
    </div>
  )
}
