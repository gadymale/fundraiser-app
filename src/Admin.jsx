import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { db } from "./firebase";
import { collection, addDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";

export default function Admin() {
  const [data, setData] = useState([]); // Excel preview
  const [volunteers, setVolunteers] = useState([]); // Optionally track volunteer names
  const [donors, setDonors] = useState([]); // Firebase donors

  // Load donors from Firebase for admin view
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "donors"), (snapshot) => {
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDonors(all);
    });
    return () => unsubscribe();
  }, []);

  // Parse Excel file
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
      // Map Excel columns to your donor model
      const donor = {
        name: row["Name"] || "",
        phone: row["Primary Phone Number"] || "",
        email: row["Email"] || "",
        previousDonation: row["FY 22-23"] || 0,
        likelihood: "medium", // default, can calculate later
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
    if (volunteer && !volunteers.includes(volunteer)) {
      setVolunteers((prev) => [...prev, volunteer]);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Excel Upload */}
      <input type="file" onChange={handleFileUpload} />
      {data.length > 0 && (
        <>
          <button onClick={uploadToFirebase} style={{ marginTop: 10 }}>
            Upload to Firebase
          </button>
          <table border="1" style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Primary City</th>
                <th>Primary State</th>
                <th>Primary Phone Number</th>
                <th>FY 22-23</th>
                <th>FY 23-24</th>
                <th>FY 24-25</th>
                <th>FY 25-26</th>
                <th>Groups</th>
                <th>Household Name</th>
                <th>Account Number</th>
                <th>Assign to Volunteer</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row["Name"]}</td>
                  <td>{row["Primary City"]}</td>
                  <td>{row["Primary State"]}</td>
                  <td>{row["Primary Phone Number"]}</td>
                  <td>{row["FY 22-23"]}</td>
                  <td>{row["FY 23-24"]}</td>
                  <td>{row["FY 24-25"]}</td>
                  <td>{row["FY 25-26"]}</td>
                  <td>{row["Groups"]}</td>
                  <td>{row["Household Name"]}</td>
                  <td>{row["Account Number"]}</td>
                  <td>
                    <input
                      placeholder="Assign to volunteer"
                      onBlur={(e) => assignDonor(row.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Existing Firebase donors */}
      <h3 style={{ marginTop: 40 }}>All Donors in Firebase</h3>
      <table border="1" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Assigned To</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((d) => (
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