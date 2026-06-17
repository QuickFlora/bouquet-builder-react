import { useState } from 'react'
import { INVENTORY } from './data.js'
const FILTERS=[['all','Show all'],['back','Only back order'],['over','Only over sold'],['hand','Only on hand'],['avail','Only available for sale']]
export default function Inventory(){
  const [filter,setFilter]=useState('all')
  const [q,setQ]=useState('')
  const [page,setPage]=useState(1); const per=12
  const all=INVENTORY.filter(r=>{
    if(q&&!r[0].toLowerCase().includes(q.toLowerCase())&&!(r[1]||'').toLowerCase().includes(q.toLowerCase()))return false
    if(filter==='back')return r[8]>0; if(filter==='over')return r[7]>0; if(filter==='hand')return r[4]>0; if(filter==='avail')return r[9]>0; return true
  })
  const pages=Math.max(1,Math.ceil(all.length/per)); const pg=Math.min(page,pages)
  const rows=all.slice((pg-1)*per,pg*per)
  const num=(v,w)=> <td style={{textAlign:'right',...(w&&v>0?{color:'var(--warn)',fontWeight:600}:{})}}>{v}</td>
  return (
    <div className="wrap">
      <h1>Inventory status</h1><p className="sub">Live availability by item and location — replicated from the POS page (InventoryByWarehouse).</p>
      <div className="card" style={{padding:'14px 16px',marginBottom:14}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:12}}>
          <div><label>Delivery date</label><input type="date" defaultValue="2026-06-17"/></div>
          <div><label>Location / Farm</label><select defaultValue="Berkeley Florist Supply"><option>All locations</option><option>Berkeley Florist Supply</option></select></div>
          <div><label>Item search</label><input value={q} onChange={e=>{setQ(e.target.value);setPage(1)}} placeholder="Item ID or name"/></div>
        </div>
        <label>Select availability</label>
        <div className="tabs" style={{marginTop:4,marginBottom:0}}>{FILTERS.map(f=>(<span key={f[0]} className={'tab'+(filter===f[0]?' on':'')} onClick={()=>{setFilter(f[0]);setPage(1)}}>{f[1]}</span>))}</div>
      </div>
      <div className="card" style={{padding:'4px 14px 8px',overflowX:'auto'}}>
        <table style={{minWidth:940}}><thead><tr><th>Item ID</th><th>Item name</th><th>Location ID</th><th style={{textAlign:'right'}}>Qty ordered</th><th style={{textAlign:'right'}}>On hand</th><th style={{textAlign:'right'}}>Assigned</th><th style={{textAlign:'right'}}>To receive</th><th style={{textAlign:'right'}}>Over sold</th><th style={{textAlign:'right'}}>Back order</th><th style={{textAlign:'right'}}>Avail for sale</th></tr></thead>
        <tbody>{rows.length?rows.map((r,i)=>(<tr key={i}><td style={{fontWeight:500}}>{r[0]}</td><td>{r[1]||<span style={{color:'var(--faint)'}}>—</span>}</td><td>{r[2]}</td>{num(r[3])}{num(r[4])}{num(r[5])}{num(r[6])}{num(r[7],true)}{num(r[8],true)}<td style={{textAlign:'right',fontWeight:600,color:r[9]>0?'var(--ok)':'var(--faint)'}}>{r[9]}</td></tr>)):<tr><td colSpan="10" style={{color:'var(--muted)'}}>No items match.</td></tr>}</tbody></table>
        <div style={{display:'flex',gap:6,alignItems:'center',padding:'10px 6px',color:'var(--muted)',fontSize:13}}>
          {Array.from({length:pages},(_,i)=>i+1).map(i=>(<span key={i} style={{cursor:'pointer',padding:'3px 9px',borderRadius:6,...(i===pg?{background:'var(--info-bg)',color:'var(--info)'}:{})}} onClick={()=>setPage(i)}>{i}</span>))}
          <span style={{marginLeft:'auto'}}>{all.length} items</span>
        </div>
      </div>
    </div>
  )
}
