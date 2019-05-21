import React, { useState } from 'react';
import { useList, useSingle, Post } from 'react-kentico-blog';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { PostSingle } from '@example/components/PostSingle';
import { PostList } from '@example/components/PostList';
import { GHLink } from './GHLink';

export function LowLevelList() {
  const [selected, setSelected] = useState<string>(null);
  const posts = useList<Post>('post');
  const post = useSingle<Post>('post', selected, { filterBy: 'slug' });

  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <GHLink filename="components/LowLevel.List.tsx" />
            <Breadcrumb.Item>Low Level</Breadcrumb.Item>
            <Breadcrumb.Item active>List</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <PostList posts={posts} selected={selected} select={setSelected} />
        </Col>
        <Col xs={8}>
          <PostSingle post={post} />
        </Col>
      </Row>
    </Container>
  );
}
