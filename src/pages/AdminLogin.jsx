import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const navigate = useNavigate();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  const login = (e) => {

    e.preventDefault();

    fetch("https://slagalica-1-xzha.onrender.com/admin/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        username,
        password
      })
    })
    .then(res=>res.json())
    .then(data=>{

      if(data.token){

        localStorage.setItem("adminToken",data.token);

        navigate("/admin/panel");

      }else{

        alert("Pogrešan username ili password");

      }

    })

  }

  return(

    <div style={{textAlign:"center",marginTop:"100px"}}>

      <h1>Admin Login</h1>

      <form onSubmit={login}>

        <input
          placeholder="Username"
          value={username}
          onChange={e=>setUsername(e.target.value)}
        />

        <br/><br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />

        <br/><br/>

        <button type="submit">
          Login
        </button>

      </form>

    </div>

  )
}

export default AdminLogin
