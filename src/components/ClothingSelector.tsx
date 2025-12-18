import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface ClothingSelectorProps {
  onUpload: (image: string) => void;
  onBack: () => void;
  personImage: string;
}

const SAMPLE_CLOTHES = [
  { id: 1, name: 'Красная футболка', url: 'https://via.placeholder.com/300x400/ff6b6b/ffffff?text=Red+T-Shirt' },
  { id: 2, name: 'Синяя рубашка', url: 'https://via.placeholder.com/300x400/4ecdc4/ffffff?text=Blue+Shirt' },
  { id: 3, name: 'Черное платье', url: 'https://via.placeholder.com/300x400/2d3436/ffffff?text=Black+Dress' },
  { id: 4, name: 'Белая блузка', url: 'https://via.placeholder.com/300x400/dfe6e9/000000?text=White+Blouse' },
];

export function ClothingSelector({ onUpload, onBack, personImage }: ClothingSelectorProps) {
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setCustomImage(result);
      setSelectedClothing(null);
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    const imageToUse = customImage || selectedClothing;
    if (imageToUse) {
      onUpload(imageToUse);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            ← Назад
          </button>
          <div className="text-center">
            <div className="text-6xl mb-4">👔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Шаг 2: Выберите одежду
            </h2>
            <p className="text-gray-600">Выберите из каталога или загрузите свою фотографию</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Ваше фото:</h3>
            <img
              src={personImage}
              alt="Your photo"
              className="rounded-lg shadow-lg w-full max-h-96 object-contain"
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Выберите одежду:</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {SAMPLE_CLOTHES.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedClothing(item.url);
                    setCustomImage(null);
                  }}
                  className={cn(
                    'cursor-pointer rounded-lg overflow-hidden border-4 transition-all',
                    selectedClothing === item.url
                      ? 'border-purple-600 shadow-xl'
                      : 'border-transparent hover:border-purple-300'
                  )}
                >
                  <img src={item.url} alt={item.name} className="w-full h-32 object-cover" />
                  <p className="text-sm text-center py-2 bg-gray-50">{item.name}</p>
                </motion.div>
              ))}
            </div>

            <div className="relative">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg py-8 px-4 hover:border-purple-400 hover:bg-purple-50 transition-all"
              >
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-sm text-gray-600">Загрузить свою одежду</p>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>

            {customImage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <img
                  src={customImage}
                  alt="Custom clothing"
                  className="rounded-lg shadow-lg max-h-64 mx-auto"
                />
              </motion.div>
            )}
          </div>
        </div>

        {(selectedClothing || customImage) && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Примерить →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}