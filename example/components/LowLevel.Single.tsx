import React, { useState, useEffect } from 'react';
import SanitizedHTML from 'react-sanitized-html';
import { useList, useSingle, Post } from 'react-kentico-blog';
import { Badge, Container, Row, Col, ListGroup, Breadcrumb, Image } from 'react-bootstrap';
import moment from 'moment';
import { PostSingle } from '@example/components/PostSingle';

export function LowLevelSingle() {
  const post = useSingle<Post>('post', 'test-post', { filterBy: 'slug' });

  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
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
