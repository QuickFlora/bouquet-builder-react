import { Chart, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { DASH } from './data.js'
import { hash } from './helpers.js'
Chart.register(BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Tooltip, Legend)

const PAL=['#D85A30','#185FA5','#1D9E75','#BA7517','#7F77DD','#2E5E3A']
const noAsp={responsive:true,maintainAspectRatio:false}

export default function Dashboard(){
  const d=DASH
  const aging={labels:d.ageLbl,datasets:[{data:d.ageVal,backgroundColor:'#2E5E3A',borderRadius:4}]}
  const box={labels:d.boxp.map(x=>x[0]),datasets:[{data:d.boxp.map(x=>x[1]),backgroundColor:PAL,borderColor:'#fff',borderWidth:1}]}
  const grower={labels:d.growers.map(g=>g[0]),datasets:[{data:d.growers.map(g=>g[1]),backgroundColor:['#D85A30','#BA7517','#185FA5'],borderRadius:4}]}
  const mix={labels:d.mixDates,datasets:d.vars.map((v,i)=>{const base=[520,360,240,180,300,260][i];return {label:v,data:d.mixDates.map((_,j)=>Math.round(base*(1-j*0.18)+hash(v+j)%40)),borderColor:PAL[i],backgroundColor:PAL[i],tension:.3,pointRadius:2}})}
  const pmax=Math.max(...d.perf.map(p=>p[2]))
  return (
    <div className="wrap">
      <h1>Flower Inventory Analytics</h1>
      <p className="sub">Real-time flower inventory management powered by FLORICA AI.</p>
      <div className="action-banner"><i className="ti ti-alert-triangle" style={{fontSize:17}}></i><div><b>Action required.</b> You have 2 expired items and 2 items expiring soon. Review and remove expired inventory to reduce waste.</div></div>
      <div className="kpis">{d.kpis.map((k,i)=>(<div className="kpi" key={i}><div className="l">{k[0]}</div><div className="v">{k[1]}</div><div className="s">{k[2]}</div></div>))}</div>
      <div className="dash2col">
        <div className="dcard"><h3>Inventory aging analysis</h3><div className="ch">Value distribution by days in inventory</div><div className="chartbox"><Bar data={aging} options={{...noAsp,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'$'+(v/1000)+'k'}}}}}/></div></div>
        <div className="dcard"><h3>Box count by product</h3><div className="ch">Physical inventory distribution</div><div className="chartbox"><Doughnut data={box} options={{...noAsp,plugins:{legend:{position:'right',labels:{boxWidth:11,font:{size:11}}}}}}/></div></div>
      </div>
      <div className="dash2col">
        <div className="dcard"><h3>Inventory by grower</h3><div className="ch">Value distribution across suppliers</div><div className="chartbox"><Bar data={grower} options={{...noAsp,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{callback:v=>'$'+(v/1000)+'k'}}}}}/></div></div>
        <div className="dcard"><h3>Product mix analysis</h3><div className="ch">Flower variety aging distribution by date</div><div className="chartbox"><Line data={mix} options={{...noAsp,plugins:{legend:{position:'bottom',labels:{boxWidth:10,font:{size:10}}}}}}/></div></div>
      </div>
      <div className="dcard"><h3>Grower details</h3><div className="ch">Complete supplier breakdown with 7-day aging</div>
        <div className="grower3">{d.growers.map(g=>{const mx=Math.max(...g[3]);return (
          <div key={g[0]} style={{border:'1px solid var(--line)',borderRadius:10,padding:'13px 15px'}}>
            <div style={{fontWeight:600}}>{g[0]}</div><div style={{fontSize:12,color:'var(--muted)'}}>{g[2].toLocaleString()} boxes</div>
            <div style={{fontSize:18,fontWeight:600,color:'var(--green)',margin:'2px 0 8px'}}>${g[1].toLocaleString()}</div>
            {g[3].map((b,i)=>(<div className="agerow" key={i}><span className="a">{i+1} Day</span><span className="mini"><i style={{width:Math.round(b/mx*100)+'%'}}></i></span><span className="n">{b} bx</span></div>))}
          </div>)})}</div>
      </div>
      <div className="dash2col">
        <div className="dcard"><h3>Product performance</h3><div className="ch">Top performing flower varieties</div>
          {d.perf.map(p=>(<div className="perf" key={p[0]}><span className="nm">{p[0]}</span><span className="bar mini"><i style={{width:Math.round(p[2]/pmax*100)+'%'}}></i></span><span className="vv">{p[1]}% · ${p[2].toLocaleString(undefined,{maximumFractionDigits:0})}</span></div>))}
        </div>
        <div className="dcard"><h3>Aging summary</h3><div className="ch">Inventory freshness metrics</div>
          <table><thead><tr><th>Age</th><th style={{textAlign:'right'}}>Boxes</th><th style={{textAlign:'right'}}>Value</th></tr></thead>
          <tbody>{d.ageLbl.map((a,i)=>(<tr key={a}><td>{a}</td><td style={{textAlign:'right'}}>{d.ageBox[i].toLocaleString()} boxes</td><td style={{textAlign:'right'}}>${d.ageVal[i].toLocaleString()}</td></tr>))}</tbody></table>
        </div>
      </div>
    </div>
  )
}
