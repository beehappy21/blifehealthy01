"use client";

import { useMemo, useState } from "react";
import { products } from "@/lib/products";

type Selected = {
  size?: string;
  color?: string;
  pack?: string;
};

function calcTotal(productId: string, selected: Selected) {
  const p = products.find((x) => x.id === productId)!;
  let price = p.basePrice;
  let pv = p.basePV;

  const all = [
    ...(p.options.size ?? []),
    ...(p.options.color ?? []),
    ...(p.options.pack ?? []),
  ];

  const pickIds = [selected.size, selected.color, selected.pack].filter(Boolean) as string[];

  for (const id of pickIds) {
    const opt = all.find((o) => o.id === id);
    if (opt?.priceDelta) price += opt.priceDelta;
    if (opt?.pvDelta) pv += opt.pvDelta;
  }

  return { price, pv };
}

export default function ShopPage() {
  const [selectedMap, setSelectedMap] = useState<Record<string, Selected>>({});

  const setSelected = (productId: string, key: keyof Selected, value: string) => {
    setSelectedMap((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] ?? {}), [key]: value },
    }));
  };

  const addToCart = (productId: string) => {
    const p = products.find((x) => x.id === productId)!;
    const selected = selectedMap[productId] ?? {};
    const { price, pv } = calcTotal(productId, selected);

    const item = {
      productId: p.id,
      name: p.name,
      selected,
      price,
      pv,
      qty: 1,
      key: `${p.id}|${selected.size ?? ""}|${selected.color ?? ""}|${selected.pack ?? ""}`,
    };

    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];

    const idx = cart.findIndex((x: any) => x.key === item.key);
    if (idx >= 0) cart[idx].qty += 1;
    else cart.push(item);

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("เพิ่มลงตะกร้าแล้ว");
  };

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>Shop</h1>
      <p style={{ color: "#555" }}>เลือก Size / Color / Package แล้วเพิ่มลงตะกร้า</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 16 }}>
        {products.map((p) => {
          const selected = selectedMap[p.id] ?? {};
          const { price, pv } = useMemo(() => calcTotal(p.id, selected), [p.id, selected.size, selected.color, selected.pack]);

          return (
            <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
              <div style={{ height: 150, background: "#f4f4f4", borderRadius: 12 }} />
              <h3 style={{ margin: "12px 0 6px" }}>{p.name}</h3>

              {/* Options */}
              <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                {p.options.size && (
                  <div>
                    <div style={{ fontSize: 13, color: "#666" }}>Size</div>
                    <select
                      value={selected.size ?? ""}
                      onChange={(e) => setSelected(p.id, "size", e.target.value)}
                      style={{ width: "100%", padding: 8, borderRadius: 10, border: "1px solid #ddd" }}
                    >
                      <option value="">เลือก Size</option>
                      {p.options.size.map((o) => (
                        <option key={o.id} value={o.id}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {p.options.color && (
                  <div>
                    <div style={{ fontSize: 13, color: "#666" }}>Color</div>
                    <select
                      value={selected.color ?? ""}
                      onChange={(e) => setSelected(p.id, "color", e.target.value)}
                      style={{ width: "100%", padding: 8, borderRadius: 10, border: "1px solid #ddd" }}
                    >
                      <option value="">เลือก Color</option>
                      {p.options.color.map((o) => (
                        <option key={o.id} value={o.id}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {p.options.pack && (
                  <div>
                    <div style={{ fontSize: 13, color: "#666" }}>Package</div>
                    <select
                      value={selected.pack ?? ""}
                      onChange={(e) => setSelected(p.id, "pack", e.target.value)}
                      style={{ width: "100%", padding: 8, borderRadius: 10, border: "1px solid #ddd" }}
                    >
                      <option value="">เลือก Package</option>
                      {p.options.pack.map((o) => (
                        <option key={o.id} value={o.id}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <div>ราคา: <b>{price}</b> บาท</div>
                <div style={{ color: "#2a7" }}>PV: <b>{pv}</b></div>
              </div>

              <button
                onClick={() => addToCart(p.id)}
                style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer", width: "100%" }}
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="/cart">ไปที่ตะกร้า →</a>
      </div>
    </main>
  );
}
