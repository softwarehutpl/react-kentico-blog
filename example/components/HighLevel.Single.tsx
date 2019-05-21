import React from 'react';
import { usePost } from 'react-kentico-blog';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { PostSingle } from '@example/components/PostSingle';
import { GHLink } from './GHLink';

export function HighLevelSingle() {
  const post = usePost('test-post');

  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <GHLink filename="components/HighLevel.Single.tsx" />
            <Breadcrumb.Item>High Level</Breadcrumb.Item>
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
