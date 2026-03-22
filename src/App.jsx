import { useState, useEffect } from "react";
import VolunteerLogin from "./VolunteerLogin";
import VolunteerDashboard from "./VolunteerDashboard";
import Admin from "./Admin";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("volunteer");
    if (saved) setUser(saved);
  }, []);

  if (!user) return <VolunteerLogin setUser={setUser} />;

  return (
    <div>
      <h1>Welcome {user}</h1>
      <button
        onClick={() => {
          localStorage.removeItem("volunteer");
          setUser(null);
        }}
      >
        Logout
      </button>

      <VolunteerDashboard user={user} />
      <Admin />
    </div>
  );
}

export default App;