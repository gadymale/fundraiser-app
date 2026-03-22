import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function VolunteerDashboard({ user }) {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "donors"), where("assignedTo", "==", user));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDonors(data);
    });
    return () => unsubscribe();
  }, [user]);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "donors", id), { status });
    const card = document.getElementById(id);
    if (card) card.classList.add("status-updated");
    setTimeout(() => card?.classList.remove("status-updated"), 600);
  };

  return (
    <div className="fade-in">
      <h2>Your Assigned Donors</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
        {donors.map((d) => (
          <div key={d.id} className="vol-card" id={d.id}>
            <p><strong>{d.name}</strong></p>
            <p>Status: {d.status}</p>
            <button className="contact" onClick={() => updateStatus(d.id, "contacted")}>Contacted</button>
            <button className="donated" onClick={() => updateStatus(d.id, "donated")}>Donated 💰</button>
          </div>
        ))}
      </div>
    </div>
  );
}