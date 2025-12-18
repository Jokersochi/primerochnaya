import { PricingPlan } from '../config/pricing';

export interface PaymentProvider {
  initiatePayment(plan: PricingPlan): Promise<string>;
  verifyPayment(paymentId: string): Promise<boolean>;
}

// ЮKassa Integration
export class YuKassaProvider implements PaymentProvider {
  private shopId: string;
  private secretKey: string;

  constructor() {
    this.shopId = import.meta.env.VITE_YUKASSA_SHOP_ID || '';
    this.secretKey = import.meta.env.VITE_YUKASSA_SECRET_KEY || '';
  }

  async initiatePayment(plan: PricingPlan): Promise<string> {
    // В production используйте серверный endpoint для безопасности
    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': this.generateIdempotenceKey(),
        'Authorization': `Basic ${btoa(`${this.shopId}:${this.secretKey}`)}`
      },
      body: JSON.stringify({
        amount: {
          value: plan.price.toFixed(2),
          currency: plan.currency
        },
        confirmation: {
          type: 'redirect',
          return_url: `${window.location.origin}/payment/success`
        },
        capture: true,
        description: `Подписка ${plan.nameRu}`,
        metadata: {
          plan_id: plan.id
        }
      })
    });

    const data = await response.json();
    return data.confirmation.confirmation_url;
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      headers: {
        'Authorization': `Basic ${btoa(`${this.shopId}:${this.secretKey}`)}`
      }
    });

    const data = await response.json();
    return data.status === 'succeeded';
  }

  private generateIdempotenceKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}

// Stripe Integration (для международных платежей)
export class StripeProvider implements PaymentProvider {
  private publishableKey: string;

  constructor() {
    this.publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
  }

  async initiatePayment(plan: PricingPlan): Promise<string> {
    // В production используйте Stripe Checkout Session через бэкенд
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId: plan.stripePriceId,
        planId: plan.id
      })
    });

    const { url } = await response.json();
    return url;
  }

  async verifyPayment(sessionId: string): Promise<boolean> {
    const response = await fetch(`/api/verify-payment/${sessionId}`);
    const { paid } = await response.json();
    return paid;
  }
}

// Factory для выбора провайдера
export function getPaymentProvider(country: string = 'RU'): PaymentProvider {
  if (country === 'RU') {
    return new YuKassaProvider();
  }
  return new StripeProvider();
}

export async function initiatePurchase(plan: PricingPlan): Promise<void> {
  const provider = getPaymentProvider();
  const paymentUrl = await provider.initiatePayment(plan);
  window.location.href = paymentUrl;
}