import { useState, useEffect } from "react";
import Login from "./Login";
import VolunteerDashboard from "./VolunteerDashboard";
import Admin from "./Admin";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedRole = localStorage.getItem("role");
    if (savedUser) setUser(savedUser);
    if (savedRole) setRole(savedRole);
  }, []);

  if (!user) return <Login setUser={setUser} setRole={setRole} />;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Welcome {user}</h1>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            setUser(null);
            setRole(null);
          }}
          style={{ padding: 8, backgroundColor: "#f44336", color: "white", border: "none", borderRadius: 4 }}
        >
          Logout
        </button>
      </div>

      {role === "volunteer" && <VolunteerDashboard user={user} />}
      {role === "admin" && <Admin />}
    </div>
  );
}

export default App;