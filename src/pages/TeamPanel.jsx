import {useParams} from "react-router-dom"
import {useEffect,useState} from "react"

export default function TeamPanel(){

const {matchId,teamId} = useParams()

const [state,setState] = useState("")
const [time,setTime] = useState(0)
const [letters,setLetters] = useState([])
const [result,setResult] = useState(null)

const [word,setWord] = useState("")
const [used,setUsed] = useState([])

function pickLetter(l,i){

if(used.includes(i)) return

setWord(word+l)
setUsed([...used,i])

}

function removeLast(){

if(word.length===0) return

const newUsed=[...used]
newUsed.pop()

setUsed(newUsed)
setWord(word.slice(0,-1))

}

function submit(){

fetch("/team/game1/answer",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
matchId:parseInt(matchId),
teamId:parseInt(teamId),
word
})
})

}

useEffect(()=>{

const interval=setInterval(()=>{

fetch(`/team/game1/state/${matchId}`)
.then(r=>r.json())
.then(data=>{

if(!data.state) return

setState(data.state)
setTime(data.time||0)

if(data.letters) setLetters(data.letters)

if(data.result) setResult(data.result)

})

},1000)

return ()=>clearInterval(interval)

},[matchId])

if(state==="COUNTDOWN"){

return(
<div>

<h2>Počinje za</h2>
<h1>{time}</h1>

</div>
)

}

if(state==="PLAYING"){

return(
<div>

<h2>Vrijeme: {time}</h2>

<div style={{margin:"20px"}}>

{letters.map((l,i)=>(
<button
key={i}
disabled={used.includes(i)}
onClick={()=>pickLetter(l,i)}
>
{l}
</button>
))}

</div>

<h2>{word}</h2>

<button onClick={removeLast}>Obriši</button>
<button onClick={submit}>Potvrdi</button>

</div>
)

}

if(state==="RESULT"){

return(
<div>

<h2>Rezultat</h2>

<pre>
{JSON.stringify(result,null,2)}
</pre>

<h3>Nastavak za {time}</h3>

</div>
)

}

if(state==="FINISHED"){

return(
<div>

<h2>Meč završen</h2>

</div>
)

}

return <div>Učitavanje...</div>

}