import { useState } from 'react'
import { COST, PRICE_MARKUP } from './data.js'
import { components, defTime, unitCost, money, genSQL, LABOR_RATE } from './helpers.js'
const CLASSES=['Bouquet','Table Arrangement','DIY Box']
export default function RecipeEditor({product,base,store,onSave,onDelete,back}){
  const isNew=!product
  const init = isNew ? {cls:'Bouquet',sku:'',name:'',line:'Custom',price:'Normal',desc:'',instr:'Cut stems at 45°, condition 2 hrs.',time:10,rate:LABOR_RATE,markup:100,lines:[{item:'',qty:1,goods:'Fresh'}]}
    : {cls:product.cls,sku:product.sku,name:product.name,line:product.line,price:product.priceType||'Normal',desc:product.desc||(product.name+' — '+product.line),instr:product.instr||'Cut stems at 45°, condition 2 hrs.',time:product.time||defTime(product,0),rate:product.rate||LABOR_RATE,markup:product.markup||100,lines:components(product,0).map(c=>({item:c.item,qty:c.qty,goods:c.goods}))}
  const [e,setE]=useState(init)
  const [sql,setSql]=useState(null)
  const set=(k,v)=>setE(s=>({...s,[k]:v}))
  const setLine=(i,k,v)=>setE(s=>{const lines=s.lines.map((l,idx)=>idx===i?{...l,[k]:v}:l);return {...s,lines}})
  const addLine=()=>setE(s=>({...s,lines:[...s.lines,{item:'',qty:1,goods:'Fresh'}]}))
  const rmLine=i=>setE(s=>({...s,lines:s.lines.filter((_,idx)=>idx!==i)}))
  let sub=0,items=0; e.lines.forEach(l=>{sub+=(Number(l.qty)||0)*unitCost(l.item,l.goods);items+=Number(l.qty)||0})
  const labor=e.time/60*e.rate, total=sub+labor, mt=total*e.markup/100, retail=total+mt
  function save(){
    if(!e.name)return alert('Enter a name')
    if(e.lines.filter(l=>l.item).length===0)return alert('Add at least one component')
    let sku=e.sku
    if(isNew&&!sku){const n=base.length+Object.keys(store.added).length+1;sku=(e.cls==='Bouquet'?'SF-N-':e.cls==='Table Arrangement'?'TA-N-':'DIY-N-')+String(n).padStart(3,'0')}
    const prod={cls:e.cls,sku,name:e.name,line:e.line,img:'',src:'',custom:true,lines:e.lines.filter(l=>l.item),priceType:e.price,price:e.price,desc:e.desc,instr:e.instr,time:e.time,rate:e.rate,markup:e.markup,sizes:['std']}
    onSave(prod,isNew); setSql(genSQL(prod))
  }
  return (
    <div className="wrap">
      <div className="crumb" style={{marginBottom:8,cursor:'pointer'}} onClick={back}><i className="ti ti-arrow-left"></i> Back to catalog</div>
      <h1 style={{margin:'0 0 14px'}}>{isNew?'New recipe':'Edit recipe'}</h1>
      <div className="card" style={{padding:'18px 20px',marginBottom:16}}>
        <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:24}}>
          <div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="fg"><label>Item class</label><select value={e.cls} onChange={v=>set('cls',v.target.value)}>{CLASSES.map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="fg"><label>Item ID / SKU</label><input value={e.sku} placeholder={isNew?'auto-generated':''} readOnly={!isNew} onChange={v=>set('sku',v.target.value)}/></div>
              <div className="fg"><label>Name</label><input value={e.name} onChange={v=>set('name',v.target.value)}/></div>
              <div className="fg"><label>Line / Season</label><input value={e.line} onChange={v=>set('line',v.target.value)}/></div>
              <div className="fg"><label>Price type</label><select value={e.price} onChange={v=>set('price',v.target.value)}>{Object.keys(PRICE_MARKUP).map(k=><option key={k}>{k}</option>)}</select></div>
              <div className="fg"><label>COGS account</label><input value="5000 · COGS – Floral" readOnly/></div>
            </div>
            <div className="fg"><label>Description</label><input value={e.desc} onChange={v=>set('desc',v.target.value)}/></div>
            <div className="fg"><label>Instructions</label><textarea rows="2" value={e.instr} onChange={v=>set('instr',v.target.value)}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
              <div className="fg"><label>Recipe time (min)</label><input type="number" value={e.time} onChange={v=>set('time',+v.target.value)}/></div>
              <div className="fg"><label>Labor rate ($/hr)</label><input type="number" value={e.rate} onChange={v=>set('rate',+v.target.value)}/></div>
              <div className="fg"><label>Markup (%)</label><input type="number" value={e.markup} onChange={v=>set('markup',+v.target.value)}/></div>
            </div>
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
      <div className="card" style={{padding:'18px 20px',marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><div style={{fontWeight:600}}>Bill of materials</div><button className="btn" onClick={addLine}><i className="ti ti-plus"></i> Add component</button></div>
        <datalist id="compList">{Object.keys(COST).map(k=><option key={k} value={k}/>)}</datalist>
        <table><thead><tr><th>Item</th><th style={{width:110}}>Type</th><th style={{textAlign:'right',width:90}}>Qty</th><th style={{textAlign:'right'}}>Unit</th><th style={{textAlign:'right'}}>Ext</th><th style={{width:36}}></th></tr></thead>
        <tbody>{e.lines.map((l,i)=>{const uc=unitCost(l.item,l.goods),ext=(Number(l.qty)||0)*uc;return (
          <tr key={i}><td><input list="compList" value={l.item} placeholder="Component / item" onChange={v=>setLine(i,'item',v.target.value)}/></td>
          <td><select value={l.goods} onChange={v=>setLine(i,'goods',v.target.value)}><option>Fresh</option><option>Hard</option></select></td>
          <td><input type="number" value={l.qty} style={{textAlign:'right'}} onChange={v=>setLine(i,'qty',+v.target.value)}/></td>
          <td style={{textAlign:'right'}}>{money(uc)}</td><td style={{textAlign:'right'}}>{money(ext)}</td>
          <td style={{textAlign:'center'}}><span style={{cursor:'pointer',color:'var(--faint)'}} onClick={()=>rmLine(i)}><i className="ti ti-x"></i></span></td></tr>)})}
        </tbody></table>
      </div>
      <div style={{display:'flex',gap:10}}>
        <button className="btn pri" onClick={save}><i className="ti ti-device-floppy"></i> Save {isNew?'recipe':'changes'}</button>
        {!isNew && <button className="btn" onClick={()=>{if(confirm('Delete this recipe?'))onDelete(e.sku)}}><i className="ti ti-trash"></i> Delete</button>}
        <button className="btn" onClick={back}>Cancel</button>
      </div>
      {sql && <div className="ov" onClick={ev=>{if(ev.target.className==='ov')setSql(null)}}>
        <div className="card" style={{maxWidth:700,width:'100%',padding:'18px 20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><b>Generated SQL — InventoryAssemblies / InventoryAssemblyDetail</b><span style={{cursor:'pointer',color:'var(--faint)'}} onClick={()=>setSql(null)}><i className="ti ti-x"></i></span></div>
          <textarea readOnly style={{height:300,fontFamily:'ui-monospace,monospace',fontSize:12}} value={sql}/>
          <div style={{marginTop:10,fontSize:12,color:'var(--muted)'}}>In production the app's API runs this against the Enterprise DB. This demo persists changes in your browser.</div>
        </div>
      </div>}
    </div>
  )
}
