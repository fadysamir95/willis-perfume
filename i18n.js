/* ==========================================================
   Willi's Perfume — Internationalization (EN / AR + RTL)
   Load this file BEFORE app.js on every page.
   ========================================================== */

/* ---------- Product Arabic content (keyed by product id) ---------- */
const PRODUCT_AR = {
  "white-code": {
    description: "عطر نظيف وراقٍ مبني على السوسن الناعم والنيرولي المنعش والأخشاب الدافئة. أنيق وهادئ وسهل الارتداء للعمل أو المناسبات الرسمية.",
    family: "شيبر خشبي",
    profile: ["نظيف", "بودري", "أنيق"],
    notes: {
      top: ["نيرولي", "فلفل أسود", "هيل", "بذور الجزر"],
      heart: ["سوسن", "بنفسج", "إبرة الراعي", "ماتي"],
      base: ["عنبر", "أرز", "خشب الصندل", "باتشولي"]
    }
  },
  "fortune-rush": {
    description: "عطر خشبي غني ومرح مع البرقوق العصير والبندق والعسل فوق أخشاب دافئة. خيار واثق للسهرات والمواعيد والأجواء الباردة.",
    family: "خشبي",
    profile: ["حلو", "خشبي", "دافئ"],
    notes: {
      top: ["برقوق", "نوتات أوزونية", "جريب فروت", "برغموت"],
      heart: ["بندق", "عسل", "أرز", "خشب كشميري", "زهر البرتقال", "ياسمين"],
      base: ["خشب العنبر", "باتشولي", "فيتيفر", "طحلب البلوط"]
    }
  },
  "pink-crush": {
    description: "عطر فواكه وزهري مرح بالفراولة والتفاح والجريب فروت الوردي، ينعّمه جوز الهند والمسك وخشب الصندل.",
    family: "زهري فواكه جورماند",
    profile: ["فواكه", "حلو", "ناعم"],
    notes: {
      top: ["سوربيه", "فراولة", "تفاح", "جريب فروت وردي"],
      heart: ["نوتات زهرية", "فاوانيا", "ياسمين"],
      base: ["جوز الهند", "مسك", "خشب الصندل"]
    }
  },
  "cedar-way": {
    description: "عطر مشرق وراقٍ يقوده الجريب فروت والبرغموت، مع أزهار ناعمة وزنجبيل وقاعدة خشبية مسكية ملساء.",
    family: "حمضي منعش حار",
    profile: ["منعش", "حمضي", "خشبي"],
    notes: {
      top: ["جريب فروت", "برغموت", "ياسمين", "ماغنوليا"],
      heart: ["زنجبيل", "نوتات عشبية", "نوتات بودرية"],
      base: ["مسك", "أرز", "عنبر", "باتشولي", "جذر السوسن"]
    }
  },
  "tropical-veil": {
    description: "عطر استوائي منعش يدمج النوتات الخضراء والمائية بالنعناع وجوز الهند والتين ولمسة خشب صندل دافئة.",
    family: "خشبي أخضر مائي",
    profile: ["منعش", "استوائي", "خشبي"],
    notes: {
      top: ["نوتات خضراء", "نوتات مائية", "نعناع", "زنجبيل"],
      heart: ["جوز الهند", "تين", "ملح"],
      base: ["حبوب التونكا", "خشب الصندل"]
    }
  },
  "iris-noir": {
    description: "عطر عصري خشبي حار بالبرغموت المشرق والزنجبيل والهيل، متوازن بزهر البرتقال وقاعدة باتشولي عميقة.",
    family: "خشبي حار",
    profile: ["منعش حار", "خشبي", "أنيق"],
    notes: {
      top: ["زنجبيل", "برغموت", "هيل"],
      heart: ["زهر البرتقال", "نوتات زهرية"],
      base: ["باتشولي"]
    }
  },
  "citrus-ink": {
    description: "عطر حمضي راقٍ ومتطور بالبرغموت والبرتقال والنيرولي، تعقبه لمسات الزنجبيل والشاي الأسود والأخشاب الناعمة.",
    family: "حمضي عطري",
    profile: ["حمضي", "منعش", "راقٍ"],
    notes: {
      top: ["كترون", "برغموت كالابريا", "برتقال صقلي"],
      heart: ["نيرولي تونسي", "زنجبيل نيجيري", "قرفة سيلانية"],
      base: ["شاي أسود صيني", "أمبروكسان", "خشب الغاياك", "لبان"]
    }
  },
  "urban-pulse": {
    description: "عطر عصري وواثق يمزج التفاح المنعش والجريب فروت باللافندر والمريمية وقاعدة خشبية دافئة.",
    family: "شرقي فوجير",
    profile: ["منعش", "داكن", "عصري"],
    notes: {
      top: ["تفاح", "ألدهيدات", "جريب فروت", "زنجبيل"],
      heart: ["لافندر", "مريمية", "إبرة الراعي"],
      base: ["حبوب التونكا", "أرز", "لبان", "باتشولي"]
    }
  },
  "velvet-muse": {
    description: "عطر فاخر زهري فواكه بأناناس منعش وصفيراء، قلب ناعم من السوسن والياسمين، وقاعدة مسكية فانيليا دافئة.",
    family: "شيبر زهري",
    profile: ["فواكه", "زهري", "أنيق"],
    notes: {
      top: ["أناناس", "صفيراء"],
      heart: ["سوسن", "فلفل وردي", "ياسمين"],
      base: ["مسك", "عنبر", "فيتيفر", "فانيليا", "باتشولي"]
    }
  },
  "noir-reserve": {
    description: "عطر خشبي عميق وراقٍ مبني على العنبر وخشب الصندل واللابدانوم بطابع دافئ باقٍ.",
    family: "خشبي عطري",
    profile: ["خشبي", "عنبري", "عميق"],
    notes: { top: ["عنبر", "نوتات خشبية", "لابدانوم", "خشب صندل"], heart: [], base: [] }
  },
  "woody-pulse": {
    description: "عطر خشبي عصري بالريحان والتوابل الطازجة والفيتيفر، مدعوم بأمبروكسان وباتشولي وطابع خشبي مميز.",
    family: "عطري خشبي",
    profile: ["خشبي", "أخضر", "منعش حار"],
    notes: {
      top: ["ريحان", "فلفل تيمور", "توابل طازجة"],
      heart: ["خشب أكيجالا", "فيتيفر"],
      base: ["أمبروكسان", "باتشولي", "نوتات خشبية"]
    }
  },
  "milky-amber": {
    description: "عطر كريمي ومريح يتمحور حول الكراميل والعسل، مع لمسة فانيليا ناعمة ومسك أبيض في القاعدة.",
    family: "فانيليا حلو",
    profile: ["كريمي", "حلو", "دافئ"],
    notes: { top: ["كراميل"], heart: ["كومارين", "عسل"], base: ["فانيليا", "مسك أبيض"] }
  },
  "fresh-orchard": {
    description: "عطر منعش وحيوي بالتفاح الأخضر والبرغموت واليوسفي، يُختتم بالأرز والطحلب والمسك والأخشاب الناعمة.",
    family: "حمضي عطري",
    profile: ["منعش", "أخضر", "فواكه"],
    notes: {
      top: ["تفاح أخضر", "برغموت كالابريا", "يوسفي"],
      heart: ["بيتيغرين", "أرز", "كشميران", "بوماروز", "بنفسج"],
      base: ["طحلب البلوط", "مسك", "خشب العنبر", "باتشولي"]
    }
  },
  "saffron-flame": {
    description: "عطر استوائي جريء يقوده المانجو والليمون والزنجبيل، مع ياسمين وأرز فوق قاعدة عود وعنبر ومسك غنية.",
    family: "شرقي خشبي",
    profile: ["فواكه", "استوائي", "دافئ"],
    notes: {
      top: ["مانجو", "ليمون", "زنجبيل", "توت أحمر"],
      heart: ["كومارين", "ياسمين", "أرز"],
      base: ["مسك", "عود", "عنبر", "زيت السيبريول"]
    }
  },
  "silk-veil": {
    description: "عطر غني ومميز يدمج الكمثرى والبندق بالورد والزعفران والياسمين، يستقر على أخشاب كريمية وفانيليا.",
    family: "زهري فواكه",
    profile: ["فواكه", "زهري", "دافئ"],
    notes: {
      top: ["كمثرى", "بندق", "لبان"],
      heart: ["أوسمانثوس", "ورد", "زعفران", "ياسمين سامباك"],
      base: ["خشب الصندل", "فانيليا", "خشب أكيجالا", "عنبر رمادي", "لابدانوم"]
    }
  },
  "musk-aura": {
    description: "عطر مسكي بودري ناعم مع زنبق الوادي ودفء بلسمي خفيف وفانيليا.",
    family: "شرقي زهري",
    profile: ["بودري", "ناعم", "نظيف"],
    notes: { top: ["زنبق الوادي"], heart: ["بلسم تولو", "نوتات بودرية"], base: ["فانيليا"] }
  },
  "golden-bloom": {
    description: "عطر فواكه مفعم بالباشن فروت والخوخ والكمثرى والتوت، تنعّمه نوتات زهرية وقاعدة مسكية فانيليا دافئة.",
    family: "شيبر فواكه",
    profile: ["فواكه", "حلو", "مسكي"],
    notes: {
      top: ["باشن فروت", "خوخ", "كمثرى", "توت", "كاسيس", "رمل"],
      heart: ["زنبق الوادي"],
      base: ["مسك", "خشب صندل", "فانيليا", "باتشولي", "هيليوتروب"]
    }
  },
  "solar-glow": {
    description: "عطر زهري مشرق بالنيرولي المنعش واليوسفي الأخضر، يليه زهر البرتقال والتوبروز فوق ناعم المارشملو وخشب الصندل.",
    family: "زهري",
    profile: ["زهري", "مشرق", "دافئ"],
    notes: {
      top: ["نيرولي", "يوسفي أخضر"],
      heart: ["زهر البرتقال", "توبروز"],
      base: ["مارشملو", "خشب صندل"]
    }
  },
  "amber-ray": {
    description: "عطر زهري مشرق وأنيق بزهر البرتقال واليلانغ يلانغ واليوسفي، يليه ياسمين وتوبروز وقاعدة عنبرية خشبية دافئة.",
    family: "شرقي زهري",
    profile: ["زهري", "مشرق", "دافئ"],
    notes: {
      top: ["زهر البرتقال", "يلانغ يلانغ", "يوسفي"],
      heart: ["ياسمين سامباك", "توبروز", "غاردينيا"],
      base: ["باتشولي", "مسك", "نوتات خشبية", "عنبر"]
    }
  },
  "sandal-rush": {
    description: "عطر خشبي دافئ بالزعفران واللافندر، قلب من الكستناء الحلو وقاعدة ناعمة من خشب الصندل والفانيليا والأرز.",
    family: "شرقي خشبي",
    profile: ["خشبي", "دافئ", "كريمي"],
    notes: {
      top: ["زعفران"],
      heart: ["لافندر", "كستناء"],
      base: ["خشب صندل", "فانيليا", "خشب الأرز"]
    }
  },
  "berry-cloud": {
    description: "عطر توت عصيري بالفراولة والتوت والكرز، تنعّمه البنفسج والياسمين والمسك والفانيليا.",
    family: "زهري فواكه جورماند",
    profile: ["فواكه", "حلو", "ناعم"],
    notes: {
      top: ["فراولة", "توت", "توت أسود", "كرز حامض", "كشمش أسود", "يوسفي", "ليمون"],
      heart: ["بنفسج", "ياسمين"],
      base: ["مسك", "فانيليا", "كشميران", "نوتات خشبية", "عنبر", "طحلب البلوط", "باتشولي"]
    }
  },
  "heavenly-bloom": {
    description: "عطر أنثوي منعش زهري وفواكه بزهر اليوسفي والعليق والكيوي، تليه أزهار ناعمة ومسك نظيف مع أخشاب.",
    family: "زهري فواكه",
    profile: ["منعش", "زهري", "فواكه"],
    notes: {
      top: ["زهر اليوسفي", "توت أسود", "برتقال", "كيوي"],
      heart: ["زنبق الماء", "فريزيا", "فاوانيا", "أوركيد"],
      base: ["مسك", "خشب صندل", "خشب الأبنوس", "ماغوني"]
    }
  },
  "green-sprint": {
    description: "عطر أخضر منعش وحيوي بالنعناع والليمون والريحان، تعقبه أعشاب عطرية ولمسة مسكية نظيفة.",
    family: "منعش عطري",
    profile: ["منعش", "أخضر", "حمضي"],
    notes: {
      top: ["نعناع", "ليمون", "ريحان", "زعتر"],
      heart: ["كشمش أسود", "لافندر", "إكليل الجبل", "ياسمين"],
      base: ["مسك", "لويزة"]
    }
  },
  "aqua-drive": {
    description: "عطر منعش ورياضي بالبرتقال والنوتات البحرية، قلب حار وقاعدة ناعمة من الفانيليا والتونكا والمسك.",
    family: "خشبي حار",
    profile: ["منعش", "رياضي", "دافئ"],
    notes: {
      top: ["برتقال", "نوتات بحرية", "ألدهيدات", "يوسفي دموي"],
      heart: ["فلفل", "نيرولي", "أرز"],
      base: ["فانيليا", "حبوب التونكا", "مسك أبيض", "عنبر", "فيتيفر", "راتنج الإيليمي"]
    }
  },
  "blush-aura": {
    description: "عطر زهري فواكه ناعم بزهر البرتقال والنيرولي واللوز، يليه بنفسج وياسمين ومشمش فوق المسك وخشب الصندل.",
    family: "زهري فواكه",
    profile: ["زهري", "بودري", "ناعم"],
    notes: {
      top: ["زهر البرتقال", "نيرولي", "لوز"],
      heart: ["بنفسج", "ياسمين", "مشمش"],
      base: ["مسك", "ياسمين", "خشب صندل"]
    }
  }
};

/* ---------- UI strings ---------- */
const I18N = {
  en: {
    "nav.home": "Home",
    "nav.collection": "Collection",
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
    "hero.f1": "Premium<br>Quality",
    "hero.f2": "Inspired by<br>Iconic Scents",
    "hero.f3": "A Scent<br>for Every Story",
    "hero.side": "MORE<br>THAN<br>A FRAGRANCE",

    "coll.eyebrow": "THE COLLECTION",
    "coll.title": "Our Collection",
    "coll.count": "{n} fragrances",
    "coll.search": "Search your fragrance...",
    "coll.clear": "Clear search",
    "coll.empty.title": "No fragrance found",
    "coll.empty.text": "Try another name, inspired fragrance, or filter.",
    "coll.empty.reset": "Show all fragrances",

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
    "hero.f1": "جودة<br>فائقة",
    "hero.f2": "مستوحاة من<br>عطور شهيرة",
    "hero.f3": "عطر<br>لكل حكاية",
    "hero.side": "أكثر<br>من مجرد<br>عطر",

    "coll.eyebrow": "المجموعة",
    "coll.title": "مجموعتنا",
    "coll.count": "{n} عطر",
    "coll.search": "ابحث عن عطرك...",
    "coll.clear": "مسح البحث",
    "coll.empty.title": "لم نجد عطراً",
    "coll.empty.text": "جرّب اسماً آخر أو عطراً مستوحى أو فلتراً مختلفاً.",
    "coll.empty.reset": "عرض كل العطور",

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

/* Arabic product content helper */
function pt(product, field) {
  const ar = PRODUCT_AR[product.id];
  if (currentLang === "ar" && ar && ar[field] != null) return ar[field];
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