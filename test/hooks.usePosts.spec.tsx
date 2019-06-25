// tslint:disable:react-hooks-nesting

import { SortOrder } from 'kentico-cloud-delivery';
import { usePosts } from 'react-kentico-blog';
import { lastHTTPUrl, mountContextHook } from './helper';

describe('usePosts', () => {
  it('queries a list of posts', () => {
    const page = 0;
    const { httpService } = mountContextHook(() => usePosts(page));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastHTTPUrl(httpService);
    expect(fetchedUrl).toMatch(`system.type=post`);
    expect(fetchedUrl).toMatch(`skip=${page * 20}`);
    expect(fetchedUrl).toMatch(`limit=20`);
    expect(fetchedUrl).toMatch(`order=elements.post_date`);
  });

  it('supports sorting', () => {
    const options = {
      sort: SortOrder.desc,
    };
    const { httpService } = mountContextHook(() => usePosts(0, options));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastHTTPUrl(httpService);
    expect(fetchedUrl).toMatch(`order=elements.post_date[${options.sort}]`);
  });

  it('supports filtering by category', () => {
    const options = {
      sort: SortOrder.desc,
    };
    const { httpService } = mountContextHook(() => usePosts(0, options));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastHTTPUrl(httpService);
    expect(fetchedUrl).toMatch(`order=elements.post_date[${options.sort}]`);
  });
});
