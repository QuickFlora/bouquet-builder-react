import { useState } from 'react'
import { recipeId, defTime, recipeCosts, money } from './helpers.js'
import { PRICE_MARKUP } from './data.js'
const CLASSES=['Bouquet','Table Arrangement','DIY Box']
export default function Catalog({products,open,create}){
  const [vw,setVw]=useState('gallery')
  const [cls,setCls]=useState('Bouquet')
  const [f,setF]=useState({rid:'',item:'',price:'',cls:''})
  const count=c=>products.filter(p=>p.cls===c).length
  const items=products.filter(p=>p.cls===cls)
  const listed=products.filter(p=>{
    if(f.cls&&p.cls!==f.cls)return false
    if(f.item&&!p.sku.toLowerCase().includes(f.item.toLowerCase())&&!p.name.toLowerCase().includes(f.item.toLowerCase()))return false
    if(f.rid&&!recipeId(p.sku).toLowerCase().includes(f.rid.toLowerCase()))return false
    return true
  })
  return (
    <div className="wrap">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div><h1>Catalog &amp; recipes</h1><p className="sub">Three item classes. Open any product to edit its recipe worksheet &amp; BOM.</p></div>
        <button className="btn pri" onClick={create}><i className="ti ti-plus"></i> New recipe</button>
      </div>
      <div className="tabs">
        <span className={'tab'+(vw==='gallery'?' on':'')} onClick={()=>setVw('gallery')}>Gallery</span>
        <span className={'tab'+(vw==='list'?' on':'')} onClick={()=>setVw('list')}>Recipe list</span>
      </div>
      {vw==='gallery' ? (<>
        <div className="tabs">{CLASSES.map(c=>(<span key={c} className={'tab'+(cls===c?' on':'')} onClick={()=>setCls(c)}>{c}s <b style={{fontWeight:600}}>{count(c)}</b></span>))}</div>
        {items.length? (
          <div className="grid">{items.map(p=>(
            <figure key={p.sku} onClick={()=>open(p.sku)}>
              {p.src? <img loading="lazy" src={p.src} alt={p.name}/> : <div className="ph"><i className="ti ti-flower"></i></div>}
              <figcap><b>{p.name}</b><span>{p.sku} · {p.line}</span></figcap>
            </figure>))}</div>
        ) : <div style={{color:'var(--muted)',padding:20}}>No products in this class yet.</div>}
      </>) : (<>
        <div className="card" style={{padding:'14px 16px',marginBottom:14,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12}}>
          <div><label>Recipe ID</label><input value={f.rid} onChange={e=>setF({...f,rid:e.target.value})} placeholder="R-FLO-..."/></div>
          <div><label>Item ID</label><input value={f.item} onChange={e=>setF({...f,item:e.target.value})} placeholder="SF-B-001"/></div>
          <div><label>Class</label><select value={f.cls} onChange={e=>setF({...f,cls:e.target.value})}><option value="">Any</option>{CLASSES.map(c=><option key={c}>{c}</option>)}</select></div>
        </div>
        <div className="card" style={{padding:'6px 14px 4px'}}>
          <table><thead><tr><th>Recipe ID</th><th>Item</th><th>Class</th><th style={{textAlign:'right'}}>Items</th><th style={{textAlign:'right'}}>Total cost</th><th style={{textAlign:'right'}}>Total retail</th></tr></thead>
          <tbody>{listed.map(p=>{const c=recipeCosts(p,0,defTime(p,0),PRICE_MARKUP.Normal);return (
            <tr className="click" key={p.sku} onClick={()=>open(p.sku)}><td>{recipeId(p.sku)}</td><td>{p.name}</td><td>{p.cls}</td><td style={{textAlign:'right'}}>{c.items}</td><td style={{textAlign:'right'}}>{money(c.total)}</td><td style={{textAlign:'right'}}>{money(c.retail)}</td></tr>)})}
          </tbody></table>
        </div>
      </>)}
    </div>
  )
}
