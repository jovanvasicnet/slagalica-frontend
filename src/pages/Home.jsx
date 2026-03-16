import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
function Home(){

 const [tournament,setTournament] = useState(null);
 const [teams,setTeams] = useState([]);

 const [name,setName] = useState("");
 const [password,setPassword] = useState("");
 const navigate = useNavigate()
let sessionId = localStorage.getItem("sessionId")

if(!sessionId){
 sessionId = crypto.randomUUID()
 localStorage.setItem("sessionId",sessionId)
}
 useEffect(()=>{

  fetch("https://slagalica-1-we7s.onrender.com/tournament/active")
  .then(res=>res.json())
  .then(data=>{

    if(data.id){

      setTournament(data);

      fetch("https://slagalica-1-we7s.onrender.com/tournament/"+data.id+"/teams")
      .then(res=>res.json())
      .then(setTeams);

    }

  })

 },[])

 const join = (e) => {

  e.preventDefault()

  fetch("https://slagalica-1-we7s.onrender.com/team/join",{
   method:"POST",
   headers:{
    "Content-Type":"application/json"
   },
   body:JSON.stringify({
    name,
    password,
    tournamentId:tournament.id
   })
  })
  .then(res=>res.json())
  .then(data=>{

  if(data.success){

 localStorage.setItem("teamId",data.teamId)
 localStorage.setItem("tournamentId",tournament.id)

fetch("https://slagalica-1-we7s.onrender.com/team/session",{
 method:"POST",
 headers:{
  "Content-Type":"application/json"
 },
 body:JSON.stringify({
  teamId:data.teamId,
  sessionId
 })
})
.then(res=>res.json())
.then(session=>{

 localStorage.setItem("leader",session.leader)

})

alert("Uspješno ste se pridružili timu!")

fetch("https://slagalica-1-we7s.onrender.com/team/current-match/"+data.teamId)
.then(res=>res.json())
.then(match=>{

 if(match.matchId){

   navigate(`/team/${match.matchId}/${data.teamId}`)

 }else{

   alert("Meč još nije dodijeljen timu")

 }

})

}else{

    alert("Pogrešno ime tima ili šifra")

   }

  })

 }

 if(!tournament){

  return(

   <div style={{textAlign:"center",marginTop:"100px"}}>

    <h1>Slagalica kviz</h1>

    <p>Trenutno nema aktivnog turnira</p>

   </div>

  )

 }

 return(

  <div style={{textAlign:"center",marginTop:"50px"}}>

   <h1>{tournament.name}</h1>

   <h3>{tournament.bar}</h3>

   <p>{tournament.location}</p>

   <hr/>

   <h2>Timovi</h2>

   {teams.map(t=>(
    <div key={t.id}>

     {t.name} ({t.members})

    </div>
   ))}

   <hr/>

   <h2>Pridruži se timu</h2>

   <form onSubmit={join}>

    <input
     placeholder="Ime tima"
     value={name}
     onChange={e=>setName(e.target.value)}
    />

    <br/><br/>

    <input
     type="password"
     placeholder="Šifra tima"
     value={password}
     onChange={e=>setPassword(e.target.value)}
    />

    <br/><br/>

    <button type="submit">
     Pridruži se
    </button>

   </form>

  </div>

 )

}

export default Home
