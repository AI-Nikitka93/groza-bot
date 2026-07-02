import { ENV } from '../env';
import { redis } from '../cache/upstash';

export class ThreadsPublisher {
  private readonly PACING_KEY = 'threads_last_post_timestamp';
  private readonly PACING_INTERVAL_MS = 15 * 60 * 1000; // 15 минут

  /**
   * Публикует алерт в Threads с учетом пейсинга.
   * @param imageUrl Публичная ссылка на картинку (из Imgur)
   * @param text Текст алерта
   */
  public async publishAlert(imageUrl: string, text: string): Promise<string> {
    if (!ENV.THREADS_USER_ID || !ENV.THREADS_ACCESS_TOKEN) {
      throw new Error('Threads credentials are not configured');
    }

    // 1. Проверка Pacing
    const lastPostStr = await redis.get(this.PACING_KEY);
    if (lastPostStr) {
      const lastPostTime = parseInt(lastPostStr, 10);
      const timeSinceLastPost = Date.now() - lastPostTime;
      if (timeSinceLastPost < this.PACING_INTERVAL_MS) {
        throw new Error(`Pacing limit active: Cannot post for another ${(this.PACING_INTERVAL_MS - timeSinceLastPost) / 1000} seconds`);
      }
    }

    try {
      // 2. Этап 1: Создание контейнера (Media Container)
      const creationId = await this.createMediaContainer(imageUrl, text);
      
      // Небольшая задержка, чтобы сервера Meta успели скачать картинку с Imgur
      await new Promise(resolve => setTimeout(resolve, 5000));

      // 3. Этап 2: Публикация контейнера
      const postId = await this.publishContainer(creationId);

      // 4. Обновление таймстемпа в Redis
      await redis.set(this.PACING_KEY, Date.now().toString());

      return postId;
    } catch (error: any) {
      console.error('Failed to publish to Threads:', error);
      throw error;
    }
  }

  private async createMediaContainer(imageUrl: string, text: string): Promise<string> {
    const url = new URL(`https://graph.threads.net/v1.0/${ENV.THREADS_USER_ID}/threads`);
    url.searchParams.append('media_type', 'IMAGE');
    url.searchParams.append('image_url', imageUrl);
    url.searchParams.append('text', text);
    url.searchParams.append('access_token', ENV.THREADS_ACCESS_TOKEN);

    const res = await fetch(url.toString(), { method: 'POST' });
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Meta API Container Error: ${data.error?.message || res.statusText}`);
    }

    return data.id; // creation_id
  }

  private async publishContainer(creationId: string): Promise<string> {
    const url = new URL(`https://graph.threads.net/v1.0/${ENV.THREADS_USER_ID}/threads_publish`);
    url.searchParams.append('creation_id', creationId);
    url.searchParams.append('access_token', ENV.THREADS_ACCESS_TOKEN);

    const res = await fetch(url.toString(), { method: 'POST' });
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Meta API Publish Error: ${data.error?.message || res.statusText}`);
    }

    return data.id; // опубликованный ID поста
  }
}
