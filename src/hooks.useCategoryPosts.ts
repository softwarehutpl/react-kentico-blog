import { Post } from './models';
import { usePosts, Options } from './hooks.usePosts';

export function useCategoryPosts(category: string, page: number, options: Options = {}): Post[] {
  return usePosts(page, {
    ...options,
    category,
  });
}
