// src/inventory.ts
// Агуулахын барааны тооцоолол хийдэг "цэвэр" (pure) функцүүд.
// Pure функц = гадаад төлөв өөрчилдөггүй, ижил оролтод үргэлж ижил гаралт өгдөг.

/** Бараа ямар ангилалд багтахыг хязгаарласан төрөл (literal union). */
export type Category = "electronics" | "food" | "clothing";

/** Нэг барааны бүтэц. readonly = үүсгэсний дараа өөрчлөхгүй. */
export interface Item {
  readonly sku: string;        // Stock Keeping Unit – барааны давтагдашгүй код
  readonly name: string;
  readonly category: Category;
  readonly quantity: number;   // одоо байгаа тоо ширхэг
  readonly unitPrice: number;  // нэгжийн үнэ (төгрөг)
  readonly minQuantity: number; // энэ хэмжээнээс доош орвол "дутагдалтай"
}

/** Оролтын өгөгдөл буруу үед шиддэг тусгай алдаа. */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Ангилал бүрийн монгол нэр. Record<Category, string> гэснээр Category-д
 * шинэ утга нэмэхэд энд нэр нэмэхийг compiler ШААРДАНА (exhaustiveness).
 */
export const CATEGORY_LABELS: Record<Category, string> = {
  electronics: "Электроник",
  food: "Хүнс",
  clothing: "Хувцас",
};

/** string утга Category мөн эсэхийг шалгаад, мөн бол төрлийг нарийсгана (type guard). */
export function isCategory(value: string): value is Category {
  return Object.hasOwn(CATEGORY_LABELS, value);
}

/**
 * "SKU,нэр,ангилал,тоо,үнэ,доод хэмжээ" гэсэн нэг CSV мөрийг Item болгон хувиргана.
 * Буруу мөр ирвэл ValidationError шидэж, ЯГ юу буруу байгааг хэлнэ.
 */
export function parseItemLine(line: string): Item {
  const parts = line.split(",").map((p) => p.trim());
  if (parts.length !== 6) {
    throw new ValidationError(`6 багана байх ёстой, ${parts.length} ирлээ: "${line}"`);
  }

  // noUncheckedIndexedAccess идэвхтэй тул parts[0] нь string | undefined.
  // Иймд ?? "" гэж default өгч, дараа нь хоосон эсэхийг шалгана.
  const sku = parts[0] ?? "";
  const name = parts[1] ?? "";
  const category = parts[2] ?? "";
  const quantity = Number(parts[3]);
  const unitPrice = Number(parts[4]);
  const minQuantity = Number(parts[5]);

  if (sku === "") throw new ValidationError("SKU хоосон байж болохгүй");
  if (name === "") throw new ValidationError(`"${sku}": нэр хоосон байна`);
  if (!isCategory(category)) {
    throw new ValidationError(`"${sku}": мэдэгдэхгүй ангилал "${category}"`);
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new ValidationError(`"${sku}": тоо ширхэг 0 буюу эерэг бүхэл тоо байх ёстой`);
  }
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    throw new ValidationError(`"${sku}": үнэ буруу "${parts[4]}"`);
  }
  if (!Number.isInteger(minQuantity) || minQuantity < 0) {
    throw new ValidationError(`"${sku}": доод хэмжээ буруу "${parts[5]}"`);
  }

  return { sku, name, category, quantity, unitPrice, minQuantity };
}

/** Нөөц нь доод хэмжээнээс бага барааг буцаана. */
export function findLowStock(items: readonly Item[]): Item[] {
  return items.filter((item) => item.quantity < item.minQuantity);
}

/** Агуулахад байгаа бүх барааны нийт үнэлгээ = Σ (тоо × нэгж үнэ). */
export function totalStockValue(items: readonly Item[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

/** Ангилал тус бүрийн тоо ширхэгийн нийлбэр. Map ашиглана: key = ангилал. */
export function quantityByCategory(items: readonly Item[]): Map<Category, number> {
  const result = new Map<Category, number>();
  for (const item of items) {
    const current = result.get(item.category) ?? 0;
    result.set(item.category, current + item.quantity);
  }
  return result;
}

/** SKU-гаар бараа хайна. Олдохгүй бол undefined (алдаа шидэхгүй – энэ нь "хэвийн" тохиолдол). */
export function findBySku(items: readonly Item[], sku: string): Item | undefined {
  return items.find((item) => item.sku === sku);
}
