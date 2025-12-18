import { motion } from 'framer-motion';

interface ResultDisplayProps {
  resultImage: string;
  personImage: string;
  clothingImage: string;
  onReset: () => void;
  onTryAnother: () => void;
}

export function ResultDisplay({
  resultImage,
  personImage,
  clothingImage,
  onReset,
  onTryAnother,
}: ResultDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `virtual-tryon-${Date.now()}.png`;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Готово! Вот как выглядит одежда на вас
          </h2>
          <p className="text-gray-600">Результат обработки искусственным интеллектом</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <h3 className="font-semibold text-center mb-3 text-gray-700">Оригинальное фото</h3>
            <img
              src={personImage}
              alt="Original"
              className="rounded-lg shadow-md w-full h-64 object-cover"
            />
          </div>

          <div>
            <h3 className="font-semibold text-center mb-3 text-gray-700">Выбранная одежда</h3>
            <img
              src={clothingImage}
              alt="Clothing"
              className="rounded-lg shadow-md w-full h-64 object-cover"
            />
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold text-center mb-3 text-purple-600">Результат</h3>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={resultImage}
              alt="Result"
              className="rounded-lg shadow-xl w-full h-64 object-cover ring-4 ring-purple-400"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <img
              src={resultImage}
              alt="Full result"
              className="rounded-lg shadow-2xl max-h-[600px] object-contain"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            ⬇️ Скачать
          </button>

          <button
            onClick={onTryAnother}
            className="bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            👗 Примерить другую одежду
          </button>

          <button
            onClick={onReset}
            className="bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
          >
            🔄 Начать заново
          </button>
        </div>
      </div>
    </motion.div>
  );
}