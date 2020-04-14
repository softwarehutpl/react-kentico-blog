import { useTaxonomy } from 'react-kentico-blog';

export function useCategories() {
  return useTaxonomy('category');
}
