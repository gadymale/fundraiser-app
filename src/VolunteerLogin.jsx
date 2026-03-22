import { useState } from "react";

export default function VolunteerLogin({ setUser }) {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!name.trim()) return;
    localStorage.setItem("volunteer", name);
    setUser(name);
  };

  return (
    <div>
      <h2>Volunteer Login</h2>
      <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin}>Continue</button>
    </div>
  );
}