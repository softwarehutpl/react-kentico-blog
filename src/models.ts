import { ContentItem, Fields, FieldModels } from 'kentico-cloud-delivery';

export class Post extends ContentItem {
  slug: Fields.UrlSlugField;
  title: Fields.TextField;
  content: Fields.RichTextField;
  images: Fields.AssetsField;
  post_date: Fields.DateTimeField;

  get image(): FieldModels.AssetModel {
    return this.images.value[0];
  }
}
