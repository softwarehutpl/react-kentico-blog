import { Post } from 'react-kentico-blog';
import { Fields, FieldModels } from 'kentico-cloud-delivery';

describe('models', () => {
  describe('Post', () => {
    it('returns the first image', () => {
      const post = new Post();
      post.images = new Fields.AssetsField('images', [
        new FieldModels.AssetModel('', '', 0, '', 'test-url'),
      ]);
      // @ts-ignore
      expect(post.image).toBe(post?.images?.value[0]);
    });
  });
});
