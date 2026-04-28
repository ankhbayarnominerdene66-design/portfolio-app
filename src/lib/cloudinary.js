// src/lib/cloudinary.js

/**
 * Upload image to Cloudinary using unsigned preset
 * @param {File} file - Image file from input
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = async (file) => {
  if (!file) throw new Error('Файл байхгүй байна');

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary тохиргоо хийгдээгүй байна');
  }

  // Validate file
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Зургийн хэмжээ 10MB-ээс хэтэрсэн байна');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Зөвхөн зураг файл upload хийнэ үү');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Cloudinary upload амжилтгүй боллоо');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
