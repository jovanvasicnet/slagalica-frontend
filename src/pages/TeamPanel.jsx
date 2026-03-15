import { useEffect, useState } from "react"

function TeamPanel(){

const teamId = Number(localStorage.getItem("teamId"))
 const leader = localStorage.getItem("leader") === "true"

 const [match,setMatch] = useState(null)
 const [countdown,setCountdown] = useState(null)

 const [suggestion,setSuggestion] = useState("")
 const [suggestions,setSuggestions] = useState([])

 const [letters,setLetters] = useState([])
 const [used,setUsed] = useState([])

 const [answer,setAnswer] = useState("")
 const [timer,setTimer] = useState(60)

 const [result,setResult] = useState(null)

 const [socket,setSocket] = useState(null)

const isTeam1 = match && Number(teamId) === match.t1id

const myWord = isTeam1 ? result?.team1Word : result?.team2Word
const oppWord = isTeam1 ? result?.team2Word : result?.team1Word

const myPoints = isTeam1 ? result?.team1Points : result?.team2Points
const oppPoints = isTeam1 ? result?.team2Points : result?.team1Points

 // MATCH STATUS
 useEffect(()=>{

  const interval = setInterval(()=>{

   fetch("https://slagalica-1-we7s.onrender.com/team/match-status/"+teamId)
   .then(res=>res.json())
   .then(data=>{

    setMatch(data)

    if(data.startTime){

     const start = new Date(data.startTime).getTime()
     const now = new Date().getTime()

     const diff = Math.floor((start-now)/1000)

     if(diff > 0){
      setCountdown(diff)
     }else{
      setCountdown(0)
     }

    }

   })

  },1000)

  return ()=>clearInterval(interval)

 },[teamId])



 // WEBSOCKET
 useEffect(()=>{

  const ws = new WebSocket(
   "wss://slagalica-1-we7s.onrender.com/suggestions?teamId="+teamId
  )

  ws.onmessage = (event)=>{
   setSuggestions(prev=>[...prev,event.data])
  }

  setSocket(ws)

  return ()=>ws.close()

 },[teamId])



 // UCITAJ IGRA
 useEffect(()=>{

  if(countdown === 0 && match && letters.length === 0){

   fetch("https://slagalica-1-we7s.onrender.com/team/game1/"+match.matchId)
   .then(res=>res.json())
   .then(data=>{
    setLetters(data.letters)
   })

  }

 },[countdown,match])



 // TIMER
 useEffect(()=>{

 if(countdown === 0 && match){

  const interval = setInterval(()=>{

   fetch("https://slagalica-1-we7s.onrender.com/team/game1/"+match.matchId)
   .then(res=>res.json())
   .then(game=>{

     const start = game.startTime
     const now = Date.now()

     const remaining = 60 - Math.floor((now-start)/1000)

     if(remaining <= 0){

        setTimer(0)

        fetch("https://slagalica-1-we7s.onrender.com/team/game1/result/"+match.matchId)
        .then(res=>res.json())
        .then(setResult)

     }else{

        setTimer(remaining)

     }

   })

  },1000)

  return ()=>clearInterval(interval)

 }

},[countdown])



 const clickLetter = (l,index)=>{

  if(used.includes(index)) return

  setUsed(prev=>[...prev,index])
  setAnswer(prev => prev + l)

 }



 const removeLast = ()=>{

  if(answer.length === 0) return

  const newUsed = [...used]
  newUsed.pop()

  setUsed(newUsed)
  setAnswer(prev=>prev.slice(0,-1))

 }



 const sendSuggestion = ()=>{

  if(!suggestion) return
  if(!socket) return

  socket.send(teamId + "|" + suggestion)

  setSuggestion("")

 }



 const submitAnswer = ()=>{
    console.log("SALJEM:", answer)

  fetch("https://slagalica-1-we7s.onrender.com/team/game1/answer",{
   method:"POST",
   headers:{
    "Content-Type":"application/json"
   },
   body:JSON.stringify({
    matchId:match.matchId,
    teamId:teamId,
    word:answer
   })
  })

 }



 if(!match){

  return(
   <div style={{textAlign:"center",marginTop:"100px"}}>
    <h1>Čeka se protivnik...</h1>
   </div>
  )

 }



 return(

  <div style={{textAlign:"center",marginTop:"100px"}}>

   <h1>{match.team}</h1>
   <h2>VS</h2>
   <h1>{match.opponent ? match.opponent : "BYE"}</h1>



   {countdown > 0 && (
    <h2>Početak igre za: {countdown}</h2>
   )}



   {countdown === 0 && (
    <h2>Vrijeme: {timer}</h2>
   )}



   <hr/>



   <input
    placeholder="Predloži riječ"
    value={suggestion}
    onChange={e=>setSuggestion(e.target.value)}
   />

   <button onClick={sendSuggestion}>
    Predloži
   </button>



   {leader && (

    <div style={{marginTop:"20px"}}>

     <h3>Prijedlozi tima</h3>

     {suggestions.map((s,i)=>(
      <div key={i}>{s}</div>
     ))}

    </div>

   )}



   {/* SLOVA */}

   {countdown === 0 && !result && (

    <div style={{
     display:"grid",
     gridTemplateColumns:"repeat(6,60px)",
     gap:"10px",
     justifyContent:"center",
     marginTop:"30px"
    }}>

     {letters.map((l,i)=>(

      <button
       key={i}
       onClick={()=>clickLetter(l,i)}
       disabled={used.includes(i)}
       style={{height:"60px",fontSize:"22px"}}
      >

       {l}

      </button>

     ))}

    </div>

   )}



   <h2>{answer}</h2>



   {!result && (

   <>

   <button onClick={removeLast}>
    Obriši
   </button>

   <button onClick={submitAnswer}>
    Potvrdi
   </button>

   </>

   )}



   {/* REZULTAT */}

   {result && (

    <div style={{marginTop:"40px"}}>

     <h2>Rezultat</h2>

     <p>Tvoja riječ: {myWord}</p>
    <p>Protivnik: {oppWord}</p>

    <h3>
    Poeni: {myPoints} - {oppPoints}
    </h3>

     <h2>Softverska riječ:</h2>
     <h1>{result.solution}</h1>

    </div>

   )}

  </div>

 )

}

export default TeamPanel