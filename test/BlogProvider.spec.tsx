import { mount, shallow } from 'enzyme';
import { DeliveryClient } from 'kentico-cloud-delivery';
import React from 'react';
import { BlogContext, BlogProvider } from 'react-kentico-blog';

describe('BlogProvider', () => {
  it('renders children', () => {
    const children = <div>test!</div>;
    const wrapper = shallow(<BlogProvider client={null}>{children}</BlogProvider>);

    expect(wrapper.contains(children)).toBe(true);
  });

  // TODO: ugly, figure out something better
  it('provides a proper context', () => {
    const client = ({} as unknown) as DeliveryClient;

    function ContextCheck() {
      const context = React.useContext(BlogContext);
      expect(context.client).toBe(client);

      return null;
    }

    mount(
      <BlogProvider client={client}>
        <ContextCheck />
      </BlogProvider>
    );
  });
});
