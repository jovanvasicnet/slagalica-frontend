import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTournament(){

 const [name,setName] = useState("");
 const [location,setLocation] = useState("");
 const [barName,setBarName] = useState("");
 const [quizType,setQuizType] = useState("");

 const navigate = useNavigate();

 const token = localStorage.getItem("adminToken");

 const create = (e) => {

  e.preventDefault();

  fetch("https://slagalica-1-we7s.onrender.com/admin/tournament/create",{
   method:"POST",
   headers:{
     "Content-Type":"application/json",
     "Authorization":"Bearer "+token
   },
   body:JSON.stringify({
     name,
     location,
     barName,
     quizType,
     startTime:new Date().toISOString(),
     plannedStart:new Date().toISOString()
   })
  })
    .then(res=>res.text())
    .then(data=>{
    console.log(data)
    navigate("/admin/panel")
    })


 }

 return(

  <div style={{padding:"40px"}}>

   <h1>Kreiraj turnir</h1>

   <form onSubmit={create}>

    <input placeholder="Ime turnira"
     value={name}
     onChange={e=>setName(e.target.value)}
    />

    <br/><br/>

    <input placeholder="Lokacija"
     value={location}
     onChange={e=>setLocation(e.target.value)}
    />

    <br/><br/>

    <input placeholder="Bar"
     value={barName}
     onChange={e=>setBarName(e.target.value)}
    />

    <br/><br/>

    <input placeholder="Tip kviza"
     value={quizType}
     onChange={e=>setQuizType(e.target.value)}
    />

    <br/><br/>

    <button type="submit">
      Kreiraj
    </button>

   </form>

  </div>

 )

}

export default CreateTournament
