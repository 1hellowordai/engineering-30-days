# Day 1 – Тэмдэглэл

## (а) Өнөөдөр сурсан зүйл (өөрийн үгээр 5 өгүүлбэр)

1.
2.
3.
4.
5.

## (б) Даалгавар 1

Зөвхөн Category union-д "furniture" нэмсний дараа `npm run typecheck`:

```
src/inventory.ts(30,14): error TS2741: Property 'furniture' is missing in type '{ electronics: string; food: string; clothing: string; }' but required in type 'Record<Category, string>'.
```

Compiler CATEGORY_LABELS объектын мөрийг заасан. Record<Category, string> гэрээ нь
"Category-ийн утга бүрд нэг string" гэсэн тул union өөрчлөгдөхөд энд засах ёстойг
compiler өөрөө хэлж байна (exhaustiveness).

**"food"-ийг union-оос хасвал?** Туршиж үзсэн бодит үр дүн:

```
src/inventory.ts(32,3): error TS2353: Object literal may only specify known properties, and 'food' does not exist in type 'Record<Category, string>'.
```

- Compiler inventory.ts-ийн 32-р мөр, өөрөөр хэлбэл CATEGORY_LABELS доторх `food: "Хүнс"`
  мөрийг заасан. Union-д байхгүй түлхүүр Record-д байж болохгүй.
- index.ts-ийн rawLines доторх `"SKU-002, Rice 25kg, food, ..."` мөрийг compiler ОЛОХГҮЙ.
  Учир нь тэр мөр зүгээр л string. Compiler string-ийн дотор юу бичсэнийг уншдаггүй,
  зөвхөн төрлийг нь (string) хардаг. Тэр string Category болох эсэх нь runtime-д
  isCategory() шалгалтаар л шийдэгддэг.
- `npm run dev` юу хэлэх вэ? tsx төрөл шалгадаггүй тул программ ажиллана (type erasure:
  төрөл хөрвүүлсний дараа устдаг). Хэрэв CATEGORY_LABELS-аас ч food-ийг хасвал
  isCategory("food") false болж `Мөр 2: "SKU-002": мэдэгдэхгүй ангилал "food"` гэсэн
  runtime алдаа гарна. Compile-time-д баригдах ёстой байсан өөрчлөлт runtime-д
  өгөгдлийн алдаа болж хувирсан – яагаад аль болох олон алдааг compile-time руу
  шилжүүлэх ёстойн жишээ.

Хүлээгдэж буй үр дүн батлагдсан: `Дундаж нэгж үнэ: 663,750 ₮`
= (2,500,000 + 95,000 + 25,000 + 35,000) / 4.

## Даалгавар 2 – бодох асуулт

errors-ийг `string[]` биш `{ line: number; message: string }[]` болговол юу сайжрах вэ?

- Мөрийн дугаар тоо хэвээр үлдэнэ: дугаараар эрэмбэлэх, шүүх, "5-р мөр рүү үсрэх"
  товч хийх боломжтой. string болгосны дараа "Мөр 5: " гэдгийг буцааж задлах хэрэгтэй болно.
- Хэвлэх формат ("Мөр N: ...") нь логикоос (inventory.ts) салж index.ts буюу UI-ийн
  асуудал болно. Нэг л өгөгдлийг CLI, HTTP JSON, Excel тайлан гэх мэт өөр өөр
  хэлбэрээр харуулж болно.
- Тест бичихэд `errors[0].line === 5` гэж шууд шалгана, string-ийн дотор хайхгүй.
- Дараа нь `sku`, `field` гэх мэт талбар нэмэхэд бүтэц өргөжих боломжтой.

## (в) 11-р хэсгийн 6 асуултын хариу

1. Number("") яагаад аюултай вэ?
2. noUncheckedIndexedAccess асаагүй бол parts[7] ямар төрөлтэй вэ, runtime-д юу байх вэ?
3. findBySku яагаад undefined буцаадаг, parseItemLine яагаад throw хийдэг вэ?
4. Файл .ts байхад import дээр яагаад .js гэж бичдэг вэ?
5. catch (err) дотор err.message шууд бичвэл яагаад compiler зөвшөөрөхгүй вэ?
6. `TypeError: items.filter is not a function` – compile-time уу, runtime уу? `error TS2540` – аль нь вэ?

## (г) Ойлгоогүй 1 зүйл (тодорхой асуулт)

-
