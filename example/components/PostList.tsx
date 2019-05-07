import React, { FunctionComponent } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import moment from 'moment';

import { Post } from 'react-kentico-blog';

interface Props {
  posts: Post[];
  selected?: string;
  select: (slug: string) => void;
}

export const PostList: FunctionComponent<Props> = ({ posts, selected, select }) => {
  if (!posts) {
    return null;
  }

  return (
    <ListGroup>
      {posts.map(post => (
        <ListGroup.Item
          key={post.slug.value}
          active={selected === post.slug.value}
          onClick={() => select(post.slug.value)}
          action>
          <Badge variant="light">{moment(post.system.lastModified).format('LL')}</Badge>{' '}
          {post.title.text}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
