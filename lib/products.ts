export type VariantOption = {
  id: string;
  label: string;
};

export type Variant = {
  // combination key เช่น "size:m|color:blue|pack:box3"
  key: string;
  label: string;       // ชื่อชุดที่โชว์
  price: number;       // ราคา "final" ของชุดนี้
  pv: number;          // PV "final" ของชุดนี้
  stock: number;       // สต็อกคงเหลือของชุดนี้
};

export type Product = {
  id: string;
  name: string;
  image?: string;
  options: {
    size?: VariantOption[];
    color?: VariantOption[];
    pack?: VariantOption[];
  };
  variants: Variant[]; // ✅ สต็อก/ราคา/PV แยกตามชุดตัวเลือก
};

export const products: Product[] = [
  {
    id: "colla-mineral",
    name: "Colla Mineral",
    options: {
      size: [
        { id: "s", label: "S (10 ซอง)" },
        { id: "m", label: "M (30 ซอง)" },
        { id: "l", label: "L (60 ซอง)" },
      ],
      color: [
        { id: "white", label: "ขาว" },
        { id: "blue", label: "น้ำเงิน" },
        { id: "green", label: "เขียว" },
      ],
      pack: [
        { id: "box1", label: "แพ็ค 1 กล่อง" },
        { id: "box3", label: "แพ็ค 3 กล่อง" },
        { id: "box6", label: "แพ็ค 6 กล่อง" },
      ],
    },

    // ✅ กำหนดราคา/PV/สต็อก แยกตามชุดตัวเลือกที่ขายจริง
    variants: [
      {
        key: "size:s|color:white|pack:box1",
        label: "S ขาว / 1 กล่อง",
        price: 69,
        pv: 69,
        stock: 30,
      },
      {
        key: "size:m|color:blue|pack:box1",
        label: "M น้ำเงิน / 1 กล่อง",
        price: 189,
        pv: 189,
        stock: 10,
      },
      {
        key: "size:m|color:blue|pack:box3",
        label: "M น้ำเงิน / 3 กล่อง",
        price: 369,
        pv: 369,
        stock: 5,
      },
      {
        key: "size:l|color:green|pack:box6",
        label: "L เขียว / 6 กล่อง",
        price: 789,
        pv: 789,
        stock: 0, // ✅ หมด
      },
    ],
  },

  {
    id: "blife-healthy",
    name: "B-Life Healthy",
    options: {
      color: [
        { id: "gold", label: "ทอง" },
        { id: "black", label: "ดำ" },
      ],
      pack: [
        { id: "single", label: "1 ชิ้น" },
        { id: "bundle3", label: "แพ็ค 3
