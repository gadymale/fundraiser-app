import { useState } from "react";

export default function Login({ setUser, setRole }) {
  const [name, setName] = useState("");
  const [role, setLocalRole] = useState("volunteer");

  const handleLogin = () => {
    if (!name.trim()) return;

    if (role === "admin") {
      const password = prompt("Enter admin password:");
      if (password !== "admin123") {
        alert("Wrong password!");
        return;
      }
    }

    localStorage.setItem("user", name);
    localStorage.setItem("role", role);
    setUser(name);
    setRole(role);
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>
      <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <select
        value={role}
        onChange={(e) => setLocalRole(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      >
        <option value="volunteer">Volunteer</option>
        <option value="admin">Admin</option>
      </select>
      <button
        onClick={handleLogin}
        style={{ width: "100%", padding: 10, backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: 4 }}
      >
        Continue
      </button>
    </div>
  );
}