import { db } from "../src/lib/db";

async function main() {
  console.log("🌱 Seeding cattery database...");

  // Clean existing data
  await db.booking.deleteMany();
  await db.blogPost.deleteMany();
  await db.review.deleteMany();
  await db.kitten.deleteMany();
  await db.litter.deleteMany();
  await db.producer.deleteMany();

  // ── 6 Producers (3 pairs) ──────────────────────────────────────────────
  const males = [
    {
      name: "Борис",
      role: "male",
      color: "black",
      colorLabel: "Чёрный",
      birthDate: "2020-04-12",
      imageUrl: "/images/producers/male-1-boris.jpg",
      bio: "Спокойный, как скала. Любит спать у батареи и наблюдать за household с высоты подоконника. Отец трёх помётов — все котята унаследовали его уравновешенность.",
      personality: "calm",
      hasTitles: true,
      titles: JSON.stringify(["Чемпион России", "Лучший кот года 2022 — региональный"]),
      registry: "WCF RU-2020-0412-М",
      testDate: "Март 2023",
    },
    {
      name: "Ярослав",
      role: "male",
      color: "tabby",
      colorLabel: "Дикий (табби)",
      birthDate: "2021-06-03",
      imageUrl: "/images/producers/male-2-yaroslav.jpg",
      bio: "Дикий окрас и характер исследователя. Любит прогулки по квартире и «охоту» на солнечные пятна. Игрив, но без агрессии — идеален для семей с детьми.",
      personality: "playful",
      hasTitles: true,
      titles: JSON.stringify(["Гран-Чемпион WCF"]),
      registry: "WCF RU-2021-0603-Я",
      testDate: "Февраль 2024",
    },
    {
      name: "Себастьян",
      role: "male",
      color: "silver",
      colorLabel: "Серебряный",
      birthDate: "2022-01-20",
      imageUrl: "/images/producers/male-3-sebastyan.jpg",
      bio: "Молодой серебряный кот с выразительными зелёными глазами. Пока без выставочных титулов — мы честно это обозначаем. Зато обладает исключительной лаской к людям.",
      personality: "affectionate",
      hasTitles: false,
      titles: JSON.stringify([]),
      registry: "WCF RU-2022-0120-С",
      testDate: "Январь 2024",
    },
  ];

  const females = [
    {
      name: "Мурка",
      role: "female",
      color: "black",
      colorLabel: "Чёрный",
      birthDate: "2020-09-08",
      imageUrl: "/images/producers/female-1-murka.jpg",
      bio: "Наша тихая мама. Вырастила два помёта, каждому котёнку уделяла внимание как собственному. Передаёт котятам спокойный нрав и крепкую конституцию.",
      personality: "calm",
      hasTitles: false,
      titles: JSON.stringify([]),
      registry: "WCF RU-2020-0908-М",
      testDate: "Март 2023",
    },
    {
      name: "Лейла",
      role: "female",
      color: "silver-red",
      colorLabel: "Серебряно-рыжий",
      birthDate: "2021-11-15",
      imageUrl: "/images/producers/female-2-leyla.jpg",
      bio: "Серебряно-рыжая красавица с тёплым характером. Обожает, когда её расчёсывают, и мурчит так, что слышно через стену. Мама самого ласкового помёта.",
      personality: "affectionate",
      hasTitles: true,
      titles: JSON.stringify(["Чемпион России"]),
      registry: "WCF RU-2021-1115-Л",
      testDate: "Февраль 2024",
    },
    {
      name: "Злата",
      role: "female",
      color: "tabby",
      colorLabel: "Дикий (табби)",
      birthDate: "2022-03-22",
      imageUrl: "/images/producers/female-3-zlata.jpg",
      bio: "Молодая дикая кошка с идеальным типом. Независима, но предана семье. Ещё не имела помётов — планируем первую вязку осенью.",
      personality: "independent",
      hasTitles: false,
      titles: JSON.stringify([]),
      registry: "WCF RU-2022-0322-З",
      testDate: "Январь 2024",
    },
  ];

  const producerData = [...males, ...females];
  const producers: Record<string, { id: string }> = {};
  for (const p of producerData) {
    const created = await db.producer.create({ data: p });
    producers[p.name] = created;
    console.log(`  ✓ Producer: ${p.name} (${p.colorLabel})`);
  }

  // ── Litters (2-3 per year) ─────────────────────────────────────────────
  const litters = [
    {
      name: "Помёт «Лето 2024»",
      fatherId: producers["Борис"].id,
      motherId: producers["Лейла"].id,
      bornAt: new Date("2024-06-15"),
      expected: false,
      notes: "4 котёнка: два серебряно-рыжих и два чёрных. Все социализированы в домашних условиях.",
    },
    {
      name: "Помёт «Зима 2024»",
      fatherId: producers["Ярослав"].id,
      motherId: producers["Мурка"].id,
      bornAt: new Date("2024-12-02"),
      expected: false,
      notes: "3 котёнка диких окрасов. Очень игривые, как папа.",
    },
    {
      name: "Помёт «Зима 2026» (ожидается)",
      fatherId: producers["Себастьян"].id,
      motherId: producers["Злата"].id,
      bornAt: new Date("2026-12-15"),
      expected: true,
      notes: "Ожидаем серебряных и серебряно-рыжих котят от Себастьяна и Златы. Запись в лист ожидания открыта.",
    },
  ];

  const litterMap: Record<string, string> = {};
  for (const l of litters) {
    const created = await db.litter.create({ data: l });
    litterMap[l.name] = created.id;
    console.log(`  ✓ Litter: ${l.name}`);
  }

  // ── Kittens ────────────────────────────────────────────────────────────
  const kittens = [
    // Лето 2024 litter
    {
      name: "Айсберг",
      color: "silver-red",
      colorLabel: "Серебряно-рыжий",
      gender: "male",
      personality: "calm",
      personalityLabel: "Спокойный",
      litterId: litterMap["Помёт «Лето 2024»"],
      birthDate: new Date("2024-06-15"),
      imageUrl: "/images/kittens/kitten-silver-red.jpg",
      status: "available",
      statusLabel: "Доступен",
      price: 65000,
      description: "Самый спокойный из помёта. Любит спать на коленях, не суетится при гостях. Идеален для семьи с маленькими детьми.",
      vaccinated: true,
      documented: true,
    },
    {
      name: "Янтарик",
      color: "silver-red",
      colorLabel: "Серебряно-рыжий",
      gender: "female",
      personality: "affectionate",
      personalityLabel: "Ласковый",
      litterId: litterMap["Помёт «Лето 2024»"],
      birthDate: new Date("2024-06-15"),
      imageUrl: "/images/kittens/kitten-silver-red.jpg",
      status: "available",
      statusLabel: "Доступна",
      price: 70000,
      description: "Невероятно ласковая девочка. Мурчит при первом прикосновении, идёт на руки к кому угодно. Подойдёт одинокому человеку на удалёнке.",
      vaccinated: true,
      documented: true,
    },
    {
      name: "Уголёк",
      color: "black",
      colorLabel: "Чёрный",
      gender: "male",
      personality: "playful",
      personalityLabel: "Игривый",
      litterId: litterMap["Помёт «Лето 2024»"],
      birthDate: new Date("2024-06-15"),
      imageUrl: "/images/kittens/kitten-black.jpg",
      status: "reserved",
      statusLabel: "Забронирован",
      price: 60000,
      description: "Игривый и любопытный чёрный котёнок. Обожает мячики и перья. Отличный компаньон для активного хозяина.",
      vaccinated: true,
      documented: true,
    },
    {
      name: "Ночка",
      color: "black",
      colorLabel: "Чёрный",
      gender: "female",
      personality: "independent",
      personalityLabel: "Независимый",
      litterId: litterMap["Помёт «Лето 2024»"],
      birthDate: new Date("2024-06-15"),
      imageUrl: "/images/kittens/kitten-black.jpg",
      status: "available",
      statusLabel: "Доступна",
      price: 58000,
      description: "Независимая, но преданная. Любит быть рядом, но не навязывается. Идеальна для опытного кошатника, который ценит личное пространство.",
      vaccinated: true,
      documented: true,
    },
    // Зима 2024 litter
    {
      name: "Барсик",
      color: "tabby",
      colorLabel: "Дикий (табби)",
      gender: "male",
      personality: "playful",
      personalityLabel: "Игривый",
      litterId: litterMap["Помёт «Зима 2024»"],
      birthDate: new Date("2024-12-02"),
      imageUrl: "/images/kittens/kitten-tabby.jpg",
      status: "available",
      statusLabel: "Доступен",
      price: 62000,
      description: "Дикий окрас, как у папы Ярослава. Энергичный исследователь квартиры. Подойдёт семье с детьми постарше.",
      vaccinated: false,
      documented: true,
    },
    {
      name: "Тигра",
      color: "tabby",
      colorLabel: "Дикий (табби)",
      gender: "female",
      personality: "affectionate",
      personalityLabel: "Ласковый",
      litterId: litterMap["Помёт «Зима 2024»"],
      birthDate: new Date("2024-12-02"),
      imageUrl: "/images/kittens/kitten-tabby.jpg",
      status: "available",
      statusLabel: "Доступна",
      price: 65000,
      description: "Ласковая дикая девочка с контрастным рисунком. Любит, когда её носят на руках как младенца.",
      vaccinated: false,
      documented: true,
    },
    {
      name: "Серебрянка",
      color: "silver",
      colorLabel: "Серебряный",
      gender: "female",
      personality: "calm",
      personalityLabel: "Спокойный",
      litterId: litterMap["Помёт «Зима 2024»"],
      birthDate: new Date("2024-12-02"),
      imageUrl: "/images/kittens/kitten-silver.jpg",
      status: "available",
      statusLabel: "Доступна",
      price: 72000,
      description: "Серебряная девочка с зелёными глазами. Очень спокойная, наблюдает за всем с достоинством. Редкий окрас.",
      vaccinated: false,
      documented: true,
    },
    // Expected litter Spring 2025
    {
      name: "Котёнок из помёта «Зима 2026» #1",
      color: "silver",
      colorLabel: "Серебряный",
      gender: "male",
      personality: "calm",
      personalityLabel: "Спокойный",
      litterId: litterMap["Помёт «Зима 2026» (ожидается)"],
      birthDate: new Date("2026-12-15"),
      imageUrl: "/images/kittens/kitten-silver.jpg",
      status: "expected",
      statusLabel: "Ожидается",
      price: 70000,
      description: "Ожидаемый котёнок от Себастьяна и Златы. Серебряный окрас. Запись в лист ожидания.",
      vaccinated: false,
      documented: true,
    },
    {
      name: "Котёнок из помёта «Зима 2026» #2",
      color: "silver-red",
      colorLabel: "Серебряно-рыжий",
      gender: "female",
      personality: "affectionate",
      personalityLabel: "Ласковый",
      litterId: litterMap["Помёт «Зима 2026» (ожидается)"],
      birthDate: new Date("2026-12-15"),
      imageUrl: "/images/kittens/kitten-silver-red.jpg",
      status: "expected",
      statusLabel: "Ожидается",
      price: 72000,
      description: "Ожидаемая серебряно-рыжая девочка. Запись в лист ожидания.",
      vaccinated: false,
      documented: true,
    },
  ];

  for (const k of kittens) {
    await db.kitten.create({ data: k });
  }
  console.log(`  ✓ ${kittens.length} kittens seeded`);

  // ── Reviews (graduates) ────────────────────────────────────────────────
  const reviews = [
    {
      authorName: "Анна и Максим",
      authorRole: "Семья с двумя детьми",
      kittenName: "Тимофей (выпускник 2023)",
      kittenColor: "Дикий (табби)",
      adoptedAt: "Осень 2023",
      rating: 5,
      text: "Искали спокойного кота, который терпит объятия детей. Тимофей — именно такой. Дочь носит его как плюшевую игрушку, он не царапается и мурчит. Заводчик отвечал на все вопросы даже спустя год. Это не «продали и забыли».",
      imageUrl: "/images/graduates/grad-3.jpg",
      featured: true,
    },
    {
      authorName: "Дмитрий",
      authorRole: "Удалённый разработчик",
      kittenName: "Симба (выпускник 2023)",
      kittenColor: "Чёрный",
      adoptedAt: "Зима 2023",
      rating: 5,
      text: "Работаю из дома, нужен был компаньон, который рядом, но не навязчив. Симба ложится у монитора и спит, пока я работаю. Генетические тесты производителей — в открытом доступе, это редкость. Рекомендую всем, кто ценит честность.",
      imageUrl: "/images/graduates/grad-1.jpg",
      featured: true,
    },
    {
      authorName: "Елена Петровна",
      authorRole: "Опытный кошатник, 3-я кошка",
      kittenName: "Алиса (выпускник 2022)",
      kittenColor: "Серебряный",
      adoptedAt: "Лето 2022",
      rating: 5,
      text: "Третья моя кошка, и впервые — с полностью прозрачной генетикой. HCM, PKDef, SMA — всё проверено, всё доступно. Алисе уже 2,5 года, ни одного намёка на проблему. Это и есть честный подход к разведению.",
      imageUrl: "/images/graduates/grad-2.jpg",
      featured: true,
    },
    {
      authorName: "Семья Ивановых",
      authorRole: "Семья с ребёнком-подростком",
      kittenName: "Маркиз (выпускник 2024)",
      kittenColor: "Серебряно-рыжий",
      adoptedAt: "Весна 2024",
      rating: 5,
      text: "Бронировали онлайн — это было неожиданно и удобно. Заводчик не торопил, дал подумать неделю. Маркиз приехал со всеми документами и прививками. Спокойный, ласковый, здоровый. Спасибо за честный подход.",
      imageUrl: null,
      featured: false,
    },
    {
      authorName: "Ольга",
      authorRole: "Одинокая, работает из дома",
      kittenName: "Зося (выпускник 2024)",
      kittenColor: "Дикий (табби)",
      adoptedAt: "Лето 2024",
      rating: 5,
      text: "Фильтр по характеру — гениальная вещь. Выбрала «независимый, но ласковый» и получила именно то, что хотела. Зося рядом, когда работаю, но не лезет на клавиатуру. Идеальный баланс.",
      imageUrl: null,
      featured: false,
    },
    {
      authorName: "Фёдор и Катя",
      authorRole: "Молодая пара, первый питомец",
      kittenName: "Бакс (выпускник 2024)",
      kittenColor: "Чёрный",
      adoptedAt: "Осень 2024",
      rating: 5,
      text: "Первый раз брали кота, очень боялись. Заводчик провёл с нами час по видеосвязи, показал помёт, родителей, тесты. Бакс — здоровье и спокойствие. Через месяц написали — ответили в тот же день.",
      imageUrl: null,
      featured: false,
    },
  ];

  for (const r of reviews) {
    await db.review.create({ data: r });
  }
  console.log(`  ✓ ${reviews.length} reviews seeded`);

  // ── Blog posts for SEO ─────────────────────────────────────────────────
  const posts = [
    {
      slug: "spokoyny-maine-coon-dlya-semi-s-detmi",
      title: "Как выбрать спокойного мейн-куна для семьи с детьми",
      excerpt: "Не все мейн-куны одинаковы. Рассказываем, на что смотреть при выборе котёнка для семьи с детьми — от характера родителей до ранней социализации.",
      content: `Когда семья с детьми ищет мейн-куна, чаще всего хотят одного — чтобы кот был крупным, но при этом спокойным. Не агрессивным, не пугливым, а терпеливым к объятиям, шуму и чужим рукам.

Первое, на что мы советуем смотреть, — это не окрас и не размер, а характер родителей. Спокойствие наследуется. Если мама котёнка пугается пылесоса и прячется под кроватью, вероятность, что котёнок будет таким же — высокая. Поэтому в нашем питомнике все производители прошли отбор именно по психике.

Второе — ранняя социализация. Первые 12 недель жизни котёнка формируют его отношение к людям на всю жизнь. Если в этот период котёнок рос в клетке и видел человека только при кормлении — он будет диким. Если рос в доме, среди детей, звуков телевизора и пылесоса — он будет домашним.

Третий признак — реакция на прикосновения. Спокойный котёнок не пытается убежать, когда его берут на руки. Он может немного напрячься, но потом расслабляется. Если котёнок шипит, царапается и вырывается — это не «характер», это страх.

Наш фильтр по характеру существует именно для этого: мы маркируем котят как «спокойный», «игривый», «независимый» или «ласковый» — и помогаем семье найти того, кто впишется в их ритм жизни, а не того, кто просто красив.

Главное правило: не берите котёнка импульсивно. Приезжайте, посмотрите, подержите. Хороший заводчик не торопит.`,
      category: "Выбор",
      readMinutes: 6,
      imageUrl: "/images/blog/blog-1.jpg",
    },
    {
      slug: "geneticheskie-testy-maine-coon-prosto",
      title: "Генетические тесты мейн-кунов: HCM, PKDef, SMA — что это и зачем",
      excerpt: "HCM, PKDef и SMA — три генетических заболевания, которые должны быть проверены у каждого производителя. Объясняем простыми словами, что значат буквы N/N и почему это важно.",
      content: `В карточках наших производителей вы видите три строчки: HCM, PKDef, SMA. Рядом — буквы N/N. Что это значит и почему мы публикуем это открыто?

HCM — гипертрофическая кардиомиопатия. Это утолщение стенок сердца, которое со временем приводит к сердечной недостаточности. У мейн-кунов есть наследственная форма, связанная с мутацией гена MYBPC3. Если кот несёт мутацию — он может заболеть. Если не несёт — не заболеет и не передаст потомству.

PKDef — дефицит пируваткиназы. Это форма анемии: эритроциты разрушаются быстрее, чем должны. Животное выглядит вялым, плохо набирает вес. Тоже наследственное.

SMA — спинальная мышечная атрофия. Дегенерация нервных клеток спинного мозга. Котёнок теряет координацию, мышцы слабеют. Прогрессирует медленно, но не лечится.

Буквы N/N означают «норма/норма» — мутации нет. N/HCM означало бы «носитель» — сам кот здоров, но может передать мутацию котятам. Поэтому производителей-носителей мы в разведение не используем.

Почему это важно для вас? Потому что котёнок от двух чистых (N/N) родителей гарантированно не получит этих заболеваний. Это не «вероятность 50%», а ноль.

Мы публикуем тесты всех шестерых производителей — и тех, кто с титулами, и тех, кто без. Потому что титул не гарантирует здоровье. А чистый генетический тест — гарантирует.`,
      category: "Здоровье",
      readMinutes: 8,
      imageUrl: "/images/blog/blog-3.jpg",
    },
    {
      slug: "kak-prohodit-socializaciya-kotyat",
      title: "Социализация котят: как мы готовим их к жизни в семье",
      excerpt: "Первые 12 недель жизни котёнка — самые важные. Рассказываем, как мы социализируем помёт в домашних условиях и почему это важнее выставочной стойки.",
      content: `Котёнок переезжает к новым хозяевам не раньше 12 недель. Это не наша прихоть — это срок, за который психика котёнка успевает сформироваться. Те, кто отдаёт котят в 6–8 недель, экономят на корме и времени. Мы — нет.

Первые две недели котёнок проводит с матерью. Она его кормит, греет, вылизывает. Человек только наблюдает и поддерживает температуру. Вмешиваться в этот период нельзя — стресс матери передаётся котятам.

С третьей недели начинается контакт с человеком. Мы берём каждого котёнка на руки, гладим, говорим с ним. Это закладывает базовое доверие: человек = тепло, еда, безопасность.

С пятой недели добавляем звуки. Телевизор, пылесос, стиральная машина, разговоры, смех. Котёнок должен привыкнуть к бытовому шуму и не пугаться его. Это критично для жизни в семье.

С седьмой недели — знакомство с разными поверхностями и предметами. Когтеточка, лоток, переноска, поводок (для будущего ветеринара). Игры с перьями, мячиками, интерактивными игрушками.

С десятой недели — гости. Мы приглашаем знакомых, чтобы котята видели новых людей. Если котёнок прячется — это нормально. Если шипит — уже нет.

К 12 неделям котёнок умеет: пользоваться лотком, точить когти о когтеточку (а не о диван), не бояться рук, спокойно переносить осмотр. Он готов к новой семье.

Это и есть социализация. Не выставочная стойка. Не ленточки. А котёнок, который не диктует семье свою повестку, а вписывается в неё.`,
      category: "Характер",
      readMinutes: 5,
      imageUrl: "/images/blog/blog-2.jpg",
    },
    {
      slug: "uhod-za-maine-coon-pervyi-god",
      title: "Уход за мейн-куном в первый год: чек-лист от заводчика",
      excerpt: "Кормление, груминг, прививки, ветеринар — короткий и честный чек-лист без маркетинга. То, что мы сами делаем со своими котами.",
      content: `Мейн-кун — крупная порода, и первый год у него особенный: котёнок растёт быстро, набирает мышечную массу, формируется характер. Вот что мы делаем со своими — и что советуем вам.

Кормление. До 6 месяцев — корм класса холистик для котят, 4 раза в день. С 6 до 12 месяцев — 3 раза в день, тот же класс. Никаких «специальных кормов для мейн-кунов» — это маркетинг. Важен класс корма, а не надпись на упаковке.

Вода. Мейн-куны любят проточную воду. Миска с фонтанчиком — не роскошь, а средство от болезней почек. Меняем воду каждый день.

Ветеринар. Первая прививка — ещё у нас, до переезда. Ревакцинация — в 16 недель у вашего врача. Далее — ежегодно. Чипирование — обязательно, делается при первой ревакцинации.

Груминг. Расчёсываем раз в неделю металлической расчёской с длинными зубьями. Купаем — только если испачкался, раз в 2–3 месяца. Когти стрижём раз в две недели.

Лоток. Размер — большой, мейн-куну нужен простор. Наполнитель — комкующийся, без запаха. Меняем полностью раз в неделю.

Движение. Мейн-куну нужно место. Если квартира маленькая — обязательны комплексы (полки, столбики). Минимум одна когтеточка высотой от 80 см.

Кастрация. Рекомендуем в 7–9 месяцев — это снижает риск опухолей и делает характер стабильнее. Племенных животных не кастрируем, но они — исключение.

Главное — не слушайте советы из интернета вслепую. У вас есть заводчик. Спрашивайте. Мы отвечаем и через год, и через пять.`,
      category: "Уход",
      readMinutes: 7,
      imageUrl: "/images/blog/blog-1.jpg",
    },
  ];

  for (const p of posts) {
    await db.blogPost.create({ data: { ...p, published: true } });
  }
  console.log(`  ✓ ${posts.length} blog posts seeded`);

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
