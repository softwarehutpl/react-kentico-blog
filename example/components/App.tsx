import React from 'react';
import { DeliveryClient } from 'kentico-cloud-delivery';
import { BlogProvider, Post } from 'react-kentico-blog';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

import { projectId } from '@example/config';
import { LowLevelList } from '@example/components/LowLevel.List';
import { LowLevelSingle } from '@example/components/LowLevel.Single';
import { HighLevelSingle } from './HighLevel.Single';

const client = new DeliveryClient({
  projectId,
  typeResolvers: [{ type: 'post', resolve: () => new Post() }],
});

export function App() {
  return (
    <BlogProvider client={client}>
      <BrowserRouter>
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand>react-kentico-blog</Navbar.Brand>
          <Nav>
            <Nav.Link as={NavLink} to="/lowlevel/single">
              Low Level: Single
            </Nav.Link>
            <Nav.Link as={NavLink} to="/lowlevel/list">
              Low Level: List
            </Nav.Link>
            <Nav.Link as={NavLink} to="/highlevel/single">
              High Level: Single Post
            </Nav.Link>
            <Nav.Link as={NavLink} to="/highlevel/list">
              High Level: Post Listing
            </Nav.Link>
          </Nav>
        </Navbar>
        <hr />
        <Route path="/lowlevel/single" component={LowLevelSingle} />
        <Route path="/lowlevel/list" component={LowLevelList} />
        <Route path="/highlevel/single" component={HighLevelSingle} />
      </BrowserRouter>
    </BlogProvider>
  );
}
