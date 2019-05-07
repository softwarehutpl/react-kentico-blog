// tslint:disable:react-hooks-nesting

import { DeliveryClient, SortOrder } from 'kentico-cloud-delivery';
import { useKentico, useList, useSingle } from 'react-kentico-blog';
import { lastCallArg, mountContextHook } from './helper';

describe('useKentico', () => {
  it('returns the DeliveryClient from context', () => {
    const { result } = mountContextHook(useKentico);

    expect(result).toBeInstanceOf(DeliveryClient);
  });
});

describe('useList', () => {
  it('queries a list of content items', () => {
    const modelName = 'test';
    const { httpService } = mountContextHook(() => useList(modelName));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastCallArg(httpService.get, 0).url;
    expect(fetchedUrl).toMatch(`system.type=${modelName}`);
  });

  it('supports pagination', () => {
    const modelName = 'test';
    const options = {
      page: 0,
      pageSize: 20,
    };
    const { httpService } = mountContextHook(() => useList(modelName, options));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastCallArg(httpService.get, 0).url;
    expect(fetchedUrl).toMatch(`skip=${options.page * options.pageSize}`);
    expect(fetchedUrl).toMatch(`limit=${options.pageSize}`);
  });

  it('uses default page size', () => {
    const modelName = 'test';
    const options = {
      page: 0,
    };
    const { httpService } = mountContextHook(() => useList(modelName, options));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastCallArg(httpService.get, 0).url;
    expect(fetchedUrl).toMatch(`skip=${options.page * 20}`);
    expect(fetchedUrl).toMatch(`limit=20`);
  });

  it('supports sorting and depth', () => {
    const modelName = 'test';
    const options = {
      depth: 2,
      orderBy: 'name',
      sort: SortOrder.asc,
    };
    const { httpService } = mountContextHook(() => useList(modelName, options));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastCallArg(httpService.get, 0).url;
    expect(fetchedUrl).toMatch(`order=elements.${options.orderBy}[${options.sort}]`);
    expect(fetchedUrl).toMatch(`depth=${options.depth}`);
  });

  it('sorts ascending by default', () => {
    const modelName = 'test';
    const options = {
      orderBy: 'name',
    };
    const { httpService } = mountContextHook(() => useList(modelName, options));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastCallArg(httpService.get, 0).url;
    expect(fetchedUrl).toMatch(`order=elements.${options.orderBy}[${SortOrder.asc}]`);
  });

  it('supports filtering', () => {
    const modelName = 'test';
    const options = {
      filter: {
        testField: '1234',
        testField2: {
          contains: 'asdf',
        },
        testImpossible: {
          any: ['test1', 'test2'],
          all: ['test1', 'test2'],
          in: ['abc'],
          gt: '1',
          gte: '2',
          lt: '3',
          lte: '4',
          range: { from: 1, to: 5 },
        },
      },
    };
    const { httpService } = mountContextHook(() => useList(modelName, options));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastCallArg(httpService.get, 0).url;
    expect(fetchedUrl).toMatch(`elements.testField=${options.filter.testField}`);
    expect(fetchedUrl).toMatch(
      `elements.testField2[contains]=${options.filter.testField2.contains}`
    );
    for (let [filter, value] of Object.entries(options.filter.testImpossible)) {
      if (filter === 'range') {
        expect(fetchedUrl).toMatch(
          `elements.testImpossible[range]=${(value as any).from},${(value as any).to}`
        );
      } else {
        expect(fetchedUrl).toMatch(`elements.testImpossible[${filter}]=${value}`);
      }
    }
  });
});

describe('useSingle', () => {
  it('queries a single content item', () => {
    const modelName = 'test';
    const id = 'testID';
    const options = {
      filterBy: 'id',
    };
    const { httpService } = mountContextHook(() => useSingle(modelName, id, options));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastCallArg(httpService.get, 0).url;
    expect(fetchedUrl).toMatch(`system.type=${modelName}`);
    expect(fetchedUrl).toMatch(`elements.${options.filterBy}=${id}`);
    expect(fetchedUrl).toMatch('limit=1');
  });
});
