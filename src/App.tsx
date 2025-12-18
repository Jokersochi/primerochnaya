import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUploader } from './components/ImageUploader';
import { ClothingSelector } from './components/ClothingSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateTryOnImage } from './services/gemini';
import { cn } from './utils/cn';

type Step = 'upload-person' | 'upload-clothing' | 'processing' | 'result';

function App() {
  const [step, setStep] = useState<Step>('upload-person');
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePersonUpload = (image: string) => {
    setPersonImage(image);
    setStep('upload-clothing');
    setError(null);
  };

  const handleClothingUpload = async (image: string) => {
    setClothingImage(image);
    setStep('processing');
    setError(null);

    try {
      const result = await generateTryOnImage(personImage!, image);
      setResultImage(result);
      setStep('result');
    } catch (err) {
      setError('Ошибка при обработке изображения. Попробуйте снова.');
      setStep('upload-clothing');
      console.error(err);
    }
  };

  const handleReset = () => {
    setStep('upload-person');
    setPersonImage(null);
    setClothingImage(null);
    setResultImage(null);
    setError(null);
  };

  const handleTryAnother = () => {
    setStep('upload-clothing');
    setClothingImage(null);
    setResultImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            👗 Виртуальная Примерочная
          </h1>
          <p className="text-gray-600 mt-1">Примерьте одежду с помощью искусственного интеллекта</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              {error}
            </motion.div>
          )}

          {step === 'upload-person' && (
            <motion.div
              key="upload-person"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ImageUploader
                onUpload={handlePersonUpload}
                title="Шаг 1: Загрузите ваше фото"
                description="Выберите фото в полный рост для лучшего результата"
                icon="👤"
              />
            </motion.div>
          )}

          {step === 'upload-clothing' && (
            <motion.div
              key="upload-clothing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ClothingSelector
                onUpload={handleClothingUpload}
                onBack={handleReset}
                personImage={personImage!}
              />
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <LoadingSpinner />
            </motion.div>
          )}

          {step === 'result' && resultImage && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ResultDisplay
                resultImage={resultImage}
                personImage={personImage!}
                clothingImage={clothingImage!}
                onReset={handleReset}
                onTryAnother={handleTryAnother}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-16 py-8 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>Создано с использованием Google Gemini AI</p>
          <p className="text-sm mt-2">© 2025 Виртуальная Примерочная</p>
        </div>
      </footer>
    </div>
  );
}

export default App;