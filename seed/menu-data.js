// The printed Poca menu, in both languages, as the seed source of truth.
// Prices are in tögrög. MN copy still needs an owner proofread.

// The round tiles on the category picker. Delivered through Cloudinary with
// f_auto,q_auto,w_256 — they render at 64px, so 256 covers retina and keeps
// each one a few KB.
const tile = (name) =>
  `https://res.cloudinary.com/crbcsumf/image/upload/f_auto,q_auto,w_256,c_fill/poca-category-${name}`;

export const categories = [
  { key: "starter", kind: "food", order: 1, image: tile("starter"), name: { en: "Starter", mn: "Зууш" } },
  { key: "pizza", kind: "food", order: 2, image: tile("pizza"), name: { en: "Pizza", mn: "Пицца" } },
  { key: "sides", kind: "food", order: 3, image: tile("sides"), name: { en: "Side dishes", mn: "Хачир хоол" } },
  { key: "coffee", kind: "drink", order: 4, image: tile("coffee"), name: { en: "Coffee", mn: "Кофе" } },
  { key: "tea", kind: "drink", order: 5, image: tile("tea"), name: { en: "Tea", mn: "Цай" } },
  { key: "soft", kind: "drink", order: 6, image: tile("soft"), name: { en: "Soft drinks", mn: "Хөнгөн ундаа" } },
  { key: "beer", kind: "drink", order: 7, image: tile("beer"), name: { en: "Beer", mn: "Шар айраг" } },
  { key: "cocktails", kind: "drink", order: 8, image: tile("cocktails"), name: { en: "Cocktails", mn: "Коктейл" } },
  { key: "wine", kind: "drink", order: 9, image: tile("wine"), name: { en: "Wine", mn: "Дарс" } },
];

const GLASS = { en: "Glass", mn: "Хундага" };
const BOTTLE = { en: "Bottle", mn: "Шил" };

export const items = [
  // ── Starter ────────────────────────────────────────────────────────────
  {
    category: "starter",
    name: { en: "Bruschetta", mn: "Брускетта" },
    description: {
      en: "Three slices of toasted bread, fresh seasoned tomato, Parmigiano Reggiano, extra virgin olive oil",
      mn: "Шарсан талх 3 зүсэм, шинэхэн амталсан улаан лооль, Пармижано Режжиано, extra virgin чидун тос",
    },
    price: 12000,
  },

  // ── Pizza ──────────────────────────────────────────────────────────────
  {
    category: "pizza",
    name: { en: "Margherita", mn: "Маргарита" },
    description: {
      en: "Tomato sauce, Parmigiano Reggiano, basil, mozzarella, extra virgin olive oil",
      mn: "Улаан лоолийн соус, Пармижано Режжиано, базилик, моцарелла, extra virgin чидун тос",
    },
    price: 35000,
    tags: ["vegetarian"],
  },
  {
    category: "pizza",
    name: { en: "Pepperoni", mn: "Пепперони" },
    description: {
      en: "Tomato sauce, Parmigiano Reggiano, mozzarella, pepperoni, extra virgin olive oil",
      mn: "Улаан лоолийн соус, Пармижано Режжиано, моцарелла, пепперони, extra virgin чидун тос",
    },
    price: 43000,
    tags: ["spicy"],
  },
  {
    category: "pizza",
    name: { en: "Ventricina", mn: "Вентричина" },
    description: {
      en: "Tomato sauce, Parmigiano Reggiano, mozzarella, ventricina, 'Nduja, fresh chilli",
      mn: "Улаан лоолийн соус, Пармижано Режжиано, моцарелла, вентричина, 'Nduja, шинэ чилли",
    },
    price: 45000,
    tags: ["extra-spicy"],
  },
  {
    category: "pizza",
    name: { en: "Mortadella & Mushroom", mn: "Мортаделла ба мөөг" },
    description: {
      en: "Parmigiano Reggiano, mozzarella, mixed mushrooms, mortadella, pistachio, extra virgin olive oil",
      mn: "Пармижано Режжиано, моцарелла, холимог мөөг, мортаделла, писта, extra virgin чидун тос",
    },
    price: 45000,
    tags: ["white"],
  },
  {
    category: "pizza",
    name: { en: "Pear & Gorgonzola", mn: "Лийр ба горгонзола" },
    description: {
      en: "Parmigiano Reggiano, mozzarella, gorgonzola, pear, pecan nuts",
      mn: "Пармижано Режжиано, моцарелла, горгонзола, лийр, пекан самар",
    },
    price: 41000,
    tags: ["white"],
  },
  {
    category: "pizza",
    name: { en: "Vegetariana", mn: "Вегетариана" },
    description: {
      en: "Tomato sauce, Parmigiano Reggiano, basil, mozzarella, peppers, mushroom, artichokes, black olives, extra virgin olive oil",
      mn: "Улаан лоолийн соус, Пармижано Режжиано, базилик, моцарелла, чинжүү, мөөг, артишок, хар чидун, extra virgin чидун тос",
    },
    price: 40000,
    tags: ["vegetarian"],
  },
  {
    category: "pizza",
    name: { en: "Napoli", mn: "Наполи" },
    description: {
      en: "Tomato sauce, mozzarella, anchovies, capers, garlic, taggiasca olives, oregano",
      mn: "Улаан лоолийн соус, моцарелла, анчоус, каперс, сармис, таджиаска чидун, орегано",
    },
    price: 42000,
  },
  {
    category: "pizza",
    name: { en: "Capocollo", mn: "Капоколло" },
    description: {
      en: "Tomato sauce, mozzarella, capocollo, pepper, parsley, cherry tomato, Parmigiano Reggiano, extra virgin olive oil",
      mn: "Улаан лоолийн соус, моцарелла, капоколло, чинжүү, петрушка, черри лооль, Пармижано Режжиано, extra virgin чидун тос",
    },
    price: 56000,
  },
  {
    category: "pizza",
    name: { en: "Prosciutto", mn: "Прошутто" },
    description: {
      en: "Tomato sauce, mozzarella, rocket, prosciutto, cherry tomato, Parmigiano Reggiano, extra virgin olive oil",
      mn: "Улаан лоолийн соус, моцарелла, рукола, прошутто, черри лооль, Пармижано Режжиано, extra virgin чидун тос",
    },
    price: 65000,
  },

  // ── Side dishes ────────────────────────────────────────────────────────
  {
    category: "sides",
    name: { en: "Focaccia", mn: "Фокачча" },
    description: {
      en: "Freshly baked in our pizza oven, rosemary, sea salt, extra virgin olive oil",
      mn: "Пиццаны зууханд шинэхэн шарсан, розмарин, далайн давс, extra virgin чидун тос",
    },
    price: 10000,
    tags: ["vegetarian"],
  },
  {
    category: "sides",
    name: { en: "Garlic Focaccia", mn: "Сармистай фокачча" },
    description: {
      en: "Freshly baked in our pizza oven, garlic butter, sea salt",
      mn: "Пиццаны зууханд шинэхэн шарсан, сармисан цөцгийн тос, далайн давс",
    },
    price: 12000,
    tags: ["vegetarian"],
  },
  {
    category: "sides",
    name: { en: "Fresh Salad", mn: "Шинэхэн салат" },
    description: {
      en: "Cherry tomato, rocket, Parmigiano Reggiano, sea salt, pepper, extra virgin olive oil",
      mn: "Черри лооль, рукола, Пармижано Режжиано, далайн давс, чинжүү, extra virgin чидун тос",
    },
    price: 12000,
    tags: ["vegetarian"],
  },
  {
    category: "sides",
    name: { en: "Baked Potato", mn: "Шарсан төмс" },
    description: {
      en: "Wood-roasted potatoes with rosemary and salt",
      mn: "Түлээний галд шарсан төмс, розмарин, давс",
    },
    price: 9000,
    tags: ["vegetarian"],
  },

  // ── Coffee ─────────────────────────────────────────────────────────────
  { category: "coffee", name: { en: "Espresso", mn: "Эспрессо" }, price: 8000 },
  { category: "coffee", name: { en: "Macchiato", mn: "Маккиато" }, price: 9000 },
  { category: "coffee", name: { en: "Americano", mn: "Американо" }, price: 9000 },
  { category: "coffee", name: { en: "Cappuccino", mn: "Капучино" }, price: 10000 },
  { category: "coffee", name: { en: "Latte", mn: "Латте" }, price: 10000 },
  { category: "coffee", name: { en: "Vanilla Latte", mn: "Ванильтай латте" }, price: 11000 },
  { category: "coffee", name: { en: "Hazelnut Latte", mn: "Функтэй латте" }, price: 11000 },
  { category: "coffee", name: { en: "Caramel Latte", mn: "Карамельтай латте" }, price: 11000 },
  { category: "coffee", name: { en: "Orange Espresso", mn: "Жүржтэй эспрессо" }, price: 12000 },
  { category: "coffee", name: { en: "Matcha Latte", mn: "Матча латте" }, price: 14000 },
  { category: "coffee", name: { en: "Affogato", mn: "Аффогато" }, price: 15000 },
  { category: "coffee", name: { en: "Oat Milk Latte", mn: "Овъёосны сүүтэй латте" }, price: 16000 },
  { category: "coffee", name: { en: "Honey Milk", mn: "Зөгийн балтай сүү" }, price: 8000 },
  { category: "coffee", name: { en: "Hot Chocolate", mn: "Халуун шоколад" }, price: 9000 },

  // ── Tea ────────────────────────────────────────────────────────────────
  {
    category: "tea",
    name: { en: "Ginger & Lemon Tea", mn: "Цагаан гаа, нимбэгний цай" },
    description: { en: "Served by the cup", mn: "Аягаар" },
    price: 8000,
  },
  {
    category: "tea",
    name: { en: "Hibiscus Tea", mn: "Гибискусын цай" },
    description: { en: "Served by the pot", mn: "Данхаар" },
    price: 12000,
  },
  {
    category: "tea",
    name: { en: "Earl Grey", mn: "Эрл Грей" },
    description: { en: "Served by the pot", mn: "Данхаар" },
    price: 16000,
  },
  {
    category: "tea",
    name: { en: "Pomegranate", mn: "Анарын цай" },
    description: { en: "Served by the pot", mn: "Данхаар" },
    price: 16000,
  },

  // ── Soft drinks ────────────────────────────────────────────────────────
  {
    category: "soft",
    name: { en: "Still Water", mn: "Энгийн ус" },
    description: { en: "0.5 L", mn: "0.5 л" },
    price: 6000,
  },
  {
    category: "soft",
    name: { en: "Sparkling Water", mn: "Хийтэй ус" },
    description: { en: "0.5 L", mn: "0.5 л" },
    price: 6000,
  },
  { category: "soft", name: { en: "Coke Original", mn: "Кока-Кола" }, price: 9000 },
  {
    category: "soft",
    name: { en: "Asahi Craft Cola", mn: "Asahi крафт кола" },
    description: {
      en: "Mitsuya Craft Cola, 350 ml — citrus and ten spices with shiso and sanshō pepper",
      mn: "Mitsuya Craft Cola, 350 мл — цитрус, арван төрлийн амтлагч, шисо, саншё чинжүү",
    },
    price: 9000,
  },
  { category: "soft", name: { en: "Sprite", mn: "Спрайт" }, price: 9000 },
  { category: "soft", name: { en: "Orange Juice", mn: "Жүржний шүүс" }, price: 9000 },
  { category: "soft", name: { en: "Apple Juice", mn: "Алимны шүүс" }, price: 9000 },
  { category: "soft", name: { en: "Pineapple Juice", mn: "Хан борын шүүс" }, price: 9000 },

  // ── Beer ───────────────────────────────────────────────────────────────
  {
    category: "beer",
    name: { en: "Corona Extra", mn: "Corona Extra" },
    description: { en: "0.33 L bottle", mn: "0.33 л шил" },
    price: 14000,
  },
  {
    category: "beer",
    name: { en: "Altan Gobi", mn: "Алтан Говь" },
    description: { en: "0.5 L can", mn: "0.5 л лааз" },
    price: 15000,
  },
  {
    category: "beer",
    name: { en: "Asahi Super Dry", mn: "Asahi Super Dry" },
    description: { en: "0.5 L can", mn: "0.5 л лааз" },
    price: 15000,
  },

  // ── Cocktails (all 15% ABV) ────────────────────────────────────────────
  { category: "cocktails", name: { en: "Tom Collins", mn: "Том Коллинз" }, price: 25000 },
  { category: "cocktails", name: { en: "Gin Tonic", mn: "Жин тоник" }, price: 25000 },
  { category: "cocktails", name: { en: "Americano", mn: "Американо" }, price: 27000 },
  { category: "cocktails", name: { en: "Aperol Spritz", mn: "Апероль шприц" }, price: 30000 },
  { category: "cocktails", name: { en: "Negroni", mn: "Негрони" }, price: 30000 },
  { category: "cocktails", name: { en: "Espresso Martini", mn: "Эспрессо мартини" }, price: 35000 },

  // ── Wine (glass / bottle) ──────────────────────────────────────────────
  {
    category: "wine",
    name: { en: "Castello Montauto Chianti", mn: "Castello Montauto Chianti" },
    description: { en: "Red", mn: "Улаан" },
    variants: [
      { label: GLASS, price: 22000 },
      { label: BOTTLE, price: 100000 },
    ],
  },
  {
    category: "wine",
    name: { en: "Prendo Pinot Noir", mn: "Prendo Pinot Noir" },
    description: { en: "Red", mn: "Улаан" },
    variants: [
      { label: GLASS, price: 27000 },
      { label: BOTTLE, price: 125000 },
    ],
  },
  {
    category: "wine",
    name: { en: "Boggero Tutti Frutti Barbera", mn: "Boggero Tutti Frutti Barbera" },
    description: { en: "Red", mn: "Улаан" },
    variants: [
      { label: GLASS, price: 29000 },
      { label: BOTTLE, price: 135000 },
    ],
  },
  {
    category: "wine",
    name: { en: "Walch Prendo Pinot Grigio", mn: "Walch Prendo Pinot Grigio" },
    description: { en: "White", mn: "Цагаан" },
    variants: [
      { label: GLASS, price: 29000 },
      { label: BOTTLE, price: 130000 },
    ],
  },
  {
    category: "wine",
    name: { en: "Banfi Le Rime Pinot Grigio", mn: "Banfi Le Rime Pinot Grigio" },
    description: { en: "White", mn: "Цагаан" },
    variants: [
      { label: GLASS, price: 32000 },
      { label: BOTTLE, price: 140000 },
    ],
  },
  {
    category: "wine",
    name: { en: "CORMONS Malvasia", mn: "CORMONS Malvasia" },
    description: { en: "White", mn: "Цагаан" },
    variants: [
      { label: GLASS, price: 35000 },
      { label: BOTTLE, price: 145000 },
    ],
  },
  {
    category: "wine",
    name: { en: "Sprintoso Moscato", mn: "Sprintoso Moscato" },
    description: { en: "Sparkling", mn: "Хөөстэй" },
    variants: [{ label: BOTTLE, price: 100000 }],
  },
];
