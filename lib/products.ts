export type VariantOption = {
  id: string;
  label: string;
  // ตัวคูณ/ตัวเพิ่มสำหรับคำนวณราคา+PV
  priceMul?: number;  // เช่น pack 3 กล่อง = x3
  pvMul?: number;
  priceAdd?: number;  // บวกเพิ่ม เช่น size ใหญ่ +100
  pvAdd?: number;
  stockDefault?: number; // สต็อกเริ่มต้นของ option นี้ (ใช้รวมกัน)
};

export type Variant = {
  key: string;     // "size:s1|color:c1|pack:p1"
  label: string;   // "S1 / C1 / P1"
  price: number;
  pv: number;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  basePrice: number;
  basePV: number;
  options: {
    size: VariantOption[];
    color: VariantOption[];
    pack: VariantOption[];
  };
  variants: Variant[];
};

// ✅ ฟังก์ชันสร้าง key
function makeKey(sizeId: string, colorId: string, packId: string) {
  return `size:${sizeId}|color:${colorId}|pack:${packId}`;
}

// ✅ ฟังก์ชันสร้าง variants อัตโนมัติ
function generateVariants(p: Omit<Product, "variants">): Variant[] {
  const out: Variant[] = [];

  for (const size of p.options.size) {
    for (const color of p.options.color) {
      for (const pack of p.options.pack) {
        const key = makeKey(size.id, color.id, pack.id);
        const label = `${size.label} / ${color.label} / ${pack.label}`;

        // ---- สูตรราคา/PV (ปรับได้) ----
        let price = p.basePrice;
        let pv = p.basePV;

        // size เพิ่มราคา/ PV ได้
        price += size.priceAdd ?? 0;
        pv += size.pvAdd ?? 0;

        // color เพิ่มราคา/ PV ได้ (ถ้าต้องการให้บางสีแพงกว่า)
        price += color.priceAdd ?? 0;
        pv += color.pvAdd ?? 0;

        // pack ใช้ตัวคูณเป็นหลัก (เช่น 1 กล่อง x1, 3 กล่อง x3, 5 กล่อง x5)
        price = Math.round(price * (pack.priceMul ?? 1) + (pack.priceAdd ?? 0));
        pv = Math.round(pv * (pack.pvMul ?? 1) + (pack.pvAdd ?? 0));

        // ---- สูตรสต็อก (ปรับได้) ----
        // ตัวอย่าง: สต็อกเริ่มต้น = min ของแต่ละ option (เพื่อให้ไม่เว่อร์)
        const stock = Math.min(
          size.stockDefault ?? 50,
          color.stockDefault ?? 50,
          pack.stockDefault ?? 50
        );

        out.push({ key, label, price, pv, stock });
      }
    }
  }

  return out;
}

// =======================
// ✅ ตัวอย่างสินค้า: Colla Mineral (5x5x5)
// =======================
const collaMineralBase: Omit<Product, "variants"> = {
  id: "colla-mineral",
  name: "Colla Mineral",
  basePrice: 69,
  basePV: 69,
  options: {
    // Size 5 แบบ (ตัวอย่าง) — คุณเปลี่ยน label/priceAdd/pvAdd ได้
    size: [
      { id: "s1", label: "Size 1", priceAdd: 0,   pvAdd: 0,   stockDefault: 60 },
      { id: "s2", label: "Size 2", priceAdd: 30,  pvAdd: 30,  stockDefault: 50 },
      { id: "s3", label: "Size 3", priceAdd: 70,  pvAdd: 70,  stockDefault: 40 },
      { id: "s4", label: "Size 4", priceAdd: 120, pvAdd: 120, stockDefault: 30 },
      { id: "s5", label: "Size 5", priceAdd: 200, pvAdd: 200, stockDefault: 20 },
    ],

    // Color 5 สี (ใส่ priceAdd/pvAdd = 0 ทั้งหมดก็ได้)
    color: [
      { id: "c1", label: "Color 1", stockDefault: 50 },
      { id: "c2", label: "Color 2", stockDefault: 50 },
      { id: "c3", label: "Color 3", stockDefault: 50 },
      { id: "c4", label: "Color 4", stockDefault: 50 },
      { id: "c5", label: "Color 5", stockDefault: 50 },
    ],

    // Pack 5 แบบ (ใช้ตัวค
