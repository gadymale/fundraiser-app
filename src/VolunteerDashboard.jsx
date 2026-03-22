<div className="fade-in">
  <h2>Your Assigned Donors</h2>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
    {donors.map(d => (
      <div key={d.id} className="vol-card" id={d.id}>
        <p><strong>{d.name}</strong></p>
        <p>Status: {d.status}</p>
        <button className="contact" onClick={() => updateStatus(d.id, "contacted")}>Contacted</button>
        <button className="donated" onClick={() => updateStatus(d.id, "donated")}>Donated 💰</button>
      </div>
    ))}
  </div>
</div>