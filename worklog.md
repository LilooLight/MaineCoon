# Worklog — Питомник мейн-кунов «Тихий Дом»

---
Task ID: main-build
Agent: Z.ai Code (main orchestrator)
Task: Построить production-ready сайт семейного питомника мейн-кунов «Тихий Дом» на Next.js 16 с честным позиционированием, открытыми генетическими тестами, фильтром по характеру и онлайн-бронированием.

Work Log:
- Изучил структуру Next.js 16 проекта (App Router, Tailwind v4, shadcn/ui, Prisma + SQLite).
- Настроил дизайн-систему в `src/app/globals.css`: тёплая палитра (молочный фон #FBF8F3, шалфейный primary #4A6B57, песочный secondary #C9A77C, терракотовый accent #B86B4B), тёмная тема, кастомный скроллбар, анимации blur-fade и marquee, paw-pattern фон.
- Подключил шрифты Cormorant Garamond (serif, заголовки) + Manrope (sans, текст) в `layout.tsx`, обновил SEO-метаданные на русском, добавил JSON-LD Breeder schema.
- Создал Prisma-схему (`prisma/schema.prisma`): модели Producer (с генетическими тестами HCM/PKDef/SMA), Litter, Kitten (с personality-фильтром), Review, BlogPost, Booking. Применил через `bun run db:push`.
- Сидировал базу (`prisma/seed.ts`): 6 производителей (3 пары, 3 с титулами / 3 без — честный подход), 3 помёта, 9 котят (4 окраса, 4 характера), 6 отзывов-выпускников, 4 SEO-статьи.
- Сгенерировал 14 тёплых «домашних» изображений через z-ai image CLI (hero, about, family, 6 производителей, 4 окраса котят, 3 выпускника, 3 блога).
- Создал 6 API-роутов: `/api/kittens` (с фильтрами color/gender/personality/status), `/api/producers`, `/api/reviews`, `/api/blog`, `/api/bookings` (POST с валидацией), `/api/stats`.
- Построил фронтенд в `src/components/cattery/`: Header (sticky, мобильное меню Sheet), Hero (статистика + плавающие карточки), About (честное позиционирование + 4 дифференциатора), Producers (tabs коты/кошки + диалог с генетическими тестами), KittensCatalog (фильтры окрас/пол/характер/статус + карточки + детальный диалог + бронирование), Reviews (featured + compact), Blog (featured + список), FAQ (accordion), FinalCTA, Footer (sticky через flex min-h-screen flex-col + mt-auto), BookingDialog (с валидацией и success-state).
- Использовал BookingContext для модального окна бронирования, открываемого из любой карточки котёнка.
- Проверил `bun run lint` — чисто, без ошибок.
- Самопроверка через agent-browser: страница рендерится без ошибок, все API возвращают 200/201, фильтр по характеру «Спокойный» → «Найдено: 3 котят, из них 2 доступно», диалог производителя показывает HCM/PKDef/SMA = N/N, форма бронирования отправляется и сохраняется в БД, мобильное меню работает на 390×844.

Stage Summary:
- Сайт полностью функционален и протестирован end-to-end.
- Ключевые дифференциаторы реализованы: ① открытые генетические тесты в карточках производителей, ② фильтр по характеру (calm/playful/independent/affectionate) — уникальная функция, ③ онлайн-бронирование + лист ожидания, ④ честное позиционирование (3 из 6 без титулов — не скрывается).
- SEO: русские метаданные, JSON-LD, блог под информационные запросы, semantic HTML (header/main/section/footer), ARIA.
- Дизайн: тёплая палитра (шалфейный/песочный/терракотовый), serif-заголовки, sticky-футер, мобильная адаптивность, blur-fade анимации.
- Известный минорный нюанс: консольное предупреждение Radix "Missing Description for DialogContent" (не блокирующее, accessibility sr-only заголовки присутствуют).

Unresolved issues / next steps:
- (minor) Радикс-предупреждение про aria-describedby в диалогах — можно починить, явно проставив aria-describedby.
- Можно добавить больше деталей в карточки котят (видео-превью 30с).
- Блог-статьи сейчас сокращённые — можно развернуть полноценный контент.
- Можно добавить страницу/секцию «Выставочные звёзды» для 3 титулованных производителей.
- Можно добавить real-time обновление наличия котят через WebSocket.

---
Task ID: cron-round-2
Agent: Z.ai Code (cron webDevReview — round 2)
Task: QA через agent-browser, исправление багов и добавление новых фич/стилей для питомника «Тихий Дом».

Work Log:
- Прочитал worklog.md, оценил статус: проект стабилен, lint чист, dev-сервер работает, все API → 200.
- QA через agent-browser: открыл страницу (1440×900), проверил ошибки/консоль — чисто (предыдущее предупреждение Radix про aria-describedby уже не появляется, т.к. sr-only DialogHeader/Description работает). Тестировал: tabs коты/кошки, диалог производителя (HCM/PKDef/SMA = N/N), фильтр «Спокойный» → «Найдено: 3 котят, из них 2 доступно».
- Добавил систему scroll-reveal анимаций: хук `useScrollReveal` (IntersectionObserver, уважает prefers-reduced-motion) + компонент `Reveal` (blur-fade с задержкой для staggered-групп, 4 направления).
- Создал **PersonalityQuiz** — интерактивный подбор характера котёнка по образу жизни (5 вопросов: домохозяйство, присутствие, темп, что важнее, опыт). Подсчёт баллов → рекомендация одного из 4 темпераментов с описанием + CTA «Показать таких котят» (через CustomEvent `cattery:setFilter` каталог слушает и применяет фильтр автоматически). Это ключевая новая фича, усиливающая дифференциатор «фильтр по характеру».
- Обновил `KittensCatalog`: добавил слушатель `cattery:setFilter` для приёма результата квиза.
- Создал **BookingProcess** — секция «Как проходит бронирование» с 4-шаговым таймлайном (Заявка → Звонок заводчика → Знакомство → Бронь) с пронумерованными иконками, соединяющей линией на десктопе и честной заметкой о возврате задатка.
- Создал **ShowChampions** — секция «Выставочные звёзды» для 3 титулованных производителей с SpotlightCard (hover-подсветка курсора), чипами наград и мягким декоративным glow.
- Создал **TrustMarquee** — бегущая строка доверия (8 сигналов: пожизненная поддержка, открытые гены, не конвейер, социализация, 20+ выпускников и т.д.) на primary-фоне.
- Создал **BackToTop** — плавающая кнопка «Наверх» + top scroll-progress bar (градиент primary→secondary→accent), появляется после 80% viewport, уважает reduced-motion.
- Создал **SpotlightCard** — MagicUI-style обёртка с radial-gradient подсветкой курсора через CSS-переменные + mousemove (без внешних зависимостей). Применил к карточкам котят и чемпионов.
- Расширил контент блога: переписал `prisma/seed.ts` — 4 статьи теперь содержат полноценный многоабзацный контент (HCM/PKDef/SMA простыми словами, социализация по неделям, чек-лист ухода, выбор для семьи). Пересидировал БД.
- Обновил `blog.tsx`: добавил reading dialog с полным текстом статьи, изображением-обложкой, мета (мин чтения, автор), кастомной кнопкой закрытия, custom-scroll.
- Обновил `page.tsx`: добавил новые секции в логичный порядок (Hero → TrustMarquee → About → Producers → ShowChampions → PersonalityQuiz → KittensCatalog → BookingProcess → Reviews → Blog → FAQ → FinalCTA).
- Дополнил `globals.css`: стили для `.prose-content` (отступы между абзацами), `.fixed-top-bar`, fallback для prefers-reduced-motion (отключает анимации).
- ESLint: поймал ошибку `set-state-in-effect` в useScrollReveal (setState в эффекте для reduced-motion) → исправил, вынеся проверку prefers-reduced-motion в `useState` initializer. Lint теперь чист.
- Финальная QA через agent-browser: всё работает — квиз проходит 5 вопросов → результат «Спокойный» → кнопка «Показать таких котят» скроллит к каталогу и применяет фильтр (Найдено: 3 котят), блог-диалог открывает полную статью, back-to-top появляется на скролле, mobile (390×844) адаптивность сохранена, бронирование работает на мобильном. 0 ошибок в консоли.

Stage Summary:
- Добавлено 6 новых компонентов: PersonalityQuiz, BookingProcess, ShowChampions, TrustMarquee, BackToTop, SpotlightCard + система Reveal (hook + wrapper).
- Ключевая новая фича: **интерактивный подбор характера** (quiz) — усиливает уникальный дифференциатор «фильтр по характеру» и направляет пользователя в каталог с применённым фильтром.
- Стиль: scroll-reveal анимации на секциях, cursor-spotlight на карточках, scroll-progress bar, бегущая строка доверия, улучшенный блог с reading dialog.
- Контент: 4 SEO-статьи развёрнуты до полноценных текстов (5–8 мин чтения каждая).
- Технический долг: радикс-предупреждение уже устранено (sr-only подход работает).

Unresolved issues / next steps (приоритеты для следующего раунда):
- (medium) Добавить 30-секундные видео-превью поведения котят (генерация через video-understanding skill или встроенные <video> с placeholder).
- (medium) Добавить real-time обновление наличия котят через WebSocket (mini-service на socket.io, порт 3003).
- (low) Кнопка «Сравнить котят» — выбрать 2–3 котёнка и сравнить характер/окрас/цену бок о бок.
- (low) Тёмная тема toggle в шапке (next-themes уже установлен).
- (low) Lazy-loading изображений с blur-placeholder (next/image placeholder=blur).
- (low) Open Graph image + favicon, сгенерированные под бренд «Тихий Дом».
- (low) Sitemap.xml + robots.txt для SEO.

---
Task ID: cron-round-3
Agent: Z.ai Code (cron webDevReview — round 3)
Task: QA через agent-browser, исправление багов и добавление новых фич/стилей для питомника «Тихий Дом».

Work Log:
- Прочитал worklog.md, оценил статус: проект стабилен после раунда 2, lint чист, dev-сервер работает, все API → 200.
- QA через agent-browser (1440×900): проверил все секции, диалоги, квиз — 0 ошибок и предупреждений в консоли. Все заголовки на месте.
- **Тёмная тема**: создал `ThemeProvider` (next-themes) + `ThemeToggle` (кнопка с анимированной сменой Sun/Moon). Обернул приложение в ThemeProvider в layout.tsx, theme="class", defaultTheme="light", enableSystem. Тёмная палитра уже была в globals.css (зелёно-серый фон, песочный/терракотовый акценты). Кнопка добавлена в шапку (десктоп + мобильное меню).
- **Избранное (wishlist)**: создал хук `useFavorites` (localStorage + кастомное событие для same-tab синхронизации) с lazy useState-инициализатором (избежал setState-in-effect). Создал `FavoritesPanel` — slide-over с мини-карточками избранных котят, кнопками «Забронировать» и «Убрать», счётчиком, empty-state. Кнопка-сердечко добавлена на каждую карточку котёнка (с toast-уведомлением). Бейдж со счётчиком в шапке (десктоп + мобильный).
- **Сравнение котят**: создал `CompareProvider` (контекст, макс. 3 котёнка) + `CompareBar` (плавающая панель внизу с миниатюрами выбранных, кнопкой «Сравнить» и очисткой). Создал comparison-диалог — горизонтальная таблица (sticky первая колонка с названиями параметров: Фото, Имя, Статус, Окрас, Пол, Характер, Возраст, Привит, Цена + строка с CTA). Кнопка-compare добавлена на каждую карточку котёнка с toast и ограничением «максимум 3».
- **Галерея котёнка**: рефакторил `KittenDialog` — вынес контент в `KittenDialogContent` с `key={kitten.id}` (React-idiomatic сброс состояния через key вместо setState-in-effect). Галерея: основное фото котёнка + фото родителей (как «семейные» ракурсы) с миниатюрами внизу, переключение по клику.
- **SEO-бренд**: сгенерировал OG-изображение (1344×768, тёплый мейн-кун с negative space) и favicon (SVG paw print + house в фирменных цветах). Создал `manifest.json` (theme_color #4A6B57, background #FBF8F3). Добавил `metadataBase`, icons, openGraph.images, twitter.images в layout.tsx.
- **SEO-роуты**: создал `src/app/sitemap.ts` (8 секций с приоритетами) и `src/app/robots.ts` (allow all + sitemap URL).
- **useIsMounted**: создал хук через `useSyncExternalStore` (server snapshot false, client snapshot true) — самый чистый способ определить клиентский рендер без setState-in-effect и без hydration mismatch.
- ESLint: поймал 5 ошибок `set-state-in-effect` (theme-toggle, use-favorites, kittens-catalog gallery reset, favorites-panel, compare-bar) → исправил: useSyncExternalStore для mounted, lazy useState-инициализаторы для localStorage, key-based remount для галереи, microtask для setLoading, derived visible для compare-bar. Lint теперь чист (0 ошибок).
- Финальная QA через agent-browser: всё работает end-to-end — избранное добавляется/показывается в slide-over с бейджем в шапке, сравнение 2 котят открывает таблицу с фото/именами/характером/ценой, галерея котёнка переключает фото с родителями, тёмная тема переключается (0 ошибок в консоли в обоих режимах), мобильная адаптация (390×844) сохранена для всех новых фич.

Stage Summary:
- Добавлено 5 новых компонентов: ThemeToggle, FavoritesPanel, CompareProvider+CompareBar+CompareDialog, KittenGallery (внутри KittenDialog), ThemeProvider + хуки useFavorites/useIsMounted.
- Ключевые новые фичи: ① тёмная тема (toggle в шапке), ② избранное с localStorage и slide-over, ③ сравнение котят (до 3) с таблицей, ④ галерея фото котёнка+родители, ⑤ SEO-бренд (OG image, favicon, manifest, sitemap, robots).
- Техническое качество: все паттерны React 19-совместимые (без setState-in-effect, useSyncExternalStore для mounted, key-based reset), lint чист, 0 консольных ошибок.

Unresolved issues / next steps (приоритеты для следующего раунда):
- (medium) 30-секундные видео-превью поведения котят (video-understanding skill или <video> с placeholder).
- (medium) Real-time обновление наличия котят через WebSocket (mini-service socket.io, порт 3003).
- (low) Lazy-loading изображений с blur-placeholder (next/image placeholder=blur — нужны сгенерированные blur data URLs).
- (low) Страница статьи блога по slug (отдельный маршрут /blog/[slug]) вместо диалога — лучше для SEO.
- (low) Анимация появления карточек котят при фильтрации (staggered fade).
- (low) Cookie-баннер (GDPR/152-ФЗ) — пока не реализован.
- (low) Интеграция с реальным мессенджером (WhatsApp/Telegram) через API для автоматизации ответов.

---
Task ID: cron-round-4
Agent: Z.ai Code (cron webDevReview — round 4)
Task: QA через agent-browser, исправление багов и добавление новых фич/стилей для питомника «Тихий Дом».

Work Log:
- Прочитал worklog.md, оценил статус: проект стабилен после раунда 3, lint чист, dev-сервер работает, все API → 200.
- QA через agent-browser (1440×900): проверил все секции — 0 ошибок в консоли, 53 заголовка на странице, все 9 основных секций рендерятся.
- **Страницы статей блога (/blog/[slug])**: создал server-component страницу с SSG (`generateStaticParams` + `generateMetadata`). Создал API `/api/blog/[slug]` (возвращает статью + related). Страница включает: мини-хедер, breadcrumb, обложку, lead-абзац, полный контент разбитый по абзацам, CTA-блок, похожие статьи, footer, back-to-top. JSON-LD Article schema для SEO. Обновил `blog.tsx` на главной: карточки теперь `<Link href="/blog/[slug]">` вместо диалога — лучше для SEO и индексации.
- **Cookie-баннер (152-ФЗ)**: создал `CookieConsent` компонент — появляется через 1.5с если нет решения в localStorage, с двумя кнопками («Принять все» / «Только необходимые»), toast-уведомлениями, кнопкой закрытия. Добавлен глобально в layout.tsx (показывается на всех страницах включая статьи блога). Текст про 152-ФЗ и виды cookie.
- **WebSocket mini-service**: создал `mini-services/availability-service/` (bun + socket.io, порт 3003). Health-check endpoint, события `availability:snapshot` (онлайн-зрители), `availability:event` (stats-update, kitten:viewing broadcast). Демо-события каждые 45с. Запущен в фоне через `setsid bun run dev`.
- **LiveAvailability компонент**: подключается к `/?XTransformPort=3003` (через Caddy gateway), показывает live-индикатор «В эфире» с пульсирующей точкой, счётчик онлайн-зрителей, последние события. Graceful degradation — показывает «Соединение...» если WS недоступен (в локальном dev без gateway). Добавлен в каталог котят над фильтрами.
- **Litter Timeline секция**: создал API `/api/litters` (с родителями и счётчиком available). Создал `LitterTimeline` — вертикальный timeline с date-маркерами (кружки с датой), карточками помётов, мини-фото родителей (Отец × Мать), badge «Ожидается» для будущих, счётчиком «котят в помёте» и «доступно», CTA «Записаться в лист ожидания» для ожидаемых. Добавил в page.tsx между KittensCatalog и BookingProcess, добавил ссылку «Помёты» в навигацию.
- **Staggered fade анимация**: добавил keyframe `kitten-card-in` в globals.css, обернул карточки котят в div с `kitten-card-enter` классом и animationDelay по индексу (макс 8 × 60мс). Key на filter-state заставляет React перемонтировать grid при смене фильтров → анимация проигрывается заново.
- **Стилевые улучшения**: добавил в globals.css — `.text-gradient-warm` (градиентный текст primary→secondary→accent), `.card-lift` (hover translateY), `.section-divider`, `.blob` (декоративные blur-пятна), `kitten-card-enter` анимация, `prefers-reduced-motion` fallback для новых анимаций.
- **Next.js scroll-behavior fix**: добавил `data-scroll-behavior="smooth"` на `<html>` и ограничил CSS правило `html[data-scroll-behavior="smooth"]` — устраняет предупреждение Next.js о smooth scroll при route transitions.
- Финальная QA: lint чист (0 ошибок), dev-сервер + availability-service работают (оба порта 3000 и 3003 слушают), страница блога `/blog/geneticheskie-testy-maine-coon-prosto` рендерится с полным контентом (HCM, PKDef, SMA, N/N объяснения), cookie-баннер появляется и исчезает после принятия, litter timeline показывает 3 помёта с правильными статусами, мобильная адаптация (390×844) сохранена.

Stage Summary:
- Добавлено 4 новых компонента: BlogArticlePage (server component, SSG), CookieConsent (152-ФЗ), LitterTimeline, LiveAvailability + WebSocket mini-service.
- 2 новых API-роута: `/api/blog/[slug]`, `/api/litters`.
- 1 новый mini-service: availability-service (socket.io, порт 3003) с real-time событиями.
- Ключевые новые фичи: ① dedicated blog article pages (SEO-оптимизированные, SSG, JSON-LD Article), ② cookie consent (152-ФЗ compliance), ③ real-time availability через WebSocket, ④ litter timeline с хронологией помётов, ⑤ staggered fade анимация карточек.
- Техническое качество: server components для SEO, SSG для статей, lint чист, 0 runtime ошибок.

Unresolved issues / next steps (приоритеты для следующего раунда):
- (medium) 30-секундные видео-превью поведения котят (video-understanding skill или <video> с placeholder).
- (low) Lazy-loading изображений с blur-placeholder (next/image placeholder=blur).
- (low) Админ-панель для заводчика (управление котятами/помётами/броном) — пока только БД.
- (low) Интеграция с реальным мессенджером (WhatsApp/Telegram) через API.
- (low) Страница 404 кастомная (собака/кот не найден).
- (low) Аналитика просмотров статей (при согласии cookie).

---
Бонус (в рамках того же раунда):
- Обновил `sitemap.ts` — теперь динамически включает все опубликованные статьи блога (`/blog/[slug]`) с updatedAt и priority 0.8. Проверено: sitemap.xml содержит все 4 статьи + 9 секций главной страницы. SEO полностью настроен.

---
Task ID: cron-round-5
Agent: Z.ai Code (cron webDevReview — round 5)
Task: QA через agent-browser, исправление багов и добавление новых фич/стилей для питомника «Тихий Дом».

Work Log:
- Прочитал worklog.md, оценил статус: проект стабилен после раунда 4, lint чист, dev-сервер работает, все API → 200.
- Обнаружил: availability-service (WebSocket, порт 3003) упал — перезапустил через `setsid bun run dev`.
- QA через agent-browser (1440×900): все 10 секций рендерятся, 0 ошибок в консоли, блог-статья `/blog/geneticheskie-testy-maine-coon-prosto` работает с полным контентом.
- **Секция «Заводчик» (BreederIntro)**: сгенерировал портрет заводчика (тёплое фото с мейн-куном). Создал компонент с: фото + плавающая карточка-подпись (Мария Тихонова, основатель), личная история, 4 ценности-карточки («Не менеджер 24/7, а человек», «Поддержка на всю жизнь», «Честность важнее продажи», «Учу, а не отдаю»), CTA «Позвонить Марии» / «Написать в WhatsApp». Добавил ссылку «Заводчик» в навигацию.
- **ExpectedCountdown**: создал live-обратный отсчёт до рождения ожидаемого помёта. Дни/часы/минуты/секунды в карточках с tabular-nums, обновление каждую секунду через derived state (без setState-in-effect — использую `now` state для re-render). Состояние «Помёт родился!» когда дата прошла. Обновил seed: помёт «Зима 2026» (ожидается) с датой 2026-12-15 — отсчёт показывает 68 дней. Добавлены родители, описание, CTA в лист ожидания.
- **Custom 404 page**: создал `not-found.tsx` с темой «Этот котёнок убежал» — большая 404 с gradient-text, paw-print иконка с пульсирующими знаками вопроса, 3 кнопки навигации (На главную / Найти котёнка / В блог), декоративный paw-pattern фон, честная подпись «Каждый котёнок — событие. Даже потеряться.».
- **Admin panel (Кабинет заводчика)**: создал API `/api/bookings/list` (GET список + статистика, PATCH статус, DELETE). Создал страницу `/admin` — dashboard с: stats grid (Всего/Новые/Связались/Подтвержд./Бронь/Лист ожид.), tabs-фильтр по статусам с бейджами, список заявок-карточек (имя, телефон, email, котёнок, сообщение, дата, тип-иконка), detail-диалог с управлением статусом (4 кнопки), удалением, toast-уведомлениями. Протестировано end-to-end: создал 2 тестовые заявки → появились в админке → изменил статус «Связались» → БД обновилась (confirmed status: contacted).
- ESLint: поймал 1 ошибку `set-state-in-effect` в ExpectedCountdown (`setTimeLeft(calcTimeLeft(target))` синхронно в effect) → исправил: refactor на derived state — `timeLeft` вычисляется в render из `litter.bornAt` + `now` state (который тикает через setInterval в callback, что разрешено). Lint чист.
- Финальная QA: lint чист, обе страницы работают (404 + admin), countdown тикает (68 дней, секунды меняются 59→57 за 2с), breeder-intro рендерится с фото и ценностями, мобильная адаптация (390×844) сохранена для всех новых секций, 0 ошибок в консоли.

Stage Summary:
- Добавлено 4 новых компонента/страницы: BreederIntro, ExpectedCountdown, NotFound (404), AdminPage + API /api/bookings/list.
- Ключевые новые фичи: ① секция заводчика с лицом и историей (доверие), ② live-обратный отсчёт до помёта, ③ кастомная 404 в фирменном стиле, ④ полноценный кабинет заводчика с управлением заявками.
- Сгенерировано 1 новое изображение (портрет заводчика).
- Техническое качество: derived state для countdown (без setState-in-effect), server-side API с валидацией, lint чист, 0 runtime ошибок.

Unresolved issues / next steps (приоритеты для следующего раунда):
- (medium) 30-секундные видео-превью поведения котят (video-understanding skill или <video> с placeholder).
- (low) Lazy-loading изображений с blur-placeholder (next/image placeholder=blur).
- (low) Админ-панель: аутентификация (сейчас /admin открыт — добавить NextAuth или простой пароль).
- (low) Админ-панель: управление котятами/помётами/производителями (сейчас только заявки).
- (low) Аналитика просмотров статей (при согласии cookie).
- (low) Care checklist PDF для новых владельцев (генерация через pdf skill).
- (low) Интеграция с реальным мессенджером (WhatsApp/Telegram) через API.

---
Task ID: cron-round-6
Agent: Z.ai Code (cron webDevReview — round 6)
Task: QA через agent-browser, исправление багов и добавление новых фич/стилей для питомника «Тихий Дом».

Work Log:
- Прочитал worklog.md, оценил статус: проект стабилен после раунда 5, lint чист, dev-сервер работает.
- Обнаружил: availability-service (WebSocket, порт 3003) упал — перезапустил.
- QA через agent-browser (1440×900): все 11 секций рендерятся, 0 ошибок в консоли.
- **Админ-аутентификация**: создал API `/api/admin/auth` (POST login с httpOnly cookie, GET check, DELETE logout). Создал страницу `/admin/login` (client component) с формой пароля, показом/скрытием, демо-паролем, авто-редиректом если уже авторизован. Переделал `/admin` в server component (`page.tsx`) с guard: читает cookie через `next/headers`, если нет — `redirect("/admin/login")`. Перенёс dashboard в `admin-dashboard.tsx`. Добавил кнопку «Выйти» в хедер админки. Демо-пароль: `tihiy-dom-2026` (env ADMIN_PASSWORD). Протестировано end-to-end: `/admin` → редирект на login → ввод пароля → редирект на dashboard → «Выйти» → обратно на login.
- **Багфикс auth**: поймал `ReferenceError: maxAge is not defined` (использовал `maxAge` вместо `MAX_AGE` в cookies.set). Исправил. Проверил через curl — API возвращает `{"success":true}` с cookie.
- **Секция «Приехать познакомиться» (VisitUs)**: сгенерировал тёплое фото интерьера дома. Создал компонент с: фото + плавающая карточка адреса (Москва, Юго-Западная, «15 мин от метро»), pulsing-badge «Принимаем гостей», 3 правила визита («Только по записи», «Это наш дом», «15 минут от метро»), CTA «Записаться на визит» + «Позвонить». Добавил ссылку «Визит» в навигацию.
- **Care Checklist PDF**: через pdf skill создал HTML-чек-лист (фирменный стиль, 2 страницы, A4) с разделами: Кормление, Ветеринар и прививки (таблица-расписание по возрастам), Груминг, Среда и поведение, callout про поддержку заводчика. Сгенерировал PDF через `html2pdf-next.js --nopaged` (2 страницы, 66 KB, vector). Проверил через `pdf_qa.py` — 10 checks passed, 2 minor warnings. Добавил metadata (Title, Author, Subject). Скопировал PDF+HTML в `public/download/`. Создал компонент `CareChecklist` — секция с описанием, списком хайлайтов, кнопкой скачивания PDF и мок-превью листа PDF с layered paper effect. Добавил на страницу между VisitUs и Blog.
- ESLint: поймал 1 ошибку JSX (`<br>` без закрывающего тега в care-checklist.tsx) → исправил на `<br />`. Багфикс auth API (`MAX_AGE`). Lint чист.
- Финальная QA: lint чист, обе новые секции (VisitUs, CareChecklist) рендерятся, PDF скачивается (HTTP 200, 66 KB, application/pdf), админ-логин работает (login → dashboard → logout → login), мобильная адаптация (390×844) сохранена, 0 ошибок в консоли. Оба сервиса (3000 + 3003) запущены.

Stage Summary:
- Добавлено 4 новых компонента/страницы/файла: VisitUs, CareChecklist, AdminLoginPage + AdminAuth API + server guard на /admin.
- 2 новых API-роута: `/api/admin/auth` (POST/GET/DELETE), + `/admin` теперь server-gated.
- 1 новый PDF: care-checklist.pdf (2 страницы, фирменный стиль, для новых владельцев).
- Ключевые новые фичи: ① админ-аутентификация с cookie-based паролем (защита /admin), ② секция «Приехать познакомиться» с локацией и правилами визита, ③ downloadable care checklist PDF (PDF skill), ④ кнопка «Выйти» в админке.
- Сгенерировано 1 новое изображение (интерьер дома для визита).
- Техническое качество: server-side cookie auth, httpOnly cookies, server component guard, lint чист, 0 runtime ошибок.

Unresolved issues / next steps (приоритеты для следующего раунда):
- (medium) 30-секундные видео-превью поведения котят (video-understanding skill или <video> с placeholder).
- (low) Lazy-loading изображений с blur-placeholder (next/image placeholder=blur).
- (low) Админ-панель: CRUD для котят/помётов/производителей (сейчас только заявки).
- (low) Аналитика просмотров статей (при согласии cookie).
- (low) Интеграция с реальным мессенджером (WhatsApp/Telegram) через API.
- (low) Страница «О нас» с историей питомника (отдельный маршрут для SEO).
- (low) availability-service стабильно падает между раундами — добавить auto-restart через process manager (pm2 или systemd).

---
Task ID: cron-round-7
Agent: Z.ai Code (cron webDevReview — round 7)
Task: QA через agent-browser, исправление багов и добавление новых фич/стилей для питомника «Тихий Дом».

Work Log:
- Прочитал worklog.md, оценил статус: проект стабилен после раунда 6, lint чист, dev-сервер работает.
- Обнаружил: availability-service (WebSocket, порт 3003) упал — перезапустил. Позже добавил keepalive-супервизор.
- QA через agent-browser (1440×900): все 13 секций рендерятся, 0 ошибок в консоли.
- **Image blur placeholders (lazy loading)**: создал утилиту `src/lib/blur.ts` с `BLUR_DATA_URLS` — генерирует SVG-based solid-color blur data URLs в фирменной палитре (background/muted/primary/secondary/accent/dark). Делегировал субагенту применение `placeholder="blur"` + `blurDataURL` ко всем `<Image>` компонентам — покрыто 17 изображений в 11 файлах (about, producers, kittens-catalog, show-champions, reviews, blog, breeder-intro, visit-us, favorites-panel, compare-bar, blog/[slug]/page). Hero уже имел blur. Lint чист после применения.
- **Personality Guide секция**: создал компонент `personality-guide.tsx` — детальный гид по 4 темпераментам (Спокойный/Игривый/Независимый/Ласковый). Каждая карточка: иконка + tagline, описание, 4 trait-бара (Активность/Ласка/Терпение/Самостоятельность с high/medium/low), секция «Подойдёт» (с иконками аудитории), «Не подойдёт», честная заметка про генетику vs воспитание. Цвета карточек соответствуют темпераменту (primary/secondary/muted/accent). Добавил на страницу между ShowChampions и PersonalityQuiz.
- **Keepalive супервизор**: создал `mini-services/keepalive-availability.sh` — bash-супервизор, который запускает availability-service и автоматически перезапускает его при падении (через while-цикл с 3-секундной задержкой). Запустил через `setsid bash keepalive-availability.sh & disown`. Оба процесса (bash-супервизор + bun-сервис) работают на порту 3003. Решает проблему частых падений availability-service между раундами.
- Финальная QA: lint чист, Personality Guide рендерится со всеми 4 карточками и trait-барами, blur placeholders применены (нет белых вспышек при загрузке), keepalive-супервизор работает, мобильная адаптация (390×844) сохранена, 0 ошибок в консоли.

Stage Summary:
- Добавлено 2 новых компонента/файла: PersonalityGuide, blur.ts (утилита) + keepalive-availability.sh (супервизор).
- Ключевые новые фичи: ① image blur placeholders (17 изображений, lazy loading с tinted blur), ② Personality Guide — детальный гид по 4 темпераментам с trait-барами и аудиторией, ③ keepalive-супервизор для availability-service (auto-restart).
- Техническое качество: SVG-based blur data URLs (без raster overhead), trait bars через CSS, lint чист, 0 runtime ошибок.

Unresolved issues / next steps (приоритеты для следующего раунда):
- (medium) 30-секундные видео-превью поведения котят (video-understanding skill или <video> с placeholder).
- (low) Админ-панель: CRUD для котят/помётов/производителей (сейчас только заявки).
- (low) Аналитика просмотров статей (при согласии cookie).
- (low) Интеграция с реальным мессенджером (WhatsApp/Telegram) через API.
- (low) Страница «О нас» с историей питомника (отдельный маршрут для SEO).
- (note) keepalive-супервизор работает, но sandbox может убивать процессы между cron-раундами — скрипт нужно запускать вручную в начале каждого раунда.

---
Task ID: cron-round-8
Agent: Z.ai Code (cron webDevReview — round 8)
Task: QA через agent-browser, исправление багов и добавление новых фич/стилей для питомника «Тихий Дом».

Work Log:
- Прочитал worklog.md, оценил статус: проект стабилен после раунда 7, lint чист, dev-сервер работает.
- Обнаружил: availability-service (WebSocket, порт 3003) упал — перезапустил через keepalive-супервизор.
- QA через agent-browser (1440×900): все 14 секций рендерятся, 0 ошибок в консоли.
- **Kitten behavior preview (видео-превью)**: добавил поле `videoUrl` в Prisma-схему Kitten (опциональное). Создал компонент `BehaviorPreview` внутри kitten detail dialog — показывает "Поведение в движении" с play/pause кнопкой. Если videoUrl задан — играет реальный <video>. Иначе — Ken Burns анимация (zoom-pan 8с loop) на изображении котёнка с personality-специфичной подписью ("Спокойно наблюдает", "Активно играет", "Самостоятельно гуляет", "Ласкается и мурчит"), прогресс-баром, виньеткой. Добавил CSS keyframes `ken-burns` и `ken-burns-progress` в globals.css.
- **Article view analytics**: добавил поле `views` (Int) в Prisma-схему BlogPost. Создал API `/api/blog/[slug]/view` (POST — инкремент просмотров через raw SQL). Создал клиентский компонент `ArticleViewTracker` — проверяет consent в localStorage, и только если "accepted" отправляет POST. Без PII. Добавил на страницу статьи: отображение счётчика просмотров (Eye иконка + pluralizeViews) и трекер. Протестировано end-to-end: открыл статью → DB views: 0→1→2.
- **Багфикс Prisma stale client**: после добавления полей `views`/`videoUrl` в схему, Next.js dev-сервер кешировал старый Prisma Client — `db.blogPost.update({data:{views:{increment:1}}})` падал с "Unknown argument views". Решение: переписал view API на raw SQL (`db.$executeRaw\`UPDATE BlogPost SET views = views + 1 WHERE slug = ${slug}\``) — обходит валидацию полей клиентом. Lint чист, API возвращает 200.
- **Страница «О нас» (/about)**: создал server component с SEO-метаданными. Содержит: hero с заголовком и описанием, cover image (сгенерированное фото двух мейн-кунов у окна), stats band (производители/помёты/выпускники/лет), 4 принципа-карточки, history timeline (2020-2026: Первая кошка → Первый помёт → Регистрация → Первые выпускники → Сайт → Сегодня), честная заметка о титулах, CTA. Добавил ссылку «Читать всю историю» в About-секцию главной. Обновил footer nav (ссылки «О нас» → /about). Добавил /about в sitemap. Сгенерировал 1 новое изображение (about-history.jpg).
- ESLint: 0 ошибок. Багфикс raw SQL для view tracking.
- Финальная QA: lint чист, /about рендерится с timeline 2020-2026, kitten dialog показывает behavior preview с play/pause, article page показывает view count, view tracking работает (DB 0→2), мобильная адаптация (390×844) сохранена, 0 ошибок в консоли. keepalive-супервизор запущен.

Stage Summary:
- Добавлено 4 новых компонента/страницы: BehaviorPreview (в kittens-catalog), ArticleViewTracker, /about page, /api/blog/[slug]/view.
- 2 изменения Prisma-схемы: Kitten.videoUrl (optional), BlogPost.views (Int default 0).
- Ключевые новые фичи: ① kitten behavior preview (Ken Burns анимация или реальное видео), ② article view analytics (с cookie consent), ③ dedicated /about page с history timeline.
- Сгенерировано 1 новое изображение (about-history.jpg — два мейн-куна у окна).
- Техническое качество: raw SQL для обхода stale Prisma client, cookie-consent-gated analytics, server component для SEO, lint чист, 0 runtime ошибок.

Unresolved issues / next steps (приоритеты для следующего раунда):
- (medium) Реальные 30-сек видео-превью поведения котят (video-generation skill) — сейчас Ken Burns анимация как fallback.
- (low) Админ-панель: CRUD для котят/помётов/производителей (сейчас только заявки).
- (low) Интеграция с реальным мессенджером (WhatsApp/Telegram) через API.
- (low) Страница контактов / форма обратной связи.
- (note) keepalive-супервизор работает, но sandbox убивает процессы между cron-раундами — нужно запускать вручную в начале каждого раунда.
- (note) Prisma Client в Next.js dev-сервере кешируется — при schema changes нужен raw SQL или рестарт сервера (нельзя сделать вручную).

---
Task ID: cron-round-9
Agent: Z.ai Code (cron webDevReview — round 9)
Task: QA через agent-browser, исправление багов и добавление новых фич/стилей для питомника «Тихий Дом».

Work Log:
- Прочитал worklog.md, оценил статус: проект стабилен после раунда 8, lint чист, dev-сервер работает.
- Обнаружил: availability-service (WebSocket, порт 3003) упал — перезапустил через keepalive-супервизор.
- QA через agent-browser (1440×900): все 15 секций рендерятся, 0 ошибок в консоли.
- **Admin CRUD для котят**: добавил модель ContactMessage в Prisma-схему. Создал API `/api/admin/kittens` (GET список + litters, POST create через raw SQL) и `/api/admin/kittens/[id]` (PATCH update, DELETE). Создал компонент `AdminKittens` — список котят с миниатюрами, badge статуса/окраса/пола, кнопками edit/delete, диалог create/edit с формой (имя, цена, окрас, пол, характер, статус, помёт, дата рождения, URL изображения/видео, описание, чекбокс «привит»). Добавил tab-switcher в admin-dashboard (Заявки/Котята). Протестировано end-to-end: create → котёнок появился в списке и БД → delete → toast + БД пуста.
- **Багфикс Prisma stale client (create)**: `db.kitten.create()` падал с "Unknown argument videoUrl" (stale client). Переписал POST на raw SQL INSERT. PATCH/DELETE используют стандартный Prisma (не затрагивают новое поле).
- **Страница контактов (/contacts)**: создал page с contact form (имя, email, телефон, тема-чипы, сообщение) → API `/api/contact` (POST, raw SQL INSERT в ContactMessage). Страница включает: 4 контакт-метода (телефон/WhatsApp/email/адрес), форма с валидацией и success-state, изображение рабочего места заводчика, карточки «Время ответа» и «Прежде чем писать». Протестировано: отправил форму → "Сообщение отправлено!" → DB подтверждает запись. Добавил /contacts в footer nav и sitemap.
- Сгенерировано 1 новое изображение (contacts.jpg — рабочее место заводчика с мейн-куном).
- ESLint: 0 ошибок.
- Финальная QA: lint чист, admin kittens CRUD работает (create + delete), contacts page форма работает (DB подтверждает), мобильная адаптация сохранена, 0 ошибок в консоли. keepalive-супервизор запущен.

Stage Summary:
- Добавлено 5 новых компонентов/API/страниц: AdminKittens component, /api/admin/kittens (GET+POST), /api/admin/kittens/[id] (PATCH+DELETE), /contacts page, /api/contact (POST).
- 1 изменение Prisma-схемы: ContactMessage model (id, name, email, phone?, subject, message, status, timestamps).
- Ключевые новые фичи: ① admin CRUD для котят (create/edit/delete с формой), ② tab-switcher в админке (Заявки/Котята), ③ dedicated /contacts page с формой обратной связи.
- Сгенерировано 1 новое изображение (contacts.jpg).
- Техническое качество: raw SQL для обхода stale Prisma client (create + contact), cookie-consent-gated, lint чист, 0 runtime ошибок.

Unresolved issues / next steps (приоритеты для следующего раунда):
- (medium) Реальные 30-сек видео-превью поведения котят (video-generation skill).
- (low) Админ: просмотр contact messages в dashboard.
- (low) Админ: CRUD для помётов и производителей.
- (low) Интеграция с реальным мессенджером (WhatsApp/Telegram) через API.
- (low) Search functionality (kittens + blog) на главной.
- (note) keepalive-супервизор: нужно запускать вручную в начале каждого раунда.
- (note) Prisma Client stale: все новые поля требуют raw SQL до рестарта dev-сервера.

---
Task ID: cron-round-10
Agent: Z.ai Code (cron webDevReview — round 10)
Task: QA через agent-browser, исправление багов и добавление новых фич/стилей для питомника «Тихий Дом».

Work Log:
- Прочитал worklog.md, оценил статус: проект стабилен после раунда 9, lint чист, dev-сервер работает.
- Обнаружил: availability-service (WebSocket, порт 3003) упал — перезапустил через keepalive-супервизор.
- QA через agent-browser (1440×900): все 15 секций рендерятся, 0 ошибок в консоли.
- **Глобальный поиск (Search Palette)**: создал API `/api/search` (GET — поиск по котятам, производителям, статьям через raw SQL с COLLATE NOCASE для case-insensitive Cyrillic). Создал компонент `SearchPalette` — command-palette-style диалог с debounced-поиском (250мс), grouped results (Котята/Производители/Статьи), keyboard navigation (↑↓ + Enter), результат-карточки с миниатюрами/badge/ценой. Добавил кнопку «Поиск» в header (десктоп с ⌘K badge + мобильный). Зарегистрировал Ctrl+K / Cmd+K shortcut через хук `useSearchShortcut`. Протестировано: поиск «серебр» → найдены котята + производитель Себастьян.
- **Багфикс search case-sensitivity**: первый вариант через Prisma `contains` возвращал пустые результаты для Cyrillic (SQLite contains чувствителен к регистру). Переписал на raw SQL с `LIKE ${pattern} COLLATE NOCASE` — работает для русского и английского.
- **Admin сообщения (AdminMessages)**: создал API `/api/admin/messages` (GET список + stats через raw SQL, PATCH статус, DELETE). Создал компонент `AdminMessages` — список сообщений с stats grid (Всего/Новые/Прочитано/Отвечено), tabs-фильтр по статусам, карточки с именем/темой/сообщением/email/телефоном/датой, detail-диалог с кнопками «Ответить» (mailto), «Отвечено» (статус), «Закрыть», «Удалить». Auto-mark as read при открытии. Добавил tab «Сообщения» в admin dashboard (теперь 3 вкладки: Заявки/Котята/Сообщения). Протестировано: открыл существующее сообщение → детали показаны → статус обновлён.
- **Share kitten feature**: добавил кнопку «Поделиться» (Share2 icon) на каждую карточку котёнка. Использует Web Share API (navigator.share) если доступно, иначе копирует URL в clipboard с toast-уведомлением. Протестировано: клик → «Ссылка скопирована / Поделитесь котёнком Барсик с близкими.»
- ESLint: 0 ошибок.
- Финальная QA: lint чист, search palette работает (поиск «серебр» → результаты), admin messages работают (detail dialog + статус), share button работает (clipboard + toast), мобильная адаптация (390×844) сохранена, 0 ошибок в консоли. keepalive-супервизор запущен.

Stage Summary:
- Добавлено 5 новых компонентов/API: SearchPalette component + useSearchShortcut hook, /api/search (raw SQL + COLLATE NOCASE), AdminMessages component, /api/admin/messages (GET+PATCH+DELETE raw SQL), share button в KittenCard.
- Ключевые новые фичи: ① глобальный поиск с command palette (Ctrl+K, grouped results, keyboard nav), ② admin сообщения (просмотр/статус/ответ/удаление), ③ share kitten (Web Share API + clipboard fallback), ④ 3-я вкладка в админке.
- Техническое качество: raw SQL с COLLATE NOCASE для Cyrillic search, raw SQL для ContactMessage (stale client workaround), Web Share API + clipboard fallback, lint чист, 0 runtime ошибок.

Unresolved issues / next steps (приоритеты для следующего раунда):
- (medium) Реальные 30-сек видео-превью поведения котят (video-generation skill).
- (low) Админ: CRUD для помётов и производителей.
- (low) Интеграция с реальным мессенджером (WhatsApp/Telegram) через API.
- (low) Search: добавить поиск по отзывам и FAQ.
- (low) PWA: service worker для offline-доступа.
- (note) keepalive-супервизор: нужно запускать вручную в начале каждого раунда.
- (note) Prisma Client stale: все новые поля требуют raw SQL до рестарта dev-сервера.

---
Task ID: round-7-blur
Agent: subagent (blur placeholders)
Task: Apply image blur placeholders across all cattery components

Work Log:
- Изучил worklog.md и `/src/lib/blur.ts` (BLUR_DATA_URLS с ключами background/muted/primary/secondary/accent/dark, DEFAULT_BLUR=muted). hero.tsx уже использовал `placeholder="blur"` + `BLUR_DATA_URLS.muted` — использовал как референс.
- about.tsx: добавил импорт + 2 изображения (about.jpg, calm-companion.jpg) — muted blur.
- producers.tsx: добавил импорт + 2 изображения (карточка производителя + диалог) — muted blur.
- kittens-catalog.tsx: добавил импорт + 3 изображения (карточка котёнка, основной образ в диалоге, миниатюры галереи incl. фото родителей) — muted blur.
- show-champions.tsx: добавил импорт + 1 изображение (карточка чемпиона) — secondary blur (под тон наградных ленточек).
- reviews.tsx: добавил импорт + 1 изображение (featured review) — muted blur.
- blog.tsx: добавил импорт + 2 изображения (featured пост + compact thumbnail) — muted blur.
- breeder-intro.tsx: добавил импорт + 1 изображение (портрет заводчика) — muted blur.
- visit-us.tsx: добавил импорт + 1 изображение (интерьер дома) — muted blur.
- favorites-panel.tsx: добавил импорт + 1 изображение (миниатюра избранного котёнка) — muted blur.
- compare-bar.tsx: добавил импорт + 2 изображения (миниатюра в плавающей панели + изображение в таблице сравнения) — muted blur.
- blog/[slug]/page.tsx: добавил импорт + 1 изображение (обложка статьи, priority сохранён, добавлен placeholder+blurDataURL) — muted blur.
- Всего: 11 файлов, 17 изображений получили blur placeholder.
- Все правки точечные: только импорт + два новых пропса (placeholder="blur" и blurDataURL), существующие props (src, alt, fill, sizes, className, priority, key) сохранены.
- `bun run lint` — 0 ошибок.

Stage Summary:
- Добавлен lazy-blur для всех next/image в каталожных/контентных компонентах питомника (17 изображений в 11 файлах). Изображения теперь плавно появляются из тёплого тонированного blur (muted/secondary) вместо белой вспышки — улучшает perceived performance и сохраняет фирменный визуал.
- Hero.tsx не трогал (уже обработан в предыдущем раунде).
- Импорт везде через `@/lib/blur` (алиас работает и для `src/components/cattery/`, и для `src/app/blog/[slug]/`).
- Lint чист, минимальная площадь изменений, поведение сохранено.

---
Task ID: major-revision-v2
Agent: Z.ai Code (массовое обновление по требованиям заказчика + мобильный аудит)
Task: Убрать генетику/выставки, обновить производителей, новый hero, кнопка «Позвонить», фиксы мобильного аудита

Work Log:
- Прочитал worklog.md, оценил статус: проект стабилен после 10 раундов cron.
- **Мобильный аудит**: провёл аудит на 320/375/414px через agent-browser. Найдено: горизонтальная прокрутка (scrollWidth 475 vs viewport 375), 96 из 140 элементов <44px tap-target, 66 элементов со шрифтом <12px, 4 критичных FAIL контраста по WCAG.
- **Контрастность**: затемнил --accent с #B86B4B (3.78:1) на #9E5538 (~5.2:1) — теперь passes AA для normal text. Обновил --destructive соответственно.
- **Переполнение**: добавил min-w-0 + overflow-hidden на Reveal компонент, overflow-x:hidden на body. Убрал переполнение с 475→370px на 320px (видимой прокрутки нет).
- **Удаление генетики**: убрал ВСЕ упоминания HCM/PKDef/SMA/N/N из: producers.tsx (диалог с тестами → диалог с документами), about.tsx, trust-marquee.tsx, faq.tsx, footer.tsx, hero.tsx, kittens-catalog.tsx, breeder-intro.tsx, personality-guide.tsx, search-palette.tsx, layout.tsx, about/page.tsx, contacts/page.tsx, api/stats/route.ts.
- **Удаление выставок**: убрал ShowChampions секцию с главной страницы. Убрал титулы/champion badges из producers.tsx. Обновил about page — убрал «3 из 6 без титулов».
- **Новые производители**: обновил Prisma-схему (убрал testHCM/testPKDef/testSMA/testDate/hasTitles/titles, добавил retired boolean + documents string). Пересидировал БД с 7 новыми: Рысь(серебряная), Диана(дикая табби), Дульсинея(серебряно-рыжая), Матильда(чёрный дымчатый), Чебурашка(чёрный табби с белым), Север(дикий табби), Машук(угольно-чёрный, retired — талисман). Сгенерировал 7 портретов + 1 hero-изображение Машука.
- **Документы**: в диалог производителя добавил секцию «Документы» с родословной (registry) и списком документов (родословная WCF, ветеринарный паспорт, чипирование). Заменил блог-статью про генетику на статью «Документы котёнка: родословная, метрика, ветеринарный паспорт».
- **Новый Hero**: переписал на full-screen background image (Машук) с gradient overlay для читаемости текста. Убрал split-layout. Исправил склеивание слов в H1 ({" "} между span и текстом). Заменил плавающие карточки с генетики на документы/доверие.
- **Кнопка «Позвонить»**: создал FloatingCallButton — мобильная плавающая кнопка (скрывается при скролле вниз, показывается при остановке/скролле вверх). На десктопе добавлена accent-кнопка «Позвонить» в шапке. Позиционирование bottom-left чтобы не конфликтовать с BackToTop (right) и CompareBar (center).
- **API producers**: переписал на raw SQL (stale Prisma client после изменения схемы). Возвращает 7 производителей с new fields (retired, documents).
- ESLint: 0 ошибок.
- Финальная QA: lint чист, 0 ошибок в консоли, hero рендерится с фоном Машука, producers показывают документы вместо генетики, кнопка «Позвонить» работает на десктопе и мобильном, переполнение устранено (overflow-x:hidden), контраст улучшен.

Stage Summary:
- Удалено: вся генетика (HCM/PKDef/SMA), выставки/титулы, ShowChampions секция.
- Добавлено: 7 новых производителей (вкл. Машук-retired), секция документов в диалоге, блог-статья про документы, hero на фоне фото, floating call button, accent-кнопка в шапке.
- Фиксы аудита: min-w-0+overflow-hidden на Reveal, overflow-x:hidden на body, --accent затемнён для WCAG AA, H1 spacing fix.
- Сгенерировано 8 новых изображений (7 портретов производителей + 1 hero Машука).
- Техническое качество: raw SQL для producers API, lint чист, 0 runtime ошибок.

Unresolved issues / next steps:
- (medium) Реальные 30-сек видео-превью поведения котят.
- (medium) Блок E: упрощение формы бронирования (email/телефон опциональны, поле мессенджера).
- (medium) Блок F: Telegram-бот для уведомлений о заявках.
- (low) Блок C: tap-targets 44px (сейчас 36px в шапке), шрифт ≥12px (сейчас 10-11px в badges).
- (low) Блок G: истории выпускников (развёрнутые с фото-галереей).
- (low) Блок H: вертикальные видео котят.
- (note) Заказчик сделает реальное фото Машука для hero — сейчас placeholder.
- (note) Название питомника пока не меняем (заказчик не определился).
- (note) keepalive-супервизор нужно запускать вручную.
