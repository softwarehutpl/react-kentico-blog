// tslint:disable:react-hooks-nesting

import { DeliveryClient, SortOrder } from 'kentico-cloud-delivery';
import { useKentico, useList } from 'react-kentico-blog';
import { lastCallArg, mountContextHook } from './helper';

describe('useKentico', () => {
  it('returns the DeliveryClient from context', () => {
    const { result } = mountContextHook(useKentico);

    expect(result).toBeInstanceOf(DeliveryClient);
  });
});

describe('useList', () => {
  it('queries a list of models', () => {
    const modelName = 'test';
    const { httpService } = mountContextHook(() => useList(modelName));

    expect(httpService.get).toHaveBeenCalled();
    expect(lastCallArg(httpService.get, 0).url).toMatch(`system.type=${modelName}`);
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
    expect(lastCallArg(httpService.get, 0).url).toMatch(
      `order=${options.orderBy}[${options.sort}]`
    );
    expect(lastCallArg(httpService.get, 0).url).toMatch(`depth=${options.depth}`);
  });

  it('sorts ascending by default', () => {
    const modelName = 'test';
    const options = {
      orderBy: 'name',
    };
    const { httpService } = mountContextHook(() => useList(modelName, options));

    expect(httpService.get).toHaveBeenCalled();
    expect(lastCallArg(httpService.get, 0).url).toMatch(
      `order=${options.orderBy}[${SortOrder.asc}]`
    );
  });
});
