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
}

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

    const subscription = request.getObservable().subscribe(
      /* istanbul ignore next: would test React and/or RxJS */
      res => setList(res.items)
    );

    /* istanbul ignore next: would test React */
    return () => subscription.unsubscribe();
  }, [model, options.depth, options.sort, options.orderBy]);

  return list;
}
