import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { db } from "./firebase";
import { collection, addDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";

export default function Admin() {
  const [data, setData] = useState([]);
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "donors"), (snapshot) => {
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDonors(all);
    });
    return () => unsubscribe();
  }, []);

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

  const uploadToFirebase = async () => {
    for (const row of data) {
      const donor = {
        name: row["Name"] || "",
        phone: row["Primary Phone Number"] || "",
        email: row["Email"] || "",
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

  const assignDonor = async (id, volunteer) => {
    await updateDoc(doc(db, "donors", id), { assignedTo: volunteer });
  };

  return (
    <div className="fade-in">
      <h2>Admin Dashboard</h2>
      <input type="file" onChange={handleFileUpload} />
      {data.length > 0 && (
        <button className="btn-primary" onClick={uploadToFirebase}>Upload to Firebase</button>
      )}

      {data.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>City</th><th>State</th><th>Phone</th><th>FY22-23</th><th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{row["Name"]}</td>
                <td>{row["Primary City"]}</td>
                <td>{row["Primary State"]}</td>
                <td>{row["Primary Phone Number"]}</td>
                <td>{row["FY 22-23"]}</td>
                <td>
                  <input placeholder="Volunteer" onBlur={(e) => assignDonor(row.id, e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>All Donors in Firebase</h3>
      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Assigned To</th><th>Status</th></tr>
        </thead>
        <tbody>
          {donors.map((d, idx) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.assignedTo}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}