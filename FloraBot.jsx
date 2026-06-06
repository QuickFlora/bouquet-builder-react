import html from './florabot.html?raw'
export default function FloraBot(){
  return (
    <div style={{height:'calc(100vh - 53px)',width:'100%'}}>
      <iframe title="FloraBot" srcDoc={html} style={{width:'100%',height:'100%',border:'none',display:'block'}}/>
    </div>
  )
}
