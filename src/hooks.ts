import { ContentItem, DeliveryClient, SortOrder, MultipleItemQuery } from 'kentico-cloud-delivery';
import { useContext, useEffect, useState, useRef } from 'react';
import deepEqual from 'deep-equal';

import { BlogContext } from './BlogProvider';

export function useKentico(): DeliveryClient {
  const { client } = useContext(BlogContext);

  return client;
}

type MaybeArray<T> = T | T[];

interface FilterRange {
  from: number;
  to: number;
}

interface FilterComplex {
  all?: MaybeArray<string>;
  any?: MaybeArray<string>;
  contains?: MaybeArray<string>;
  in?: MaybeArray<string>;
  gt?: string;
  gte?: string;
  lt?: string;
  lte?: string;
  range?: FilterRange;
}

type Filter = FilterComplex | string;
interface Filters {
  [k: string]: Filter;
}

interface ListOptions {
  depth?: number;
  sort?: SortOrder;
  orderBy?: string;
  page?: number;
  pageSize?: number;
  filter?: Filters;
}

const listDefaults: ListOptions = {
  pageSize: 20,
};

function forceArray<T>(val: MaybeArray<T>): T[] {
  if (!val) {
    return null;
  }
  return Array.isArray(val) ? val : [val];
}

function simpleFilter(
  request: MultipleItemQuery<any>,
  field: string,
  method: string,
  val: MaybeArray<string>
) {
  if (val) {
    request[method](`elements.${field}`, val);
  }
}

export function useList<T extends ContentItem>(model: string, options: ListOptions = {}): T[] {
  const client = useKentico();
  const [list, setList] = useState<T[]>([]);
  const filter = useRef<Filters>();

  useEffect(() => {
    if (options.filter && deepEqual(filter.current, options.filter)) {
      /* istanbul ignore next: FIXME - no easy way to test with current hook testing helper :( */
      return;
    }
    filter.current = options.filter;

    const request = client.items<T>().type(model);

    if (options.depth) {
      request.depthParameter(options.depth);
    }
    if (options.orderBy) {
      request.orderParameter(`elements.${options.orderBy}`, options.sort || SortOrder.asc);
    }
    if (options.page >= 0) {
      request.skipParameter(options.page * (options.pageSize || listDefaults.pageSize));
      request.limitParameter(options.pageSize || listDefaults.pageSize);
    }
    if (options.filter) {
      for (let [field, filter] of Object.entries(options.filter)) {
        if (typeof filter === 'string') {
          request.equalsFilter(`elements.${field}`, filter);
          continue;
        }

        simpleFilter(request, field, 'allFilter', forceArray(filter.all));
        simpleFilter(request, field, 'anyFilter', forceArray(filter.any));
        simpleFilter(request, field, 'containsFilter', forceArray(filter.contains));
        simpleFilter(request, field, 'inFilter', forceArray(filter.in));
        simpleFilter(request, field, 'greaterThanFilter', filter.gt);
        simpleFilter(request, field, 'greaterThanOrEqualFilter', filter.gte);
        simpleFilter(request, field, 'lessThanFilter', filter.lt);
        simpleFilter(request, field, 'lessThanOrEqualFilter', filter.lte);
        if (filter.range) {
          request.rangeFilter(`elements.${field}`, filter.range.from, filter.range.to);
        }
      }
    }

    const subscription = request.getObservable().subscribe(
      /* istanbul ignore next: would test React and/or RxJS */
      res => setList(res.items)
    );

    /* istanbul ignore next: would test React */
    return () => subscription.unsubscribe();
  }, [
    model,
    options.depth,
    options.sort,
    options.orderBy,
    options.page,
    options.pageSize,
    options.filter,
  ]);

  return list;
}

interface SingleOptions {
  filterBy: string;
}

export function useSingle<T extends ContentItem>(
  model: string,
  key: string,
  options: SingleOptions
): T {
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
  }, [model, key]);

  return item;
}
