import { useEffect, useState } from "react"

function TeamPanel(){

 const teamId = localStorage.getItem("teamId")
 const leader = localStorage.getItem("leader") === "true"

 const [match,setMatch] = useState(null)
 const [countdown,setCountdown] = useState(null)

 const [suggestion,setSuggestion] = useState("")
 const [suggestions,setSuggestions] = useState([])

 const [letters,setLetters] = useState([])
 const [answer,setAnswer] = useState("")
 const [timer,setTimer] = useState(60)

 const [socket,setSocket] = useState(null)



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



 // UCITAJ IGRA 1
 useEffect(()=>{

  if(countdown === 0 && match){

   fetch("https://slagalica-1-we7s.onrender.com/team/game1/"+match.matchId)
   .then(res=>res.json())
   .then(data=>{
    setLetters(data.letters)
   })

  }

 },[countdown,match])



 // TIMER 60 SEKUNDI
 useEffect(()=>{

  if(countdown === 0){

   const interval = setInterval(()=>{

    setTimer(t=>{
     if(t <= 1){
      clearInterval(interval)
      return 0
     }
     return t-1
    })

   },1000)

  }

 },[countdown])



 const clickLetter = (l)=>{
  setAnswer(prev => prev + l)
 }



 const sendSuggestion = ()=>{

  if(!suggestion) return
  if(!socket) return

  socket.send(teamId + "|" + suggestion)

  setSuggestion("")
 }



 const submitAnswer = ()=>{

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

   {/* prijedlozi */}

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

   {countdown === 0 && (

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
       onClick={()=>clickLetter(l)}
       style={{height:"60px",fontSize:"22px"}}
      >

       {l}

      </button>

     ))}

    </div>

   )}



   <h2>{answer}</h2>

   <button onClick={()=>setAnswer("")}>
    Obriši
   </button>

   <button onClick={submitAnswer}>
    Potvrdi
   </button>

  </div>

 )

}

export default TeamPanel