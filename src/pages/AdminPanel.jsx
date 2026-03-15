import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPanel(){

 const [tournaments,setTournaments] = useState([]);
 const navigate = useNavigate();

 const token = localStorage.getItem("adminToken");

 const load = () => {

  fetch("https://slagalica-1-xzha.onrender.com/admin/tournaments",{
    headers:{
      "Authorization":"Bearer "+token
    }
  })
  .then(res=>res.json())
  .then(data=>setTournaments(data))

 }

 useEffect(()=>{

  load()

 },[])

 const start = (id) => {

  fetch("https://slagalica-1-xzha.onrender.com/admin/tournament/start/"+id,{
   method:"POST",
   headers:{
     "Authorization":"Bearer "+token
   }
  })
  .then(()=>load())

 }

 const finish = (id) => {

  fetch("https://slagalica-1-xzha.onrender.com/admin/tournament/finish/"+id,{
   method:"POST",
   headers:{
     "Authorization":"Bearer "+token
   }
  })
  .then(()=>load())

 }

 return(

  <div style={{padding:"40px"}}>

   <h1>Admin Panel</h1>

   <button onClick={()=>navigate("/admin/create")}>
     Kreiraj turnir
   </button>

   <br/><br/>

   {tournaments.map(t=>(
    <div key={t.id} style={{border:"1px solid gray",padding:"15px",marginBottom:"10px"}}>

      <h3>{t.name}</h3>

      <p>{t.location} - {t.barName}</p>

      <p>Status: {t.status}</p>

      <button onClick={()=>{
        localStorage.setItem("tournamentLocation",t.location)
        navigate("/admin/tournament/"+t.id)
        }}>
        Timovi
      </button>


      <button onClick={()=>start(t.id)}>
        Start
      </button>

      <button onClick={()=>finish(t.id)}>
        Finish
      </button>

    </div>
   ))}

  </div>

 )

}

export default AdminPanel
