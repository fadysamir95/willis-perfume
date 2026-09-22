/* ==========================================================
   Willi's Perfume — Internationalization (EN / AR + RTL)
   Load this file BEFORE app.js on every page.
   ========================================================== */

/* ---------- UI strings ---------- */
const I18N = {
  en: {
    "nav.home": "Home",
    "nav.collection": "Collection",
    "nav.featured": "Most Requested",
    "nav.about": "About Us",
    "nav.contact": "Contact",
    "header.orderWa": "Order on WhatsApp",

    "menu.label": "Menu",
    "menu.caption": "Find a scent that feels like you.",
    "menu.instagram": "Instagram",
    "menu.facebook": "Facebook",
    "menu.whatsapp": "WhatsApp",

    "mnav.home": "Home",
    "mnav.collection": "Collection",
    "mnav.cart": "Cart",
    "mnav.whatsapp": "WhatsApp",

    "hero.eyebrow": "WILLI’S PERFUME",
    "hero.title": "Find Your<br><em>Signature Scent</em>",
    "hero.subtitle": "Discover carefully selected fragrances inspired by iconic scents, made for your own style.",
    "hero.cta": "Explore Collection",
    "hero.ctaWa": "Order on WhatsApp",
    "hero.f1": "Premium<br>Quality",
    "hero.f2": "Inspired by<br>Iconic Scents",
    "hero.f3": "A Scent<br>for Every Story",
    "hero.side": "MORE<br>THAN<br>A FRAGRANCE",

    "featured.eyebrow": "CUSTOMER FAVORITES",
    "featured.title": "Most Requested",
    "featured.viewAll": "View all",
    "coll.eyebrow": "THE COLLECTION",
    "coll.title": "Our Collection",
    "coll.count": "{n} fragrances",
    "coll.search": "Search your fragrance...",
    "coll.clear": "Clear search",
    "coll.viewAll": "View all products",
    "coll.empty.title": "No fragrance found",
    "coll.empty.text": "Try another name, inspired fragrance, or filter.",
    "coll.empty.reset": "Show all fragrances",

    "contact.eyebrow": "GET IN TOUCH",
    "contact.title": "Contact Us",
    "contact.text": "We reply fast on WhatsApp — send us your question or order details anytime.",
    "contact.whatsappTitle": "WhatsApp",
    "contact.whatsappText": "Chat with us directly — the fastest way to reach you.",
    "contact.socialsTitle": "Follow Us",
    "contact.socialsText": "Daily drops and scent tips on Instagram and Facebook.",
    "contact.deliveryTitle": "Delivery",
    "contact.deliveryText": "Free shipping on orders above 1000 EGP · Cash on delivery nationwide.",
    "contact.formTitle": "Send us a message",
    "contact.formName": "Your name",
    "contact.formMsg": "Your message",
    "contact.formSend": "Send via WhatsApp",

    "filter.all": "All",
    "filter.men": "Men",
    "filter.women": "Women",
    "filter.unisex": "Unisex",
    "cat.all": "All styles",
    "cat.Elegant": "Elegant",
    "cat.Summer": "Summer",
    "cat.Formal": "Formal",
    "cat.Night": "Night",
    "cat.Attractive": "Attractive",
    "cat.Luxury": "Luxury",

    "gender.men": "Men",
    "gender.women": "Women",
    "gender.unisex": "Unisex",

    "card.from": "From",
    "card.details": "Details",
    "card.addToCart": "Add to Cart",

    "pwa.installTitle": "Install the app",
    "pwa.installText": "Open Willi's in full screen with offline support.",
    "pwa.install": "Install App",
    "pwa.dismiss": "Not now",
    "pwa.iosTitle": "Add Willi's to your Home Screen",
    "pwa.iosStep1": "In Safari tap the Share button ▲ at the bottom",
    "pwa.iosStep2": "Tap \u201CAdd to Home Screen\u201D",
    "pwa.iosStep3": "Tap \u201CAdd\u201D at the top right",
    "pwa.done": "Got it",

    "stock.in": "In Stock",
    "stock.low": "Low Stock",
    "stock.out": "Out of Stock",

    "menu.open": "Open menu",
    "menu.close": "Close menu",
    "modal.close": "Close product details",

    "modal.inspired": "Inspired by",
    "modal.family": "Fragrance Family",
    "modal.notes": "Fragrance Notes",
    "modal.notesTop": "Top Notes",
    "modal.notesHeart": "Heart Notes",
    "modal.notesBase": "Base Notes",
    "modal.notListed": "Not listed",
    "modal.chooseSize": "Choose Size",
    "modal.quantity": "Quantity",
    "modal.addToCart": "Add to Cart — {price} EGP",
    "modal.orderWa": "Order on WhatsApp",
    "modal.morePhotos": "View more photos",

    "story.eyebrow": "WILLI’S PHILOSOPHY",
    "story.title": "More Than<br><em>a Fragrance</em>",
    "story.text": "A scent can become part of the way people remember you. Choose the one that feels like your signature.",

    "ship.eyebrow": "DELIVERY & RETURNS",
    "ship.title": "Shipping & Delivery",
    "ship.t1Title": "Fast Delivery",
    "ship.t1Text": "Your order ships within 24 hours and arrives in 2–5 working days across Egypt.",
    "ship.t2Title": "Clear Pricing",
    "ship.t2Text": "Shipping is 35 EGP inside Cairo and 50 EGP to other governorates. Free shipping on orders above 1000 EGP.",
    "ship.t3Title": "Cash on Delivery",
    "ship.t3Text": "Pay by cash, Vodafone Cash or InstaPay when your order arrives.",
    "ship.t4Title": "Easy Exchange",
    "ship.t4Text": "Exchange or return any product within 24 hours of receiving it — just message us on WhatsApp.",

    "testi.eyebrow": "WORD OF MOUTH",
    "testi.title": "What Our Customers Say",
    "testi.t1": "The White Code is exactly what I wanted — long lasting and elegant. Ordering on WhatsApp took two minutes.",
    "testi.n1": "Ahmed S.",
    "testi.t2": "Milky Amber smells luxurious for the price. Delivery arrived in two days, beautifully packed.",
    "testi.n2": "Nour M.",
    "testi.t3": "Great service — I ordered three perfumes and they even helped me choose my scent over WhatsApp.",
    "testi.n3": "Omar K.",

    "footer.about": "Wear Your Will",
    "footer.rights": "© 2026 Willi’s Perfume. All rights reserved.",

    "cart.title": "Your Cart",
    "cart.open": "Open cart",
    "cart.close": "Close cart",
    "cart.emptyTitle": "Your cart is empty",
    "cart.emptyText": "Add a fragrance you love and it will appear here.",
    "cart.continue": "Continue shopping",
    "cart.total": "Total",
    "cart.checkout": "Checkout via WhatsApp",
    "cart.clear": "Clear cart",
    "cart.each": "{price} EGP each",
    "cart.remove": "Remove item",
    "cart.qtyUp": "Increase quantity",
    "cart.qtyDown": "Decrease quantity",
    "toast.added": "{name} ({size}) added to cart",
    "toast.cleared": "Cart cleared",
    "wish.add": "Add to favorites",
    "wish.remove": "Remove from favorites",
    "wish.added": "Added to favorites",
    "wish.removed": "Removed from favorites",
    "wish.chip": "♥ Favorites ({n})",
    "wish.emptyTitle": "No saved fragrances yet",
    "wish.emptyText": "Tap the ♥ on any fragrance to save it here.",
    "wish.showAll": "Show all fragrances",
    "cart.lastOrder": "Re-purchase your last order",
    "cart.reorder": "Reorder last order",
    "toast.reordered": "Last order added back to your cart",

    "wa.header": "Hi, I would like to order:",
    "wa.bullet": "• {name} ({size}) × {qty} = {price} EGP",
    "wa.cart": "🛍 My Cart ({n} item{s}):",
    "wa.total": "Total: {total} EGP",
    "wa.name": "Name:",
    "wa.phone": "Phone:",
    "wa.address": "Address (optional):",
    "wa.payment": "Payment method: Cash on delivery / Vodafone Cash / InstaPay",
    "wa.shipping": "Shipping: 35 EGP inside Cairo, 50 EGP to other governorates (free above 1000 EGP)",
    "wa.orderHeader": "Hi, I would like to order:",
    "wa.odItem": "• {name}",
    "wa.odInspired": "• Inspired by: {name}",
    "wa.odSize": "• Size: {size}",
    "wa.odPrice": "• Price: {price} EGP",

    "pager.prev": "Previous fragrance",
    "pager.next": "Next fragrance",

    "announce.text": "Free shipping on orders above 1000 EGP · Cash on delivery nationwide",

    "detail.related": "You may also like",
    "detail.notify": "Notify me when it's back",
    "detail.share": "Share",

    "toast.copied": "Link copied to clipboard",

    "sort.label": "Sort",
    "sort.optDefault": "Default order",
    "sort.optPriceAsc": "Price: low to high",
    "sort.optPriceDesc": "Price: high to low",
    "sort.optName": "Name A–Z",

    "cart.freeUnlocked": "🎉 You've unlocked FREE shipping!",
    "cart.freeHint": "Free shipping over {min} {cur}",
    "cart.freeProgress": "Add {amount} {cur} more for FREE shipping",
    "cart.suggest": "Often ordered together",

    "detail.recent": "Recently viewed",

    "quiz.bannerTitle": "Find your scent in 30 seconds",
    "quiz.bannerText": "Answer 4 quick questions and we'll match you with the fragrances you'll love.",
    "quiz.bannerCta": "Start the quiz",
    "quiz.title": "Find your signature scent",
    "quiz.subtitle": "4 quick questions — 30 seconds",
    "quiz.step": "Question {n} of {m}",
    "quiz.back": "Back",
    "quiz.restart": "Start over",
    "quiz.close": "Close quiz",
    "quiz.gender.title": "Who is it for?",
    "quiz.gender.men": "For him",
    "quiz.gender.women": "For her",
    "quiz.gender.unisex": "For everyone",
    "quiz.vibe.title": "What feeling do you want?",
    "quiz.vibe.fresh": "Fresh & clean",
    "quiz.vibe.warm": "Warm & woody",
    "quiz.vibe.sweet": "Sweet & fruity",
    "quiz.vibe.bold": "Bold & dark",
    "quiz.occasion.title": "When will you wear it?",
    "quiz.occasion.day": "Every day",
    "quiz.occasion.work": "Work & formal",
    "quiz.occasion.night": "Nights out",
    "quiz.occasion.special": "Special occasions",
    "quiz.longevity.title": "How long should it last?",
    "quiz.longevity.light": "Light & subtle",
    "quiz.longevity.balanced": "Balanced",
    "quiz.longevity.strong": "Strong & long-lasting",
    "quiz.results.title": "Your matches",
    "quiz.results.text": "Based on your answers, we think you'll love:",
    "quiz.results.empty": "No matches — try different answers.",
    "quiz.waHelp": "Not sure? Ask us on WhatsApp",

    "wa.notifyMsg": "Hi, please notify me when \"{name}\" ({size}) is back in stock.",
    "wa.shareMsg": "Check out \"{name}\" from Willi's Perfume — {price} {currency} — ",

    "faq.eyebrow": "GOOD TO KNOW",
    "faq.title": "Frequently Asked Questions",
    "faq.q1": "How do I order?",
    "faq.a1": "Choose a fragrance from the collection, add it to your cart, then press \"Checkout via WhatsApp\" — or message us directly on WhatsApp and we'll help you choose your size.",
    "faq.q2": "How much does delivery cost?",
    "faq.a2": "Shipping is 35 EGP inside Cairo and 50 EGP to other governorates. It's free for orders above 1,000 EGP.",
    "faq.q3": "What payment methods do you accept?",
    "faq.a3": "Cash on delivery, Vodafone Cash or InstaPay — just tell us your preferred method in the WhatsApp order message.",
    "faq.q4": "Can I exchange or return my order?",
    "faq.a4": "Yes — you can exchange or return any item within 24 hours of receiving it. Just message us on WhatsApp.",
    "faq.q5": "Are the fragrances original?",
    "faq.a5": "Yes — our fragrances are inspired by iconic scents and made with high-quality oils for a consistent, long-lasting performance.",
    "faq.q6": "When will my order ship?",
    "faq.a6": "Orders are shipped within 24 hours, and delivery takes 2–5 working days depending on your governorate.",
  },

  ar: {
    "nav.home": "الرئيسية",
    "nav.collection": "المجموعة",
    "nav.featured": "الأكثر طلبًا",
    "nav.about": "من نحن",
    "nav.contact": "تواصل معنا",
    "header.orderWa": "اطلب عبر واتساب",

    "menu.label": "القائمة",
    "menu.caption": "ابحث عن عطر يشبهك.",
    "menu.instagram": "إنستجرام",
    "menu.facebook": "فيسبوك",
    "menu.whatsapp": "واتساب",

    "mnav.home": "الرئيسية",
    "mnav.collection": "المجموعة",
    "mnav.cart": "السلة",
    "mnav.whatsapp": "واتساب",

    "hero.eyebrow": "عطور ويلي",
    "hero.title": "اعثر على<br><em>عطرك المميز</em>",
    "hero.subtitle": "اكتشف عطوراً مختارة بعناية مستوحاة من أعرق الروائح، مصنوعة لتناسب أسلوبك الخاص.",
    "hero.cta": "استكشف المجموعة",
    "hero.ctaWa": "اطلب عبر واتساب",
    "hero.f1": "جودة<br>فائقة",
    "hero.f2": "مستوحاة من<br>عطور شهيرة",
    "hero.f3": "عطر<br>لكل حكاية",
    "hero.side": "أكثر<br>من مجرد<br>عطر",

    "featured.eyebrow": "اختيارات العملاء",
    "featured.title": "الأكثر طلبًا",
    "featured.viewAll": "عرض الكل",
    "coll.eyebrow": "المجموعة",
    "coll.title": "مجموعتنا",
    "coll.count": "{n} عطر",
    "coll.search": "ابحث عن عطرك...",
    "coll.clear": "مسح البحث",
    "coll.viewAll": "عرض كل المنتجات",
    "coll.empty.title": "لم نجد عطراً",
    "coll.empty.text": "جرّب اسماً آخر أو عطراً مستوحى أو فلتراً مختلفاً.",
    "coll.empty.reset": "عرض كل العطور",

    "contact.eyebrow": "تواصل معنا",
    "contact.title": "اتصل بنا",
    "contact.text": "نرد بسرعة عبر واتساب — أرسل استفسارك أو تفاصيل طلبك في أي وقت.",
    "contact.whatsappTitle": "واتساب",
    "contact.whatsappText": "تحدث معنا مباشرة — أسرع طريقة للوصول إلينا.",
    "contact.socialsTitle": "تابعنا",
    "contact.socialsText": "منشورات يومية ونصائح عن العطور على إنستجرام وفيسبوك.",
    "contact.deliveryTitle": "التوصيل",
    "contact.deliveryText": "شحن مجاني للطلبات فوق 1000 جنيه · الدفع عند الاستلام لكل مصر.",
    "contact.formTitle": "أرسل لنا رسالة",
    "contact.formName": "اسمك",
    "contact.formMsg": "رسالتك",
    "contact.formSend": "إرسال عبر واتساب",

    "filter.all": "الكل",
    "filter.men": "رجالي",
    "filter.women": "نسائي",
    "filter.unisex": "يونيسكس",
    "cat.all": "كل الأنماط",
    "cat.Elegant": "أنيق",
    "cat.Summer": "صيفي",
    "cat.Formal": "رسمي",
    "cat.Night": "ليلي",
    "cat.Attractive": "جذاب",
    "cat.Luxury": "فاخر",

    "gender.men": "رجالي",
    "gender.women": "نسائي",
    "gender.unisex": "يونيسكس",

    "card.from": "يبدأ من",
    "card.details": "التفاصيل",
    "card.addToCart": "أضف للسلة",

    "pwa.installTitle": "ثبّت التطبيق",
    "pwa.installText": "افتح متجر Willi's بشاشة كاملة واشتغل حتى بدون إنترنت.",
    "pwa.install": "تثبيت التطبيق",
    "pwa.dismiss": "لاحقًا",
    "pwa.iosTitle": "أضِف Willi's للشاشة الرئيسية",
    "pwa.iosStep1": "في سفاري اضغط زر المشاركة ▲ في الأسفل",
    "pwa.iosStep2": "اختر \u201Cإضافة إلى الشاشة الرئيسية\u201D",
    "pwa.iosStep3": "اضغط \u201Cإضافة\u201D في الأعلى",
    "pwa.done": "تمام",

    "stock.in": "متوفر",
    "stock.low": "كمية محدودة",
    "stock.out": "نفد المخزون",

    "menu.open": "افتح القائمة",
    "menu.close": "إغلاق القائمة",
    "modal.close": "إغلاق تفاصيل المنتج",

    "modal.inspired": "مستوحى من",
    "modal.family": "العائلة العطرية",
    "modal.notes": "النوتات العطرية",
    "modal.notesTop": "النوتات العليا",
    "modal.notesHeart": "نوتات القلب",
    "modal.notesBase": "النوتات القاعدية",
    "modal.notListed": "غير متاحة",
    "modal.chooseSize": "اختر الحجم",
    "modal.quantity": "الكمية",
    "modal.addToCart": "أضف للسلة — {price} ج.م",
    "modal.orderWa": "اطلب عبر واتساب",
    "modal.morePhotos": "عرض المزيد من الصور",

    "story.eyebrow": "فلسفة ويلي",
    "story.title": "أكثر من<br><em>مجرد عطر</em>",
    "story.text": "العطر قد يصبح جزءاً من الطريقة التي يتذكرك بها الناس. اختر العطر الذي يبدو كتوقيعك الخاص.",

    "ship.eyebrow": "التوصيل والاسترجاع",
    "ship.title": "التوصيل والشحن",
    "ship.t1Title": "توصيل سريع",
    "ship.t1Text": "يتم شحن طلبك خلال 24 ساعة ويصل خلال 2 إلى 5 أيام عمل داخل مصر.",
    "ship.t2Title": "شحن واضح",
    "ship.t2Text": "الشحن 35 ج.م داخل القاهرة و50 ج.م لبقية المحافظات. الشحن مجاني للطلبات فوق 1000 ج.م.",
    "ship.t3Title": "الدفع عند الاستلام",
    "ship.t3Text": "ادفع كاش أو فودافون كاش أو إنستاباي عند وصول طلبك.",
    "ship.t4Title": "استبدال سهل",
    "ship.t4Text": "استبدل أو أرجِع أي منتج خلال 24 ساعة من استلامه — فقط راسلنا على واتساب.",

    "testi.eyebrow": "آراء عملائنا",
    "testi.title": "ماذا قال عملاؤنا",
    "testi.t1": "عطر White Code كان بالظبط اللي كنت محتاجه — ثباته عالي وشكله أنيق. الطلب على واتساب أخذ دقيقتين.",
    "testi.n1": "أحمد س.",
    "testi.t2": "عطر Milky Amber ريحته فخمة جداً مقارنة بالسعر. التوصيل وصل في يومين والمنتج متغلف باحترافية.",
    "testi.n2": "نور م.",
    "testi.t3": "خدمة رائعة — طلبت ٣ عطور وساعدوني اختار العطر المناسب عبر واتساب.",
    "testi.n3": "عمر ق.",

    "footer.about": "ارتدِ إرادتك",
    "footer.rights": "© 2026 عطور ويلي. جميع الحقوق محفوظة.",

    "cart.title": "سلة التسوق",
    "cart.open": "فتح السلة",
    "cart.close": "إغلاق السلة",
    "cart.emptyTitle": "سلتك فارغة",
    "cart.emptyText": "أضف العطر الذي تحبه وسيظهر هنا.",
    "cart.continue": "متابعة التسوق",
    "cart.total": "الإجمالي",
    "cart.checkout": "إتمام الطلب عبر واتساب",
    "cart.clear": "مسح السلة",
    "cart.each": "{price} ج.م للقطعة",
    "cart.remove": "حذف المنتج",
    "cart.qtyUp": "زيادة الكمية",
    "cart.qtyDown": "تقليل الكمية",
    "toast.added": "تمت إضافة {name} ({size}) إلى السلة",
    "toast.cleared": "تم مسح السلة",
    "wish.add": "أضف إلى المفضلة",
    "wish.remove": "إزالة من المفضلة",
    "wish.added": "تمت الإضافة إلى المفضلة",
    "wish.removed": "تمت الإزالة من المفضلة",
    "wish.chip": "♥ المفضلة ({n})",
    "wish.emptyTitle": "لا توجد عطور محفوظة بعد",
    "wish.emptyText": "اضغط ♥ على أي عطر لحفظه هنا.",
    "wish.showAll": "عرض كل العطور",
    "cart.lastOrder": "اطلب آخر طلب لك كمان مرة",
    "cart.reorder": "إعادة طلب آخر طلب",
    "toast.reordered": "تمت إعادة آخر طلب إلى سلتك",

    "wa.header": "مرحباً، أود إتمام طلب:",
    "wa.bullet": "• {name} ({size}) × {qty} = {price} ج.م",
    "wa.cart": "🛍 سلتي ({n} منتج):",
    "wa.total": "الإجمالي: {total} ج.م",
    "wa.name": "الاسم:",
    "wa.phone": "رقم الهاتف:",
    "wa.address": "العنوان (اختياري):",
    "wa.payment": "طريقة الدفع: الدفع عند الاستلام / فودافون كاش / إنستاباي",
    "wa.shipping": "الشحن: 35 ج.م داخل القاهرة، 50 ج.م لبقية المحافظات (مجاني فوق 1000 ج.م)",
    "wa.orderHeader": "مرحباً، أود إتمام طلب:",
    "wa.odItem": "• {name}",
    "wa.odInspired": "• مستوحى من: {name}",
    "wa.odSize": "• الحجم: {size}",
    "wa.odPrice": "• السعر: {price} ج.م",

    "pager.prev": "العطر السابق",
    "pager.next": "العطر التالي",

    "announce.text": "شحن مجاني للطلبات فوق 1000 ج.م · الدفع عند الاستلام لجميع المحافظات",

    "detail.related": "قد يعجبك أيضاً",
    "detail.notify": "أخبرني عند توفره",
    "detail.share": "مشاركة",

    "toast.copied": "تم نسخ الرابط",

    "sort.label": "ترتيب",
    "sort.optDefault": "الترتيب الافتراضي",
    "sort.optPriceAsc": "السعر: من الأقل للأعلى",
    "sort.optPriceDesc": "السعر: من الأعلى للأقل",
    "sort.optName": "الاسم أ–ي",

    "cart.freeUnlocked": "🎉 حصلت على شحن مجاني!",
    "cart.freeHint": "شحن مجاني للطلبات فوق {min} {cur}",
    "cart.freeProgress": "أضف {amount} {cur} إضافية واحصل على شحن مجاني",
    "cart.suggest": "غالبًا بيتم طلبهم مع بعض",

    "detail.recent": "شاهدته مؤخرًا",

    "quiz.bannerTitle": "اعرف عطرك في 30 ثانية",
    "quiz.bannerText": "جاوب على 4 أسئلة سريعة وهنرشّحلك العطور اللي هتحبها.",
    "quiz.bannerCta": "ابدأ الاختبار",
    "quiz.title": "اعرف عطرك المميز",
    "quiz.subtitle": "4 أسئلة سريعة — 30 ثانية",
    "quiz.step": "سؤال {n} من {m}",
    "quiz.back": "رجوع",
    "quiz.restart": "ابدأ من جديد",
    "quiz.close": "إغلاق الاختبار",
    "quiz.gender.title": "العطر لمين؟",
    "quiz.gender.men": "له",
    "quiz.gender.women": "لها",
    "quiz.gender.unisex": "للجميع",
    "quiz.vibe.title": "عايز إحساس إيه؟",
    "quiz.vibe.fresh": "منعش ونضيف",
    "quiz.vibe.warm": "دافي وخشبي",
    "quiz.vibe.sweet": "حلو وفاكهي",
    "quiz.vibe.bold": "جريء وغامق",
    "quiz.occasion.title": "هتستخدمه إمتى؟",
    "quiz.occasion.day": "كل يوم",
    "quiz.occasion.work": "الشغل والرسميات",
    "quiz.occasion.night": "خروجات الليل",
    "quiz.occasion.special": "مناسبات خاصة",
    "quiz.longevity.title": "الثبات يبقى قد إيه؟",
    "quiz.longevity.light": "خفيف وبسيط",
    "quiz.longevity.balanced": "متوازن",
    "quiz.longevity.strong": "قوي ويدوم طويل",
    "quiz.results.title": "النتيجة",
    "quiz.results.text": "على أساس إجاباتك، هنظن إنك هتحب:",
    "quiz.results.empty": "مفيش نتايج — جرّب إجابات مختلفة.",
    "quiz.waHelp": "مش متأكد؟ اسألنا على واتساب",

    "wa.notifyMsg": "مرحباً، أرجو إخباري عند توفر \"{name}\" ({size}) من جديد.",
    "wa.shareMsg": "جرّب \"{name}\" من عطور ويلي — {price} {currency} — ",

    "faq.eyebrow": "معلومات مهمة",
    "faq.title": "الأسئلة الشائعة",
    "faq.q1": "كيف أطلب؟",
    "faq.a1": "اختر عطراً من المجموعة وأضفه إلى السلة ثم اضغط \"إتمام الطلب عبر واتساب\" — أو راسلنا مباشرة على واتساب وسنساعدك في اختيار القياس.",
    "faq.q2": "كم تكلفة الشحن؟",
    "faq.a2": "الشحن 35 ج.م داخل القاهرة و50 ج.م للمحافظات الأخرى، ومجاني للطلبات فوق 1000 ج.م.",
    "faq.q3": "ما طرق الدفع المتاحة؟",
    "faq.a3": "الدفع عند الاستلام أو فودافون كاش أو إنستاباي — أخبرنا بطريقتك المفضلة في رسالة الواتساب.",
    "faq.q4": "هل يمكنني الاستبدال أو الإرجاع؟",
    "faq.a4": "نعم — يمكنك الاستبدال أو الإرجاع خلال 24 ساعة من استلام الطلب، فقط راسلنا على واتساب.",
    "faq.q5": "هل العطور أصلية؟",
    "faq.a5": "نعم — عطورنا مستوحاة من عطور شهيرة وتُصنع بزيوت عالية الجودة لأداء ثابت وثبات طويل.",
    "faq.q6": "متى يتم شحن الطلب؟",
    "faq.a6": "يتم شحن الطلبات خلال 24 ساعة، ويصل الطلب خلال 2–5 أيام عمل حسب محافظتك.",
  }
};

/* ---------- Language engine ---------- */
const LANG_KEY = "willis_lang";
let currentLang = "en";

function getStoredLang() {
  try { return localStorage.getItem(LANG_KEY) || "en"; } catch { return "en"; }
}

function t(key, vars) {
  const dict = (I18N[currentLang] && I18N[currentLang][key]) != null ? I18N[currentLang][key] : I18N.en[key];
  let str = dict != null ? dict : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.split(`{${k}}`).join(v);
    }
  }
  return str;
}

/* Arabic product content helper — Arabic content now lives inside the product
   data (product.ar) instead of a separate dict, so admin edits one file. */
function pt(product, field) {
  if (currentLang === "ar" && product.ar && product.ar[field] != null) return product.ar[field];
  const fb = {
    description: product.description,
    family: product.fragrance_family,
    profile: product.short_profile || [],
    notes: product.notes || {}
  };
  return fb[field];
}

function gt(gender) {
  const key = `gender.${String(gender || "").toLowerCase()}`;
  const dict = I18N[currentLang] && I18N[currentLang][key] ? I18N[currentLang][key] : I18N.en[key];
  return dict != null ? dict : gender || "";
}

function isArabic() { return currentLang === "ar"; }

/* Translate every static element that carries data-i18n attributes */
function translateStatic() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
}

function updateLangToggleButtons() {
  document.querySelectorAll(".lang-toggle").forEach(btn => {
    const label = isArabic() ? "EN" : "العربية";
    btn.textContent = isArabic() ? "EN" : "العربية";
    btn.setAttribute("aria-label", isArabic() ? "Switch to English" : "التبديل إلى العربية");
    btn.dataset.label = label;
  });
}

function setLang(lang) {
  if (!I18N[lang]) lang = "en";
  currentLang = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* ignore */ }

  document.documentElement.lang = lang === "ar" ? "ar" : "en";
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  /* Product pages have their own per-product titles — keep them. */
  if (!document.body?.dataset?.productId) {
    document.title = lang === "ar"
      ? "عطور ويلي — ارتدِ إرادتك"
      : "Willi's Perfume — Wear Your Will";
  }

  translateStatic();
  updateLangToggleButtons();
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

function initI18n() {
  const stored = getStoredLang();
  if (I18N[stored]) {
    currentLang = stored;
    document.documentElement.lang = stored === "ar" ? "ar" : "en";
    document.documentElement.dir = stored === "ar" ? "rtl" : "ltr";
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      translateStatic();
      updateLangToggleButtons();
    });
  } else {
    translateStatic();
    updateLangToggleButtons();
  }

  document.querySelectorAll(".lang-toggle").forEach(btn => {
    btn.addEventListener("click", () => setLang(isArabic() ? "en" : "ar"));
  });

  document.dispatchEvent(new CustomEvent("i18n-ready", { detail: { lang: currentLang } }));
}

initI18n();