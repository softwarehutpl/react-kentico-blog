// tslint:disable:react-hooks-nesting

import { useCategories } from 'react-kentico-blog';
import { lastHTTPUrl, mountContextHook } from './helper';

describe('useCategories', () => {
  it('queries a list of categories', () => {
    const { httpService } = mountContextHook(() => useCategories());

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastHTTPUrl(httpService);
    expect(fetchedUrl).toMatch(`/taxonomies/category`);
  });
});
