import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface ImageUploaderProps {
  onUpload: (image: string) => void;
  title: string;
  description: string;
  icon: string;
}

export function ImageUploader({ onUpload, title, description, icon }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, загрузите изображение');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleConfirm = () => {
    if (preview) onUpload(preview);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{icon}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
            isDragging
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="max-h-96 mx-auto rounded-lg shadow-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                }}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Выбрать другое фото
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
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
              <div className="text-gray-600">
                <span className="font-semibold text-purple-600">Нажмите для загрузки</span> или
                перетащите файл
              </div>
              <p className="text-sm text-gray-500">PNG, JPG, WEBP до 10MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileInput}
          />
        </div>

        {preview && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleConfirm}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Продолжить →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}