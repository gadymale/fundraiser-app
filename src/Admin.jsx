<div className="fade-in">
  <h2>Admin Dashboard</h2>
  <input type="file" onChange={handleFileUpload} />
  {data.length > 0 && (
    <button className="btn-primary" onClick={uploadToFirebase}>Upload to Firebase</button>
  )}

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
</div>