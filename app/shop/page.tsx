"use client";

import { useMemo, useState } from "react";
import { products } from "@/lib/products";

type Selected = { size?: string; color?: string; pack?: string };

function makeKey(sel: Selected) {
  const parts: string[] = [];
  if (sel.size) parts.push(`size:${sel.size}`);
  if (sel.color) parts.push(`color:${sel.color}`);
  if (sel.pack) parts.push(`pack:${sel.pack}`);
  return parts.join("|");
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
    const key = makeKey(selected);

    const variant = p.variants.find((v) => v.key === key);
    if (!variant) {
      alert("ยังไม่มีชุดสินค้านี้ในระบบ (กรุณาเลือกตัวเลือกให้ครบ/ถูกต้อง)");
      return;
    }

    if (variant.stock <= 0) {
      alert("สินค้าชุดนี้หมดสต็อก");
      return;
    }

    const item = {
      key: `${p.id}|${variant.key}`,
      productId: p.id,
      name: p.name,
      variantKey: variant.key,
      variantLabel: variant.label,
      price: variant.price,
      pv: variant.pv,
      qty: 1,
      stock: variant.stock, // ใช้กันเพิ่มเกินสต็อกในตะกร้า
    };

    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];

    const idx = cart.findIndex((x: any) => x.key === item.key);
    if (idx >= 0) {
      if (cart[idx].qty + 1 > cart[idx].stock) {
        alert("เพิ่มเกินสต็อกไม่ได้");
        return;
      }
      cart[idx].qty += 1;
    } else {
      cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("เพิ่มลงตะกร้าแล้ว");
  };

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>Shop</h1>
      <p style={{ color: "#555" }}>ตัวเลือกมีผลกับ ราคา + PV + สต็อก (Variant)</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 16 }}>
        {products.map((p) => {
          const selected = selectedMap[p.id] ?? {};
          const key = useMemo(() => makeKey(selected), [selected.size, selected.color, selected.pack]);
          const variant = useMemo(() => p.variants.find((v) => v.key === key), [p.id, key]);

          const price = variant?.price ?? "-";
          const pv = variant?.pv ?? "-";
          const stock = variant?.stock ?? null;

          const canAdd = !!variant && variant.stock > 0;

          return (
            <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
              <div style={{ height: 150, background: "#f4f4f4", borderRadius: 12 }} />
              <h3 style={{ margin: "12px 0 6px" }}>{p.name}</h3>

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
                      {p.options.size.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
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
                      {p.options.color.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
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
                      {p.options.pack.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <div>ราคา: <b>{price}</b> บาท</div>
                <div style={{ color: "#2a7" }}>PV: <b>{pv}</b></div>
                <div style={{ marginTop: 6, color: stock === 0 ? "#c00" : "#555" }}>
                  สต็อก: <b>{stock === null ? "-" : stock}</b>
                </div>
                {!variant && (
                  <div style={{ marginTop: 6, fontSize: 13, color: "#b80" }}>
                    * ยังไม่มีชุดนี้ใน variants (ต้องกำหนดใน lib/products.ts)
                  </div>
                )}
              </div>

              <button
                disabled={!canAdd}
                onClick={() => addToCart(p.id)}
                style={{
                  marginTop: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  cursor: canAdd ? "pointer" : "not-allowed",
                  width: "100%",
                  opacity: canAdd ? 1 : 0.5,
                }}
              >
                {variant && variant.stock === 0 ? "หมดสต็อก" : "เพิ่มลงตะกร้า"}
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
