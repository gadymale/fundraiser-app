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
    <div>
      <h2>Admin Dashboard</h2>
      <input type="file" onChange={handleFileUpload} style={{ marginBottom: 10 }} />
      {data.length > 0 && <button onClick={uploadToFirebase} style={{ marginBottom: 20, padding: 8, backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: 4 }}>Upload to Firebase</button>}

      {/* Excel Preview */}
      {data.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 30 }}>
          <thead>
            <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
              <th>Name</th><th>Primary City</th><th>Primary State</th>
              <th>Primary Phone Number</th><th>FY 22-23</th><th>FY 23-24</th>
              <th>FY 24-25</th><th>FY 25-26</th><th>Groups</th><th>Household Name</th>
              <th>Account Number</th><th>Assign to Volunteer</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white" }}>
                <td>{row["Name"]}</td><td>{row["Primary City"]}</td><td>{row["Primary State"]}</td>
                <td>{row["Primary Phone Number"]}</td><td>{row["FY 22-23"]}</td><td>{row["FY 23-24"]}</td>
                <td>{row["FY 24-25"]}</td><td>{row["FY 25-26"]}</td><td>{row["Groups"]}</td>
                <td>{row["Household Name"]}</td><td>{row["Account Number"]}</td>
                <td>
                  <input
                    placeholder="Assign volunteer"
                    onBlur={(e) => assignDonor(row.id, e.target.value)}
                    style={{ padding: 4, borderRadius: 4, border: "1px solid #ccc" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Firebase Donors */}
      <h3>All Donors in Firebase</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
            <th>Name</th><th>Assigned To</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((d, idx) => (
            <tr key={d.id} style={{ backgroundColor: idx % 2 === 0 ? "#f2f2f2" : "white" }}>
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