const NAV=[
  ['dashboard','ti-layout-dashboard','Dashboard','ops'],
  ['orders','ti-clipboard-list','Orders','ops'],
  ['buy','ti-shopping-cart','Buy lists','ops'],
  ['receiving','ti-package-import','Receiving','ops'],
  ['production','ti-tools','Production','ops'],
  ['pack','ti-package','Pack & ship','ops'],
  ['deliveries','ti-truck-delivery','Deliveries','ops'],
  ['florabot','ti-robot','FloraBot','ops'],
  ['catalog','ti-list-details','Catalog & recipes','setup'],
  ['inventory','ti-building-warehouse','Inventory','setup'],
]
export default function Sidebar({view,go}){
  const cur = view.name==='recipe'||view.name==='editor' ? 'catalog' : view.name
  return (
    <aside>
      <div className="brand"><i className="ti ti-flower"></i><b>Bouquet Builder</b></div>
      <div className="sec">Operations</div>
      {NAV.filter(n=>n[3]==='ops').map(n=>(
        <div key={n[0]} className={'nav'+(cur===n[0]?' on':'')} onClick={()=>go(n[0])}><i className={'ti '+n[1]}></i> {n[2]}</div>
      ))}
      <div className="sec">Setup</div>
      {NAV.filter(n=>n[3]==='setup').map(n=>(
        <div key={n[0]} className={'nav'+(cur===n[0]?' on':'')} onClick={()=>go(n[0])}><i className={'ti '+n[1]}></i> {n[2]}</div>
      ))}
      <div className="grow"></div>
      <div className={'nav'+(cur==='settings'?' on':'')} onClick={()=>go('settings')}><i className="ti ti-settings"></i> Settings</div>
    </aside>
  )
}
