export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <h1>B-Life Healthy</h1>
      <p>E-commerce (UI Phase 1)</p>

      <div style={{ marginTop: 24 }}>
        <h2>สินค้า</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
            <div style={{ height: 120, background: "#eee", borderRadius: 8 }} />
            <h3>Colla Mineral</h3>
            <p>ราคา 69 บาท</p>
            <p>PV 69</p>
            <button>เพิ่มลงตะกร้า</button>
          </div>

          <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
            <div style={{ height: 120, background: "#eee", borderRadius: 8 }} />
            <h3>B-Life Healthy</h3>
            <p>ราคา 350 บาท</p>
            <p>PV 350</p>
            <button>เพิ่มลงตะกร้า</button>
          </div>
        </div>
      </div>
    </main>
  );
}
