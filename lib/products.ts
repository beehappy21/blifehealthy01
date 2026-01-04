export type VariantOption = {
  id: string;          // รหัสตัวเลือก เช่น "S", "red", "box1"
  label: string;       // ชื่อที่โชว์
  priceDelta?: number; // เพิ่ม/ลดราคาเมื่อเลือกตัวนี้
  pvDelta?: number;    // เพิ่ม/ลด PV เมื่อเลือกตัวนี้
};

export type Product = {
  id: string;
  name: string;
  basePrice: number;
  basePV: number;
  image?: string;
  options: {
    size?: VariantOption[];
    color?: VariantOption[];
    pack?: VariantOption[];
  };
};

export const products: Product[] = [
  {
    id: "colla-mineral",
    name: "Colla Mineral",
    basePrice: 69,
    basePV: 69,
    options: {
      size: [
        { id: "s", label: "ขนาด S (10 ซอง)", priceDelta: 0, pvDelta: 0 },
        { id: "m", label: "ขนาด M (30 ซอง)", priceDelta: 120, pvDelta: 120 },
        { id: "l", label: "ขนาด L (60 ซอง)", priceDelta: 300, pvDelta: 300 },
      ],
      color: [
        { id: "white", label: "ขาว" },
        { id: "blue", label: "น้ำเงิน" },
        { id: "green", label: "เขียว" },
      ],
      pack: [
        { id: "box1", label: "แพ็ค 1 กล่อง", priceDelta: 0, pvDelta: 0 },
        { id: "box3", label: "แพ็ค 3 กล่อง", priceDelta: 180, pvDelta: 180 },
        { id: "box6", label: "แพ็ค 6 กล่อง", priceDelta: 420, pvDelta: 420 },
      ],
    },
  },
  {
    id: "blife-healthy",
    name: "B-Life Healthy",
    basePrice: 350,
    basePV: 350,
    options: {
      pack: [
        { id: "single", label: "1 ชิ้น", priceDelta: 0, pvDelta: 0 },
        { id: "bundle3", label: "แพ็ค 3 ชิ้น", priceDelta: 900, pvDelta: 900 },
      ],
      color: [
        { id: "gold", label: "ทอง" },
        { id: "black", label: "ดำ" },
      ],
    },
  },
];
