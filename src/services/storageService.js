import { CLOUDINARY_CONFIG } from '../config/cloudinary';

export const uploadImage = async (uri) => {
  // Determine file type from URI
  const fileExtension = uri.split('.').pop()?.toLowerCase() || 'jpg';
  const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';

  const formData = new FormData();
  formData.append('file', {
    uri: uri.startsWith('file://') ? uri : `file://${uri}`,
    type: mimeType,
    name: `cleantrack_${Date.now()}.${fileExtension}`,
  });
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', 'cleantrack');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Cloudinary upload error:', data.error);
      throw new Error(data.error.message);
    }

    if (!data.secure_url) {
      console.error('Cloudinary response missing secure_url:', data);
      throw new Error('Upload succeeded but no URL was returned');
    }

    console.log('Image uploaded successfully:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Image upload failed:', error.message, 'URI:', uri);
    throw error;
  }
};

export const uploadMultipleImages = async (uris) => {
  const results = [];
  for (const uri of uris) {
    const url = await uploadImage(uri);
    results.push(url);
  }
  return results.filter((url) => url && url.length > 0);
};
