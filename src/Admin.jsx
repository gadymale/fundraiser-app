import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { db } from "./firebase";
import { collection, addDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";

export default function Admin() {
  const [data, setData] = useState([]);
  const [donors, setDonors] = useState([]);
  const [filters, setFilters] = useState({ name: "", city: "", state: "", assignedTo: "" });

  // Fetch donors from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "donors"), (snapshot) => {
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDonors(all);
    });
    return () => unsubscribe();
  }, []);

  // Upload Excel file and parse
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  // Upload Excel data to Firebase
  const uploadToFirebase = async () => {
    for (const row of data) {
      const donor = {
        name: row["Name"] || "",
        phone: row["Primary Phone Number"] || "",
        email: row["Email"] || "",
        primaryCity: row["Primary City"] || "",
        primaryState: row["Primary State"] || "",
        previousDonation: row["FY 22-23"] || 0,
        likelihood: "medium",
        hasContact: !!row["Primary Phone Number"] || !!row["Email"],
        assignedTo: "",
        status: "pending"
      };
      await addDoc(collection(db, "donors"), donor);
    }
    alert("Donors uploaded to Firebase!");
  };

  // Assign donor to volunteer
  const assignDonor = async (id, volunteer) => {
    await updateDoc(doc(db, "donors", id), { assignedTo: volunteer });
  };

  // Filter donors
  const filteredDonors = donors.filter((d) =>
    d.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    d.primaryCity.toLowerCase().includes(filters.city.toLowerCase()) &&
    d.primaryState.toLowerCase().includes(filters.state.toLowerCase()) &&
    d.assignedTo.toLowerCase().includes(filters.assignedTo.toLowerCase())
  );

  return (
    <div className="fade-in">
      <h2>Admin Dashboard</h2>

      {/* File Upload */}
      <div style={{ marginBottom: 20 }}>
        <input type="file" onChange={handleFileUpload} style={{ marginRight: 10 }} />
        {data.length > 0 && (
          <button className="btn-primary" onClick={uploadToFirebase}>
            Upload to Firebase
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 20 }}>
        <input
          className="filter-input"
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          className="filter-input"
          placeholder="Filter by city"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <input
          className="filter-input"
          placeholder="Filter by state"
          value={filters.state}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
        />
        <input
          className="filter-input"
          placeholder="Filter by volunteer"
          value={filters.assignedTo}
          onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
        />
      </div>

      {/* Donors Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>State</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{d.primaryCity}</td>
                <td>{d.primaryState}</td>
                <td>{d.phone}</td>
                <td>
                  <span className={`status-badge ${d.status.toLowerCase()}`}>
                    {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                  </span>
                </td>
                <td>{d.assignedTo}</td>
                <td>
                  <input
                    placeholder="Assign volunteer"
                    onBlur={(e) => assignDonor(d.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}