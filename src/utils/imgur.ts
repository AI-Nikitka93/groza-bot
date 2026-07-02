import { ENV } from '../env';

/**
 * Загружает изображение (буфер) на анонимный API Imgur.
 * @param imageBuffer Буфер сгенерированного изображения
 * @returns Прямая ссылка на загруженное изображение
 */
export async function uploadToImgur(imageBuffer: Buffer): Promise<string> {
  if (!ENV.IMGUR_CLIENT_ID) {
    throw new Error('IMGUR_CLIENT_ID is not configured');
  }

  // Конвертируем буфер в Base64
  const base64Image = imageBuffer.toString('base64');

  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      'Authorization': `Client-ID ${ENV.IMGUR_CLIENT_ID}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: base64Image,
      type: 'base64'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Imgur upload failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  if (data.success && data.data && data.data.link) {
    return data.data.link; // Публичный URL изображения
  } else {
    throw new Error('Imgur response did not contain a valid link');
  }
}
