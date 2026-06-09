import { OPS } from './data.js'
const P=(t,c)=><span className={'pill p-'+c}>{t}</span>
function Table({headers,rows,right=[]}){
  return (<div className="card" style={{padding:'6px 14px 4px',overflowX:'auto'}}>
    <table><thead><tr>{headers.map((h,i)=><th key={i} style={right.includes(i)?{textAlign:'right'}:{}}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((r,ri)=><tr key={ri}>{r.map((c,ci)=><td key={ci} style={right.includes(ci)?{textAlign:'right'}:{}}>{c}</td>)}</tr>)}</tbody></table></div>)
}
function Screen({title,sub,children}){return <div className="wrap"><h1>{title}</h1><p className="sub">{sub}</p>{children}</div>}
export function Orders(){const rows=OPS.orders.map(o=>[o[0],o[1],o[2],o[3],o[4],o[5],P(o[6],o[7]),o[8]])
  return <Screen title="Orders" sub="Order list — mirrors OrderHeader / OrderDetail."><Table headers={['Order #','Customer','Bouquet / item','Qty','Order date','Required','Status','Total']} rows={rows} right={[3,7]}/></Screen>}
export function Buy(){const rows=OPS.buy.map(o=>[o[0],o[1],o[2],o[3],o[4],P(o[5],o[6]),o[7]])
  return <Screen title="Buy lists" sub="Purchase order list — mirrors PO_Requisition_Header / Details."><Table headers={['Req / PO #','Vendor (Farm)','Ship-to','Ship date','Arrive date','Status','Total']} rows={rows} right={[6]}/></Screen>}
export function Receiving(){const rows=OPS.recv.map(o=>[o[0],o[1],o[2],o[3],o[4],o[5],o[6],P(o[7],o[8])])
  return <Screen title="Receiving" sub="Goods receipt — mirrors PurchaseReceiptDetail. Lot & expiry captured on arrival."><Table headers={['PO #','Vendor','Item','Ordered','Received','Lot','Expires','Status']} rows={rows} right={[3,4]}/></Screen>}
const PICK=[
 {no:'CR-100412',seq:1,date:'Jun 12',type:'Delivery',cust:'C-2031',ship:'M. Alvarez',stat:['In progress','info'],items:[
   ['Red Rose 50cm',24,24,'A-12','M. Reyes',['Picked','ok']],
   ['Eucalyptus',12,8,'B-04','M. Reyes',['Short','warn']],
   ['Glass vase + sleeve',1,0,'H-21','—',['Pending','mut']]]},
 {no:'CR-100408',seq:2,date:'Jun 12',type:'Pickup',cust:'C-1884',ship:'FloraMart',stat:['Not started','mut'],items:[
   ['White Lily 2-bloom',18,0,'A-22','—',['Pending','mut']],
   ['Hypericum',10,0,'B-09','—',['Pending','mut']]]},
 {no:'CR-100401',seq:3,date:'Jun 11',type:'Delivery',cust:'C-2204',ship:'Whole Foods · Denver',stat:['Picked','ok'],items:[
   ['Sweetheart Rose',30,30,'A-15','J. Patel',['Picked','ok']],
   ['Scabiosa',12,12,'C-02','J. Patel',['Picked','ok']]]},
]
export function Production(){return (<div className="wrap">
  <h1>Advance Pick Status</h1>
  <p className="sub">Pick screen — mirrors QuickFlora POS PickScreenNew (order master + line-item pick grid). Sample data.</p>
  <div className="card" style={{padding:'14px 16px',marginBottom:14,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:12}}>
    <div><label>Delivery date</label><input type="date" defaultValue="2026-06-12"/></div>
    <div><label>Location</label><select defaultValue="Berkeley Florist Supply"><option>All locations</option><option>Berkeley Florist Supply</option></select></div>
    <div><label>Status</label><select><option>All</option><option>Not started</option><option>In progress</option><option>Picked</option></select></div>
  </div>
  {PICK.map(o=>(
    <div className="card" key={o.no} style={{marginBottom:14}}>
      <div style={{display:'flex',alignItems:'center',gap:14,padding:'12px 16px',borderBottom:'1px solid var(--line)',flexWrap:'wrap'}}>
        <button className="btn pri" style={{padding:'6px 14px'}}>Start</button>
        <div><div style={{fontWeight:600}}>{o.no} <span style={{color:'var(--faint)',fontWeight:400,fontSize:12}}>· SEQ {o.seq}</span></div>
          <div style={{fontSize:12,color:'var(--muted)'}}>{o.date} · {o.type} · Cust {o.cust} · {o.ship}</div></div>
        <span className={'pill p-'+o.stat[1]} style={{marginLeft:'auto'}}>{o.stat[0]}</span>
      </div>
      <div style={{padding:'4px 16px 8px',overflowX:'auto'}}>
        <table><thead><tr><th>Item</th><th style={{textAlign:'right'}}>Qty</th><th style={{textAlign:'right'}}>Picked</th><th>Bin</th><th>Picker</th><th>Status</th></tr></thead>
        <tbody>{o.items.map((it,i)=>(<tr key={i}><td>{it[0]}</td><td style={{textAlign:'right'}}>{it[1]}</td><td style={{textAlign:'right'}}>{it[2]}</td><td>{it[3]}</td><td style={{color:'var(--muted)'}}>{it[4]}</td><td>{P(it[5][0],it[5][1])}</td></tr>))}</tbody></table>
      </div>
    </div>))}
  </div>)}
export function Pack(){const rows=OPS.pack.map(o=>[o[0],o[1],o[2],o[3],o[4],o[5],P(o[6],o[7])])
  return <Screen title="Pack & ship" sub="Barcode finished units, pack cartons, hand to the delivery manager."><Table headers={['Order','Destination','Mode','Carrier','Scheduled','Cartons','Status']} rows={rows} right={[5]}/></Screen>}
const DELY=[
 ['CR-100412','M. Alvarez','1450 Pine St, Denver CO','80203','Z-3','Jun 12','9–12','R-2','J. Patel','Truck',true,['Out for delivery','info']],
 ['CR-100408','FloraMart','77 Market Ave, Denver CO','80205','Z-3','Jun 12','12–3','R-2','J. Patel','Pickup',true,['Staged','warn']],
 ['CR-100401','Whole Foods','3600 Colorado Blvd, Denver','80206','Z-4','Jun 11','8–11','R-5','A. Cruz','Truck',true,['Delivered','ok']],
 ['CR-100396','Kroger DC','990 Cargo Rd, DFW','75261','Z-9','Jun 11','—','Air','DAL Air','Air cargo',true,['In transit','info']],
 ['CR-100390','Mia Events','22 Brickell Key, Miami','33131','Z-1','Jun 10','2–5','R-1','L. Ortiz','Truck',false,['Address hold','warn']],
 ['CR-100385','Local studio','510 NW 7th Ave, Miami','33136','Z-1','Jun 10','—','—','Pickup','Pickup',true,['Picked up','ok']],
]
export function Deliveries(){return (<div className="wrap">
  <h1>Delivery Manager</h1>
  <p className="sub">Mirrors QuickFlora POS DeliveryManagerDetails — route, driver, address verification &amp; status. Sample data.</p>
  <div className="card" style={{padding:'14px 16px',marginBottom:14,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12}}>
    <div><label>Delivery date</label><input type="date" defaultValue="2026-06-12"/></div>
    <div><label>Route</label><select><option>All routes</option><option>R-1</option><option>R-2</option><option>R-5</option></select></div>
    <div><label>Driver</label><select><option>All drivers</option><option>J. Patel</option><option>A. Cruz</option><option>L. Ortiz</option></select></div>
    <div><label>Status</label><select><option>All</option><option>Staged</option><option>Out for delivery</option><option>Delivered</option></select></div>
  </div>
  <div className="card" style={{padding:'4px 14px 8px',overflowX:'auto'}}>
    <table style={{minWidth:1000}}><thead><tr><th>Order</th><th>Recipient</th><th>Address</th><th>Zip</th><th>Zone</th><th>Date</th><th>Window</th><th>Route</th><th>Driver</th><th>Method</th><th>Verified</th><th>Status</th></tr></thead>
    <tbody>{DELY.map((d,i)=>(<tr key={i}><td style={{fontWeight:500}}>{d[0]}</td><td>{d[1]}</td><td style={{color:'var(--muted)'}}>{d[2]}</td><td>{d[3]}</td><td>{d[4]}</td><td>{d[5]}</td><td>{d[6]}</td><td>{d[7]}</td><td>{d[8]}</td><td>{d[9]}</td><td>{d[10]?P('Yes','ok'):P('No','warn')}</td><td>{P(d[11][0],d[11][1])}</td></tr>))}</tbody></table>
  </div>
  </div>)}
export function Settings(){return <Screen title="Settings" sub="Demo settings placeholder."><div className="card" style={{padding:18,color:'var(--muted)'}}>Locations, work centers, labor rates, barcode formats.</div></Screen>}
