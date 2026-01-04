export type VariantOption = {
  id: string;
  label: string;
  priceMul?: number;
  pvMul?: number;
  priceAdd?: number;
  pvAdd?: number;
  stockDefault?: number;
};

export type Variant = {
  key: string;
  label: string;
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

function makeKey(sizeId: string, colorId: string, packId: string) {
  return `size:${sizeId}|color:${colorId}|pack:${packId}`;
}

function generateVariants(p: Omit<Product, "variants">): Variant[] {
  const out: Variant[] = [];

  for (const size of p.options.size) {
    for (const color of p.options.color) {
      for (const pack of p.options.pack) {
        const key = makeKey(size.id, color.id, pack.id);
        const label = `${size.label} / ${color.label} / ${pack.label}`;

        let price = p.basePrice;
        let pv = p.basePV;

        price += size.priceAdd ?? 0;
        pv += size.pvAdd ?? 0;

        price += color.priceAdd ?? 0;
        pv += color.pvAdd ?? 0;

        price = Math.round(price * (pack.priceMul ?? 1) + (pack.priceAdd ?? 0));
        pv = Math.round(pv * (pack.pvMul ?? 1) + (pack.pvAdd ?? 0));

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
// Product Example: Colla Mineral (5x5x5)
// =======================
const collaMineralBase: Omit<Product, "variants"> = {
 const collaMineralBase: Omit<Product, "variants"> = {
  id: "colla-mineral",
  name: "Colla Mineral",
  basePrice: 69,
  basePV: 69,
  options: {
    size: [
      { id: "s1", label: "Size 1", priceAdd: 0, pvAdd: 0, stockDefault: 60 },
      { id: "s2", label: "Size 2", priceAdd: 30, pvAdd: 30, stockDefault: 50 },
      { id: "s3", label: "Size 3", priceAdd: 70, pvAdd: 70, stockDefault: 40 },
      { id: "s4", label: "Size 4", priceAdd: 120, pvAdd: 120, stockDefault: 30 },
      { id: "s5", label: "Size 5", priceAdd: 200, pvAdd: 200, stockDefault: 20 },
    ],
    color: [
      { id: "c1", label: "Color 1", stockDefault: 50 },
      { id: "c2", label: "Color 2", stockDefault: 50 },
      { id: "c3", label: "Color 3", stockDefault: 50 },
      { id: "c4", label: "Color 4", stockDefault: 50 },
      { id: "c5", label: "Color 5", stockDefault: 50 },
    ],
    pack: [
      { id: "p1", label: "Pack 1", priceMul: 1, pvMul: 1, stockDefault: 80 },
      { id: "p2", label: "Pack 2", priceMul: 2, pvMul: 2, stockDefault: 60 },
      { id: "p3", label: "Pack 3", priceMul: 3, pvMul: 3, stockDefault: 40 },
      { id: "p4", label: "Pack 4", priceMul: 4, pvMul: 4, stockDefault: 25 },
      { id: "p5", label: "Pack 5", priceMul: 5, pvMul: 5, stockDefault: 15 },
    ],
  },
};


export const products: Product[] = [
  {
    ...collaMineralBase,
    variants: generateVariants(collaMineralBase),
  },
];
