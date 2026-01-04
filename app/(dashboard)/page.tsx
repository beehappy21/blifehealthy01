export default function DashboardHome() {
  const products = [
    { id: "p1", name: "Colla Mineral", price: 69, pv: 69 },
    { id: "p2", name: "B-Life Healthy", price: 350, pv: 350 },
    { id: "p3", name: "Starter Pack", price: 999, pv: 999 },
  ];

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>B-Life Healthy</h1>
          <p style={{ marginTop: 6, color: "#555" }}>
            E-Commerce (UI ก่อน) + PV + Wallet (FIRM)
          </p>
        </div>
      </header>

      <section style={{ marginTop: 24 }}>
        <h2>สินค้า</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 16,
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div style={{ height: 140, background: "#f4f4f4", borderRadius: 10 }} />
              <h3 style={{ margin: "10px 0 4px" }}>{p.name}</h3>
              <p>ราคา {p.price} บาท</p>
              <p style={{ color: "#2a7" }}>PV {p.pv}</p>
              <button
                style={{
                  marginTop: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: 32, fontSize: 13, color: "#777" }}>
        © {new Date().getFullYear()} B-Life Healthy
      </footer>
    </main>
  );
}
