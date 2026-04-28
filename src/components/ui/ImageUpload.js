'use client';
// src/components/ui/ImageUpload.js

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { uploadToCloudinary } from '@/lib/cloudinary';
import toast from 'react-hot-toast';

export default function ImageUpload({ value, onChange, label = 'Зураг' }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      onChange(result.url);
      toast.success('Зураг амжилттай upload хийгдлээ');
    } catch (error) {
      toast.error(error.message || 'Зураг upload хийхэд алдаа гарлаа');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>

      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          className={`
            flex flex-col items-center justify-center w-full h-48
            border-2 border-dashed border-gray-300 dark:border-gray-700
            rounded-xl cursor-pointer
            bg-gray-50 dark:bg-gray-800/50
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition-colors
          `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 mb-3 text-primary-500 animate-spin" />
                <p className="text-sm text-gray-500">Upload хийж байна...</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Дарж upload хийнэ үү</span>
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP (max 10MB)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
