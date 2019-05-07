import { Post } from './models';
import { useSingle } from './hooks';

export function usePost(slug: string): Post {
  return useSingle<Post>('post', slug, { filterBy: 'slug' });
}
