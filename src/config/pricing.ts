export interface PricingPlan {
  id: string;
  name: string;
  nameRu: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  featuresRu: string[];
  popular?: boolean;
  stripePriceId?: string;
  yukassaPriceId?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    nameRu: 'Бесплатно',
    price: 0,
    currency: 'RUB',
    interval: 'month',
    features: [
      '5 try-ons per day',
      'Standard poses',
      'Basic wardrobe',
      'Watermarked images'
    ],
    featuresRu: [
      '5 примерок в день',
      'Стандартные позы',
      'Базовая библиотека',
      'Водяной знак на изображениях'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    nameRu: 'Премиум',
    price: 699,
    currency: 'RUB',
    interval: 'month',
    popular: true,
    features: [
      'Unlimited try-ons',
      'All poses & angles',
      'Upload your clothes',
      'No watermarks',
      'Priority processing',
      'HD quality images'
    ],
    featuresRu: [
      'Неограниченные примерки',
      'Все позы и ракурсы',
      'Загрузка своей одежды',
      'Без водяных знаков',
      'Приоритетная обработка',
      'HD качество изображений'
    ],
    stripePriceId: 'price_premium_monthly',
    yukassaPriceId: 'premium_monthly'
  },
  {
    id: 'pro',
    name: 'Pro',
    nameRu: 'Про',
    price: 1999,
    currency: 'RUB',
    interval: 'month',
    features: [
      'Everything in Premium',
      'API access',
      'White-label option',
      'E-commerce integration',
      'Analytics & insights',
      'Dedicated support'
    ],
    featuresRu: [
      'Всё из Premium',
      'API доступ',
      'Белая метка',
      'Интеграция с магазинами',
      'Аналитика и статистика',
      'Персональная поддержка'
    ],
    stripePriceId: 'price_pro_monthly',
    yukassaPriceId: 'pro_monthly'
  }
];

export const B2B_PLANS = [
  {
    name: 'Starter',
    nameRu: 'Старт',
    price: 19900,
    tryOns: 1000,
    features: [
      'До 1000 примерок/мес',
      'API интеграция',
      'Техподдержка 5/2',
      'Базовая аналитика'
    ]
  },
  {
    name: 'Business',
    nameRu: 'Бизнес',
    price: 39900,
    tryOns: 5000,
    popular: true,
    features: [
      'До 5000 примерок/мес',
      'Приоритетный API',
      'Техподдержка 24/7',
      'Расширенная аналитика',
      'Кастомизация'
    ]
  },
  {
    name: 'Enterprise',
    nameRu: 'Корпоративный',
    price: 99900,
    tryOns: 20000,
    features: [
      'До 20000 примерок/мес',
      'Выделенный сервер',
      'SLA 99.9%',
      'Персональный менеджер',
      'Полная кастомизация',
      'On-premise опция'
    ]
  }
];