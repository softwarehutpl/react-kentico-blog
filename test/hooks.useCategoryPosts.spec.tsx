// tslint:disable:react-hooks-nesting

import { useCategoryPosts } from 'react-kentico-blog';
import { lastHTTPUrl, mountContextHook } from './helper';

describe('useCategoryPosts', () => {
  it('queries post from selected category', () => {
    const category = 'test';
    const { httpService } = mountContextHook(() => useCategoryPosts(category, 1));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastHTTPUrl(httpService);
    expect(fetchedUrl).toMatch(`elements.category[contains]=${category}`);
  });
});
