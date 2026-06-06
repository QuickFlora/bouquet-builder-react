import { useState, useMemo, useEffect } from 'react'
import { PRODUCTS as BASE } from './data.js'
import { loadStore, saveStore, effective } from './helpers.js'
import Sidebar from './Sidebar.jsx'
import Dashboard from './Dashboard.jsx'
import Catalog from './Catalog.jsx'
import RecipeView from './RecipeView.jsx'
import RecipeEditor from './RecipeEditor.jsx'
import Inventory from './Inventory.jsx'
import FloraBot from './FloraBot.jsx'
import { Orders, Buy, Receiving, Production, Pack, Deliveries, Settings } from './Ops.jsx'

const TITLES={dashboard:'Dashboard',florabot:'FloraBot',orders:'Orders',buy:'Buy lists',receiving:'Receiving',production:'Production',pack:'Pack & ship',deliveries:'Deliveries',catalog:'Catalog & recipes',inventory:'Inventory status',settings:'Settings',recipe:'Recipe',editor:'Recipe editor'}

export default function App(){
  const [store,setStore]=useState(loadStore())
  const [view,setView]=useState({name:'catalog'})
  const [toast,setToast]=useState('')
  const products=useMemo(()=>effective(BASE,store),[store])
  useEffect(()=>{saveStore(store)},[store])
  function flash(m){setToast(m);setTimeout(()=>setToast(''),2200)}
  const go=(name,extra={})=>{setView({name,...extra});window.scrollTo(0,0)}

  function saveRecipe(prod,isNew){
    setStore(s=>{const n={...s,added:{...s.added},edited:{...s.edited}};
      if(isNew){n.added[prod.sku]=prod} else {if(n.added[prod.sku])n.added[prod.sku]=prod;else n.edited[prod.sku]=prod}
      return n})
    flash(isNew?'Recipe created & saved':'Changes saved')
  }
  function deleteRecipe(sku){
    setStore(s=>{const n={...s,added:{...s.added},edited:{...s.edited},deleted:[...s.deleted]};
      if(n.added[sku])delete n.added[sku]; else {delete n.edited[sku]; if(!n.deleted.includes(sku))n.deleted.push(sku)}
      return n})
    flash('Recipe deleted'); go('catalog')
  }

  const crumb = (view.name==='recipe'||view.name==='editor')
    ? <span className="crumb"><span className="lk" onClick={()=>go('catalog')}>Catalog &amp; recipes</span> <i className="ti ti-chevron-right" style={{fontSize:11}}></i> <b>{TITLES[view.name]}</b></span>
    : <span className="crumb"><b>{TITLES[view.name]||''}</b></span>

  let screen=null
  if(view.name==='dashboard') screen=<Dashboard/>
  else if(view.name==='catalog') screen=<Catalog products={products} open={sku=>go('recipe',{sku})} create={()=>go('editor',{sku:null})}/>
  else if(view.name==='recipe') screen=<RecipeView product={products.find(p=>p.sku===view.sku)} onEdit={()=>go('editor',{sku:view.sku})} onDelete={deleteRecipe} back={()=>go('catalog')}/>
  else if(view.name==='editor') screen=<RecipeEditor product={view.sku?products.find(p=>p.sku===view.sku):null} base={BASE} store={store} onSave={saveRecipe} onDelete={deleteRecipe} back={()=>go('catalog')}/>
  else if(view.name==='florabot') screen=<FloraBot/>
  else if(view.name==='inventory') screen=<Inventory/>
  else if(view.name==='orders') screen=<Orders/>
  else if(view.name==='buy') screen=<Buy/>
  else if(view.name==='receiving') screen=<Receiving/>
  else if(view.name==='production') screen=<Production/>
  else if(view.name==='pack') screen=<Pack/>
  else if(view.name==='deliveries') screen=<Deliveries/>
  else if(view.name==='settings') screen=<Settings/>

  return (
    <div className="app">
      <Sidebar view={view} go={go}/>
      <main>
        <div className="top">{crumb}<div className="grow"></div><div className="search"><i className="ti ti-search"></i> Search</div><div className="ava">AF</div></div>
        {screen}
        <div style={{padding:'14px 26px',color:'var(--faint)',fontSize:12}}>Bouquet Builder — React app for QuickFlora · screens mirror the existing Florica POS pages &amp; tables</div>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
