import { useEffect,useState } from "react"

function TeamPanel(){

 const teamId = localStorage.getItem("teamId")

 const [match,setMatch] = useState(null)
 const [countdown,setCountdown] = useState(null)

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

 },[])

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

   {countdown !== null && countdown > 0 && (

    <h2>Početak igre za: {countdown}</h2>

   )}

   {countdown === 0 && (

    <h2>Igra počinje!</h2>

   )}

  </div>

 )

}

export default TeamPanel