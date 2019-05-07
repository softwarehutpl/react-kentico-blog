import { Post } from './models';
import { useList } from 'react-kentico-blog';
import { SortOrder } from 'kentico-cloud-delivery';

interface Options {
  search?: string;
  sort?: SortOrder;
}

export function usePosts(page: number, options: Options = {}): Post[] {
  const filter = {};
  if (options.search) {
    const contains = options.search.split(' ');
    filter['content'] = { contains };
    filter['title'] = { contains };
  }
  return useList<Post>('post', {
    page,
    filter,
    orderBy: 'post_date',
    sort: options.sort,
  });
}
