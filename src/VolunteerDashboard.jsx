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
      <h2>Your Donors</h2>
      {donors.length === 0 && <p>No donors assigned yet</p>}

      {donors.map((d) => (
        <div key={d.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p><strong>{d.name}</strong></p>
          <p>Status: {d.status}</p>

          <button onClick={() => updateStatus(d.id, "contacted")}>Contacted</button>
          <button onClick={() => updateStatus(d.id, "donated")}>Donated 💰</button>
        </div>
      ))}
    </div>
  );
}