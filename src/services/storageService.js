import { CLOUDINARY_CONFIG } from '../config/cloudinary';

export const uploadImage = async (uri) => {
  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: `cleantrack_${Date.now()}.jpg`,
  });
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', 'cleantrack');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.secure_url;
};

export const uploadMultipleImages = async (uris) => {
  const uploadPromises = uris.map((uri) => uploadImage(uri));
  return Promise.all(uploadPromises);
};
