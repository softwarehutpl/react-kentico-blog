import React, { useState } from 'react';
import { usePosts, usePost } from 'react-kentico-blog';
import { Container, Row, Col, Breadcrumb, Button, FormControl } from 'react-bootstrap';
import { PostSingle } from '@example/components/PostSingle';
import { PostList } from '@example/components/PostList';
import { SortOrder } from 'kentico-cloud-delivery';
import { GHLink } from './GHLink';

export function HighLevelList() {
  const [selected, setSelected] = useState<string>(null);
  const [sort, setSort] = useState<SortOrder>(SortOrder.asc);
  const [orderBy, setOrderBy] = useState<string>('post_date');
  const posts = usePosts(0, { sort, orderBy });
  const post = usePost(selected);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <GHLink filename="components/HighLevel.List.tsx" />
            <Breadcrumb.Item>High Level</Breadcrumb.Item>
            <Breadcrumb.Item active>Post Listing</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row />
      <Row>
        <Col xs={2}>
          <Button
            variant={orderBy === 'post_date' ? 'primary' : 'outline-primary'}
            onClick={() => setOrderBy('post_date')}>
            Date
          </Button>
          &nbsp;
          <Button
            variant={orderBy === 'title' ? 'primary' : 'outline-primary'}
            onClick={() => setOrderBy('title')}>
            Title
          </Button>
          &nbsp;
          <hr />
        </Col>
        <Col xs={2} style={{ textAlign: 'right' }}>
          <Button
            variant={sort === SortOrder.asc ? 'primary' : 'outline-primary'}
            onClick={() => setSort(SortOrder.asc)}>
            Asc
          </Button>
          &nbsp;
          <Button
            variant={sort === SortOrder.desc ? 'primary' : 'outline-primary'}
            onClick={() => setSort(SortOrder.desc)}>
            Desc
          </Button>
          &nbsp;
          <hr />
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
