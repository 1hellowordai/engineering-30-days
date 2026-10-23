// src/index.ts
// Программын орох цэг (entry point). Өгөгдлөө уншиж, тооцоолол хийж, үр дүнг хэвлэнэ.
import {
  parseItemLine,
  findLowStock,
  totalStockValue,
  quantityByCategory,
  findBySku,
  ValidationError,
  CATEGORY_LABELS,
  type Item,
} from "./inventory.js"; // NodeNext горимд import дээр .js өргөтгөл ЗААВАЛ бичнэ

// Бодит ажил дээр энэ өгөгдөл файл, database эсвэл API-аас ирнэ.
// Өнөөдөр санаатайгаар 1 буруу мөр оруулсан: алдааг хэрхэн барьж, тайлбарлахыг харуулна.
const rawLines = [
  "SKU-001, Laptop 14, electronics, 5, 2500000, 3",
  "SKU-002, Rice 25kg, food, 2, 95000, 10",
  "SKU-003, T-shirt L, clothing, 40, 25000, 20",
  "SKU-004, Mouse, electronics, 0, 35000, 5",
  "SKU-005, Jacket, clothes, 7, 120000, 2",     // "clothes" – буруу ангилал!
];

const items: Item[] = [];
const errors: string[] = [];

for (const line of rawLines) {
  try {
    items.push(parseItemLine(line));
  } catch (err) {
    // catch дотор err нь unknown төрөлтэй – ямар алдаа болохыг заавал шалгана.
    if (err instanceof ValidationError) {
      errors.push(err.message);
    } else {
      throw err; // бидний таамаглаагүй алдаа бол нуулгүй цааш шиднэ
    }
  }
}

console.log(`Амжилттай уншсан: ${items.length} бараа, алдаатай: ${errors.length} мөр`);
for (const e of errors) console.log("  ⚠ " + e);

console.log("\nДутагдалтай бараа:");
for (const item of findLowStock(items)) {
  console.log(`  ${item.sku} ${item.name}: ${item.quantity}/${item.minQuantity}`);
}

console.log(`\nНийт нөөцийн үнэлгээ: ${totalStockValue(items).toLocaleString("mn-MN")} ₮`);

console.log("\nАнгилал тус бүрийн тоо:");
for (const [category, qty] of quantityByCategory(items)) {
  console.log(`  ${CATEGORY_LABELS[category]} (${category}): ${qty}`);
}

const found = findBySku(items, "SKU-003");
console.log(`\nSKU-003 хайлт: ${found ? found.name : "олдсонгүй"}`);
