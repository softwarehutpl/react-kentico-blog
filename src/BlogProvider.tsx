import { DeliveryClient } from 'kentico-cloud-delivery';
import React, { FunctionComponent } from 'react';

interface ContextValue {
  client?: DeliveryClient;
}

export const BlogContext = React.createContext<ContextValue>({});

interface Props {
  client: DeliveryClient;
}

export const BlogProvider: FunctionComponent<Props> = ({ client, children }) => (
  <BlogContext.Provider value={{ client }}>{children}</BlogContext.Provider>
);
