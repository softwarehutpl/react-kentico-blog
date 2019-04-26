import { ContentItem, DeliveryClient, SortOrder } from 'kentico-cloud-delivery';
import { useContext, useEffect, useState } from 'react';

import { BlogContext } from './BlogProvider';

export function useKentico(): DeliveryClient {
  const { client } = useContext(BlogContext);

  return client;
}

interface ListOptions {
  depth?: number;
  sort?: SortOrder;
  orderBy?: string;
  page?: number;
  pageSize?: number;
}

const listDefaults: ListOptions = {
  pageSize: 20,
};

export function useList<T extends ContentItem>(model: string, options: ListOptions = {}): T[] {
  const client = useKentico();
  const [list, setList] = useState<T[]>([]);

  useEffect(() => {
    const request = client.items<T>().type(model);

    if (options.depth) {
      request.depthParameter(options.depth);
    }
    if (options.orderBy) {
      request.orderParameter(options.orderBy, options.sort || SortOrder.asc);
    }
    if (options.page >= 0) {
      request.skipParameter(options.page * (options.pageSize || listDefaults.pageSize));
      request.limitParameter(options.pageSize || listDefaults.pageSize);
    }

    const subscription = request.getObservable().subscribe(
      /* istanbul ignore next: would test React and/or RxJS */
      res => setList(res.items)
    );

    /* istanbul ignore next: would test React */
    return () => subscription.unsubscribe();
  }, [model, options.depth, options.sort, options.orderBy, options.page, options.pageSize]);

  return list;
}

interface SingleOptions {
  filterBy: string;
}

export function useSingle<T extends ContentItem>(
  model: string,
  key: string,
  options: SingleOptions
) {
  const client = useKentico();
  const [item, setItem] = useState<T>();

  useEffect(() => {
    const request = client
      .items<T>()
      .type(model)
      .equalsFilter(`elements.${options.filterBy}`, key)
      .limitParameter(1);

    const subscription = request.getObservable().subscribe(
      /* istanbul ignore next: would test React and/or RxJS */
      res => setItem(res.firstItem)
    );

    /* istanbul ignore next: would test React */
    return () => subscription.unsubscribe();
  }, [model]);

  return item;
}
