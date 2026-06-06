import { COST, PRICE_MARKUP } from './data.js'
export const LABOR_RATE = 18.0
export const DEF_FRESH = 0.75, DEF_HARD = 1.50
export const money = n => '$' + Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})
export function hash(s){let h=0;for(const c of String(s))h=(h*131+c.charCodeAt(0))&0xffffffff;return h>>>0}
export const unitCost = (n,g)=> COST[n]!=null ? COST[n] : (g==='Hard'?DEF_HARD:DEF_FRESH)
export const onHand = n => 50 + hash(n)%950
export const barcode = (s,l)=> ('8'+(hash(s+l)%1000000000000).toString().padStart(12,'0')).slice(0,13)
export const recipeId = s => 'R-FLO-'+(4000+hash(s)%5999)
export function components(p, si=0){
  if(p.lines) return p.lines.map(l=>({item:l.item,qty:Number(l.qty)||0,goods:l.goods||'Fresh'}))
  if(p.cls==='Table Arrangement'){
    const o=[]; Object.entries(p.fresh||{}).forEach(([k,v])=>o.push({item:k,qty:Number(v)||1,goods:'Fresh'}))
    Object.entries(p.hard||{}).forEach(([k,v])=>o.push({item:k,qty:Number(v)||1,goods:'Hard'})); return o
  }
  return Object.entries(p.recipe||{}).map(([k,q])=>({item:k,qty:Array.isArray(q)?q[si]:q,goods:'Fresh'}))
}
export function defTime(p, si=0){let n=0;components(p,si).forEach(x=>n+=x.qty);return Math.max(8,Math.round(n*0.7))}
export function recipeCosts(p, si, time, markup){
  const c=components(p,si); let sub=0,items=0; c.forEach(x=>{sub+=x.qty*unitCost(x.item,x.goods);items+=x.qty})
  const labor=time/60*LABOR_RATE, total=sub+labor, mt=total*markup/100
  return {items,sub,labor,total,mt,retail:total+mt}
}
// localStorage CRUD store
const KEY='bbStore'
export function loadStore(){try{return JSON.parse(localStorage.getItem(KEY))||{added:{},edited:{},deleted:[]}}catch(e){return {added:{},edited:{},deleted:[]}}}
export function saveStore(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
export function effective(base, store){
  const out=base.filter(p=>!store.deleted.includes(p.sku)).map(p=>store.edited[p.sku]?{...p,...store.edited[p.sku]}:p)
  Object.values(store.added).forEach(p=>out.push(p)); return out
}
export function genSQL(p){
  const aid=p.sku, stems=p.lines.reduce((a,l)=>a+(Number(l.qty)||0),0), lc=(p.time/60*p.rate).toFixed(2)
  let s=`-- InventoryAssemblies (recipe header)\nINSERT INTO InventoryAssemblies (CompanyID,DivisionID,DepartmentID,AssemblyID,ItemID,NumberOfItemsInAssembly,LaborCost,Description)\nVALUES ('BFS','01','01','${aid}','${p.sku}',${stems},${lc},'${(p.name||'').replace(/'/g,"''")}');\n\n-- InventoryAssemblyDetail (BOM lines)\n`
  p.lines.forEach((l,i)=>{s+=`INSERT INTO InventoryAssemblyDetail (CompanyID,DivisionID,DepartmentID,AssemblyID,ItemID,Qty,PriceType,RowID)\n  VALUES ('BFS','01','01','${aid}','${(l.item||'').replace(/'/g,"''")}',${Number(l.qty)||0},'${p.price||'Normal'}',${i+1});\n`})
  return s
}
