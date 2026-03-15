import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TournamentTeams(){

 const { id } = useParams();

 const [teams,setTeams] = useState([]);
 const [baseTeams,setBaseTeams] = useState([]);

 const [name,setName] = useState("");
 const [password,setPassword] = useState("");
 const [members,setMembers] = useState(1);
 const [imageUrl,setImageUrl] = useState("");

 const token = localStorage.getItem("adminToken");

 const location = localStorage.getItem("tournamentLocation");

 const loadTeams = () => {

  fetch("https://slagalica-1-we7s.onrender.com/admin/tournament/"+id+"/teams",{
   headers:{
     "Authorization":"Bearer "+token
   }
  })
  .then(res=>res.json())
  .then(data=>setTeams(data))

 }

 const loadBaseTeams = () => {

  fetch("https://slagalica-1-we7s.onrender.com/admin/base-teams/"+location,{
   headers:{
     "Authorization":"Bearer "+token
   }
  })
  .then(res=>res.json())
  .then(data=>setBaseTeams(data))

 }

 useEffect(()=>{

  loadTeams()
  loadBaseTeams()

 },[])

 const addTeam = (e) => {

  e.preventDefault()

  fetch("https://slagalica-1-we7s.onrender.com/admin/team/add",{
   method:"POST",
   headers:{
    "Content-Type":"application/json",
    "Authorization":"Bearer "+token
   },
   body:JSON.stringify({
    tournamentId:id,
    name,
    password,
    members,
    imageUrl,
    location
   })
  })
  .then(()=>{

   setName("")
   setPassword("")
   setMembers(1)
   setImageUrl("")

   loadTeams()

  })

 }

 return(

  <div style={{padding:"40px"}}>

   <h1>Timovi u turniru</h1>

   {teams.map(t=>(
    <div key={t.id} style={{border:"1px solid gray",padding:"10px",marginBottom:"10px"}}>

     {t.name} ({t.members})

    </div>
   ))}

   <hr/>

   <h2>Dodaj novi tim</h2>

   <form onSubmit={addTeam}>

    <input
     placeholder="Ime tima"
     value={name}
     onChange={e=>setName(e.target.value)}
    />

    <br/><br/>

    <input
     placeholder="Šifra tima"
     value={password}
     onChange={e=>setPassword(e.target.value)}
    />

    <br/><br/>

    <input
     type="number"
     placeholder="Broj članova"
     value={members}
     onChange={e=>setMembers(e.target.value)}
    />

    <br/><br/>

    <input
     placeholder="URL slike"
     value={imageUrl}
     onChange={e=>setImageUrl(e.target.value)}
    />

    <br/><br/>

    <button type="submit">
     Dodaj tim
    </button>

   </form>

   <hr/>

   <h2>Postojeći timovi na lokaciji</h2>

   {baseTeams.map(t=>(
    <div key={t.id} style={{marginBottom:"5px"}}>

     {t.name}

     <button
      onClick={()=>{

       setName(t.name)
       setImageUrl(t.image)

      }}
     >
      Dodaj u turnir
     </button>

    </div>
   ))}

  </div>

 )

}

export default TournamentTeams
