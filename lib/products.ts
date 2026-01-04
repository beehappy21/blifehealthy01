export type VariantOption = {
  id: string;
  label: string;
  priceAdd?: number;
  pvAdd?: number;
  priceMul?: number;
  pvMul?: number;
  stockDefault: number;
};

export type Variant = {
  key: string;
  size?: VariantOption;
  color?: VariantOption;
  pack?: VariantOption;
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
    size?: VariantOption[];
    color?: VariantOption[];
    pack?: VariantOption[];
  };
  variants: Variant[];
};

function makeKey(size?: VariantOption, color?: VariantOption, pack?: VariantOption) {
  const s = size?.id ?? "na";
  const c = color?.id ?? "na";
  const p = pack?.id ?? "na";
  return `s:${s}|c:${c}|p:${p}`;
}

function generateVariants(p: Omit<Product, "variants">): Variant[] {
  const sizes = p.options.size?.length ? p.options.size : [undefined];
  const colors = p.options.color?.length ? p.options.color : [undefined];
  const packs = p.options.pack?.length ? p.options.pack : [undefined];

  const out: Variant[] = [];

  for (const size of sizes) {
    for (const color of colors) {
      for (const pack of packs) {
        const price =
          (p.basePrice + (size?.priceAdd ?? 0)) * (pack?.priceMul ?? 1);
        const pv =
          (p.basePV + (size?.pvAdd ?? 0)) * (pack?.pvMul ?? 1);

        const stock =
          pack?.stockDefault ??
          size?.stockDefault ??
          color?.stockDefault ??
          50;

        out.push({
          key: makeKey(size, color, pack),
          size,
          color,
          pack,
          price,
          pv,
          stock,
        });
      }
    }
  }

  return out;
}

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
