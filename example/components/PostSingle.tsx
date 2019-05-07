import React, { FunctionComponent } from 'react';
import { Image, Badge } from 'react-bootstrap';
import SanitizedHTML from 'react-sanitized-html';
import moment from 'moment';
import { Post } from 'react-kentico-blog';

interface Props {
  post: Post;
}

export const PostSingle: FunctionComponent<Props> = ({ post }) => {
  if (!post) {
    return null;
  }

  return (
    <>
      <Image src={post.image.url} fluid rounded />
      <h1>{post.title.text}</h1>
      <Badge variant="dark">{moment(post.system.lastModified).format('LL')}</Badge>{' '}
      <SanitizedHTML html={post.content.value} />
    </>
  );
};
