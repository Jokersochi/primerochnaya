import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRICING_PLANS } from '../config/pricing';
import { initiatePurchase } from '../services/paymentService';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      onClose();
      return;
    }

    const plan = PRICING_PLANS.find(p => p.id === planId);
    if (!plan) return;

    setLoading(planId);
    try {
      await initiatePurchase(plan);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ошибка при оформлении платежа. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[900px] md:max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 overflow-auto"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Выберите тариф</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {PRICING_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative border-2 rounded-xl p-6 ${
                      plan.popular
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-gray-200'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Популярный
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">{plan.nameRu}</h3>
                      <div className="text-4xl font-bold">
                        {plan.price === 0 ? (
                          'Бесплатно'
                        ) : (
                          <>
                            {plan.price.toLocaleString('ru-RU')}
                            <span className="text-lg text-gray-500">₽/мес</span>
                          </>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.featuresRu.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={loading === plan.id}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        plan.popular
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === plan.id
                        ? 'Обработка...'
                        : plan.price === 0
                        ? 'Текущий план'
                        : 'Выбрать план'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center text-sm text-gray-500">
                <p>Безопасная оплата через ЮKassa • Отмена в любой момент</p>
                <p className="mt-2">
                  Для бизнеса доступны{' '}
                  <a href="/b2b" className="text-blue-500 hover:underline">
                    корпоративные тарифы
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PricingModal;