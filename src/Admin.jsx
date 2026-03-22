import { useState } from "react";
import * as XLSX from "xlsx";

export default function Admin() {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
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

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <input type="file" onChange={handleFileUpload} />

      {data.length > 0 && (
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}