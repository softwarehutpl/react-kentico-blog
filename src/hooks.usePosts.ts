import { Post } from './models';
import { useList, Filters } from 'react-kentico-blog';
import { SortOrder } from 'kentico-cloud-delivery';

export interface Options {
  sort?: SortOrder;
  orderBy?: keyof Post;
  category?: string;
}

export function usePosts(page: number, options: Options = {}): Post[] {
  const filter: Filters = {};

  if (options.category) {
    filter.category = {
      contains: options.category,
    };
  }

  return useList<Post>('post', {
    page,
    orderBy: (options.orderBy || 'post_date') as string,
    sort: options.sort,
    filter,
  });
}
