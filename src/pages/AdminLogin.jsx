import { useState } from "react";

function AdminLogin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 const login = (e) => {
  e.preventDefault();

  fetch("https://slagalica-1-xzha.onrender.com/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
  .then(res => res.text())
  .then(data => {
    console.log(data);

    if(data === "login success"){
      alert("Admin login uspješan");
    } else {
      alert("Pogrešan username ili password");
    }
  });
};


  return (
    <div style={{textAlign:"center", marginTop:"100px"}}>
      <h1>Admin Login</h1>

      <form onSubmit={login}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <br/><br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br/><br/>

        <button type="submit">Login</button>
      </form>

    </div>
  );
}

export default AdminLogin;
