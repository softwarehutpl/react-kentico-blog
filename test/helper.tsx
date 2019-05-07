import { mount } from 'enzyme';
import { IHttpService } from 'kentico-cloud-core';
import { DeliveryClient } from 'kentico-cloud-delivery';
import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import { act } from 'react-dom/test-utils';
import { BlogProvider } from 'react-kentico-blog';
import { of } from 'rxjs';

function HookHelper({ hook }) {
  const result = hook();
  return <div data-result={result} />;
}

class MockHTTPService implements IHttpService {
  public get = jest.fn(() =>
    of({
      data: {} as any,
      response: undefined,
    })
  );
  public post = jest.fn();
  public put = jest.fn();
  public delete = jest.fn();
  public retryPromise = jest.fn();
}

export function mountContextHook(hookCb) {
  const httpService = new MockHTTPService();
  const mockClient = new DeliveryClient({
    httpService,
    projectId: '',
  });
  let wrapper;

  act(() => {
    wrapper = mount(
      <BlogProvider client={mockClient}>
        <HookHelper hook={hookCb} />
      </BlogProvider>
    );
  });

  return {
    httpService,
    result: wrapper.find('div').prop('data-result'),
  };
}

export function lastCallArg(fn: jest.Mock, n: number): any {
  return fn.mock.calls[fn.mock.calls.length - 1][n];
}

export function lastHTTPUrl(httpService: MockHTTPService): string {
  return lastCallArg(httpService.get, 0).url;
}
