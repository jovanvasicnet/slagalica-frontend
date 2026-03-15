import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const navigate = useNavigate();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const login = (e) => {

    e.preventDefault();

    setLoading(true);

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
    .then(res=>{

      if(!res.ok){
        throw new Error("Server error");
      }

      return res.json();

    })
    .then(data=>{

      if(data.token){

        localStorage.setItem("adminToken",data.token);

        navigate("/admin/panel");

      }else{

        alert("Pogrešan username ili password");

      }

    })
    .catch(err=>{

      console.error(err);
      alert("Server trenutno nije dostupan");

    })
    .finally(()=>{

      setLoading(false);

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

        <button disabled={loading} type="submit">
          {loading ? "Logging..." : "Login"}
        </button>

      </form>

    </div>

  )
}

export default AdminLogin
