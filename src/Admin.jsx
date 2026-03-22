// src/Admin.jsx
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

export default function Admin() {
  const [donors, setDonors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [contactFilter, setContactFilter] = useState("all");
  const [likelihoodFilter, setLikelihoodFilter] = useState("all");

  // Load donors from Firebase
  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    const snapshot = await getDocs(collection(db, "donors"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setDonors(data);
    setFiltered(data);
  };

  const getLikelihood = (amount) => {
    if (amount > 500) return "high";
    if (amount > 100) return "medium";
    return "low";
  };

  // Upload Excel
  const uploadFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    for (let row of json) {
      const prev = Number(row.PreviousDonation || 0);
      const hasContact = !!(row.Phone || row.Email);
      await addDoc(collection(db, "donors"), {
        name: row.Name || "",
        phone: row.Phone || "",
        email: row.Email || "",
        previousDonation: prev,
        likelihood: getLikelihood(prev),
        hasContact,
        assignedTo: "",
        status: "pending"
      });
    }

    alert("Upload complete");
    loadDonors();
  };

  // Apply filters
  const applyFilters = () => {
    let temp = [...donors];
    if (contactFilter !== "all") {
      temp = temp.filter(d => d.hasContact === (contactFilter === "yes"));
    }
    if (likelihoodFilter !== "all") {
      temp = temp.filter(d => d.likelihood === likelihoodFilter);
    }
    setFiltered(temp);
  };

  // Assign donors to volunteers
  const assignDonors = async () => {
    const volunteers = ["vol1@example.com", "vol2@example.com"];
    for (let i = 0; i < filtered.length; i++) {
      await updateDoc(doc(db, "donors", filtered[i].id), {
        assignedTo: volunteers[i % volunteers.length]
      });
    }
    alert("Assigned!");
    loadDonors();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <h3>Upload Excel</h3>
      <input type="file" onChange={uploadFile} />

      <h3>Filters</h3>
      <select onChange={e => setContactFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="yes">Has Contact</option>
        <option value="no">No Contact</option>
      </select>

      <select onChange={e => setLikelihoodFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <button onClick={applyFilters}>Apply Filters</button>
      <button onClick={assignDonors}>Assign Donors</button>

      <h3>Donors ({filtered.length})</h3>
      {filtered.map(d => (
        <div key={d.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
          <b>{d.name}</b><br />
          Likelihood: {d.likelihood}<br />
          Contact: {d.hasContact ? "Yes" : "No"}<br />
          Assigned: {d.assignedTo || "Not assigned"}
        </div>
      ))}
    </div>
  );
}