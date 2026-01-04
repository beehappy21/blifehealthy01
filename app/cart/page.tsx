"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = {
  key: string;
  productId: string;
  name: string;
  variantKey: string;
  variantLabel: string;
  price: number;
  pv: number;
  qty: number;
  stock: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setCart(raw ? JSON.parse(raw) : []);
  }, []);

  const totals = useMemo(() => {
    const totalPrice = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const totalPV = cart.reduce((s, x) => s + x.pv * x.qty, 0);
    return { totalPrice, totalPV };
  }, [cart]);

  const save = (next: CartItem[]) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const inc = (key: string) => {
    const next = cart.map((x) => {
      if (x.key !== key) return x;
      if (x.qty + 1 > x.stock) return x;
      return { ...x, qty: x.qty + 1 };
    });
    save(next);
  };

  const dec = (key: string) =>
    save(cart.map((x) => (x.key === key ? { ...x, qty: Math.max(1, x.qty - 1) } : x)));

  const remove = (key: string) => save(cart.filter((x) => x.key !== key));
  const clear = () => save([]);

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>Cart</h1>

      {cart.length === 0 ? (
        <p>ตะกร้าว่าง — <a href="/shop">ไปเลือกสินค้า</a></p>
      ) : (
        <>
          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            {cart.map((item) => (
              <div key={item.key} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <b>{item.name}</b>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                    Variant: {item.variantLabel}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    ราคา/ชิ้น: {item.price} บาท | PV/ชิ้น: {item.pv}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13, color: "#555" }}>
                    สต็อก: {item.stock}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button onClick={() => dec(item.key)}>-</button>
                    <b>{item.qty}</b>
                    <button onClick={() => inc(item.key)} disabled={item.qty >= item.stock}>
                      +
                    </button>
                  </div>
                  {item.qty >= item.stock && (
                    <div style={{ fontSize: 12, color: "#c00" }}>เพิ่มเกินสต็อกไม่ได้</div>
                  )}
                  <button onClick={() => remove(item.key)} style={{ border: "1px solid #ddd" }}>ลบ</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
            <div>รวมราคา: <b>{totals.totalPrice}</b> บาท</div>
            <div style={{ color: "#2a7" }}>รวม PV: <b>{totals.totalPV}</b></div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <button onClick={clear}>ล้างตะกร้า</button>
            <a href="/checkout">ไปชำระเงิน (UI) →</a>
          </div>
        </>
      )}
    </main>
  );
}
