// tslint:disable:react-hooks-nesting
import { usePost } from 'react-kentico-blog';
import { lastCallArg, mountContextHook } from './helper';

describe('usePost', () => {
  it('queries a single post', () => {
    const slug = 'test-post';
    const { httpService } = mountContextHook(() => usePost(slug));

    expect(httpService.get).toHaveBeenCalled();

    const fetchedUrl = lastCallArg(httpService.get, 0).url;
    expect(fetchedUrl).toMatch(`system.type=post`);
    expect(fetchedUrl).toMatch(`elements.slug=${slug}`);
    expect(fetchedUrl).toMatch('limit=1');
  });
});
