import { Post } from './models';
import { useList } from 'react-kentico-blog';
import { SortOrder } from 'kentico-cloud-delivery';
import { useState, useEffect } from 'react';

interface Options {
  sort?: SortOrder;
  orderBy?: keyof Post;
}

export function usePosts(page: number, options: Options = {}): Post[] {
  return useList<Post>('post', {
    page,
    orderBy: (options.orderBy || 'post_date') as string,
    sort: options.sort,
  });
}
