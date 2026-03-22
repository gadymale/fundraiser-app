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
  };

  return (
    <div>
      <h2>Your Assigned Donors</h2>
      {donors.length === 0 && <p>No donors assigned yet.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
        {donors.map((d) => (
          <div key={d.id} style={{ border: "1px solid #ccc", borderRadius: 4, padding: 10, backgroundColor: "#fafafa" }}>
            <p><strong>{d.name}</strong></p>
            <p>Status: {d.status}</p>
            <button
              onClick={() => updateStatus(d.id, "contacted")}
              style={{ marginRight: 5, padding: 6, borderRadius: 4, border: "none", backgroundColor: "#2196F3", color: "white" }}
            >
              Contacted
            </button>
            <button
              onClick={() => updateStatus(d.id, "donated")}
              style={{ padding: 6, borderRadius: 4, border: "none", backgroundColor: "#FF9800", color: "white" }}
            >
              Donated 💰
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}