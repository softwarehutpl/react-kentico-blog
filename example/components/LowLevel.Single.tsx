import React from 'react';
import { useSingle, Post } from 'react-kentico-blog';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { PostSingle } from '@example/components/PostSingle';
import { GHLink } from './GHLink';

export function LowLevelSingle() {
  const post = useSingle<Post>('post', 'test-post', { filterBy: 'slug' });

  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <GHLink filename="components/LowLevel.Single.tsx" />
            <Breadcrumb.Item>Low Level</Breadcrumb.Item>
            <Breadcrumb.Item active>Single</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <PostSingle post={post} />
        </Col>
      </Row>
    </Container>
  );
}
