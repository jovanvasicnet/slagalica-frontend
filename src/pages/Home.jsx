import { useEffect, useState } from "react";

function Home(){

 const [tournament,setTournament] = useState(null);
 const [teams,setTeams] = useState([]);

 const [name,setName] = useState("");
 const [password,setPassword] = useState("");

 useEffect(()=>{

  fetch("https://slagalica-1-xzha.onrender.com/tournament/active")
  .then(res=>res.json())
  .then(data=>{

    if(data.id){

      setTournament(data);

      fetch("https://slagalica-1-xzha.onrender.com/tournament/"+data.id+"/teams")
      .then(res=>res.json())
      .then(setTeams);

    }

  })

 },[])

 const join = (e) => {

  e.preventDefault()

  fetch("https://slagalica-1-xzha.onrender.com/team/join",{
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

    alert("Uspješno ste se pridružili timu!")

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
