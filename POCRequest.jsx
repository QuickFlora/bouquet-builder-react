import html from './poc.html?raw'
export default function POCRequest(){
  return (
    <div style={{height:'calc(100vh - 53px)',width:'100%'}}>
      <iframe title="POC Request" srcDoc={html} style={{width:'100%',height:'100%',border:'none',display:'block'}}/>
    </div>
  )
}
