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
export function Production(){const rows=OPS.prod.map(o=>[o[0],o[1],o[2],o[3],o[4],P(o[5],o[6]),P(o[7],o[8]),o[9]])
  return <Screen title="Production" sub="Pick / assembly screen — mirrors OrderDetailItemIDAssignedtoPicked."><Table headers={['Order','Line','Item','Assigned to','Qty','Started','Complete','Done qty']} rows={rows} right={[4,7]}/></Screen>}
export function Pack(){const rows=OPS.pack.map(o=>[o[0],o[1],o[2],o[3],o[4],o[5],P(o[6],o[7])])
  return <Screen title="Pack & ship" sub="Delivery manager — schedule truck, air cargo, or pickup."><Table headers={['Order','Destination','Mode','Carrier','Scheduled','Cartons','Status']} rows={rows} right={[5]}/></Screen>}
export function Deliveries(){const rows=OPS.deliv.map(o=>[o[0],o[1],o[2],o[3],o[4],P(o[5],o[6])])
  return <Screen title="Deliveries" sub="Proof of delivery — mirrors MarkOrderDelivered_Log."><Table headers={['Order','Destination','Mode','Delivered','Signed by','Status']} rows={rows}/></Screen>}
export function Settings(){return <Screen title="Settings" sub="Demo settings placeholder."><div className="card" style={{padding:18,color:'var(--muted)'}}>Locations, work centers, labor rates, barcode formats.</div></Screen>}
