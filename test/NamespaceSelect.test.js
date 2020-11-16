import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CRDmockResponse from '../__mocks__/crd_fetch.json';
import ViewMockResponse from '../__mocks__/views.json';
import Error401 from '../__mocks__/401.json';
import NamespaceResponse from '../__mocks__/namespaces.json';
import {
  alwaysPresentGET,
  generalHomeGET,
  setToken,
  setup_login, token
} from './RTLUtils';
import Cookies from 'js-cookie';
import { testTimeout } from '../src/constants';
import React from 'react';
import fetchMock from 'jest-fetch-mock';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/app/App';
import NamespaceSelect from '../src/common/NamespaceSelect';
import ApiInterface from '../src/services/api/ApiInterface';

fetchMock.enableMocks();

async function setup_extended(errorCRD) {
  fetch.mockResponse(req => {
    return mocks(req, undefined, errorCRD);
  })

  setToken();
  window.history.pushState({}, 'Page Title', '/customresources/views.dashboard.liqo.io');

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
}

let counter = 0;

function mocks(req, error, errorCRD) {
  if (req.url === 'http://localhost:3001/customresourcedefinition') {
    return Promise.resolve(new Response(JSON.stringify(CRDmockResponse)))
  } else if (req.url === 'http://localhost:3001/clustercustomobject/views') {
    if(errorCRD && counter !== 0){
      return Promise.reject(Error401.body);
    }
    return Promise.resolve(new Response(JSON.stringify({ body: ViewMockResponse })))
  } else if (req.url === 'http://localhost:3001/namespaces') {
    if(!error)
      return Promise.resolve(new Response(JSON.stringify({body: NamespaceResponse })))
    else
      return Promise.reject(Error401.body);
  } else if(alwaysPresentGET(req.url)){
    return alwaysPresentGET(req.url)
  } else {
    return generalHomeGET(req.url);
  }
}

beforeEach(() => {
  Cookies.remove('token');
});

describe('Namespace Select', () => {
  test('Namespace change error', async () => {
    counter = 0;
    await setup_extended(true);

    expect(await screen.findByLabelText('crd')).toBeInTheDocument();

    expect(await screen.findByText('awesome-view')).toBeInTheDocument();

    const ns = screen.getByText('all namespaces');
    userEvent.click(ns);

    const ns_liqo = await screen.findByText('liqo');
    const ns_default = await screen.findAllByText('default');

    expect(ns_liqo).toBeInTheDocument();
    expect(await screen.findByText('test')).toBeInTheDocument();
    expect(ns_default[1]).toBeInTheDocument();

    await act(async () => {
      counter++;
      fireEvent.mouseOver(ns_liqo);
      fireEvent.click(ns_liqo);

      await new Promise((r) => setTimeout(r, 1000));
    })

    expect(await screen.queryByText('awesome-view')).toBeInTheDocument();

  }, testTimeout)

  test('Namespace change resource displayed', async () => {
    await setup_extended();

    expect(await screen.findByLabelText('crd')).toBeInTheDocument();

    expect(await screen.findByText('awesome-view')).toBeInTheDocument();

    const ns = screen.getByText('all namespaces');
    userEvent.click(ns);

    const ns_liqo = await screen.findByText('liqo');
    const ns_default = await screen.findAllByText('default');

    expect(ns_liqo).toBeInTheDocument();
    expect(await screen.findByText('test')).toBeInTheDocument();
    expect(ns_default[1]).toBeInTheDocument();

    await act(async () => {
      fireEvent.mouseOver(ns_liqo);
      fireEvent.click(ns_liqo);

      await new Promise((r) => setTimeout(r, 1000));
    })

    expect(await screen.queryByText('awesome-view')).not.toBeInTheDocument();

    let view = ViewMockResponse.items[0];
    view.metadata.name = 'test-view-2'

    window.api.customViews.current.push(view);

    window.api.apiManager.current.sendAddedSignal('views', view);

  }, testTimeout)

  test('Namespace starting from non default', async () => {
    fetch.mockResponse(req => {
      return mocks(req);
    })

    setToken();
    window.api =  ApiInterface({id_token: 'test'});
    window.api.namespace.current = 'liqo';

    render(
      <MemoryRouter>
        <NamespaceSelect />
      </MemoryRouter>
    );

    const ns = await screen.findByText('liqo');
    userEvent.click(ns);

    const ns_all = await screen.findByText('all namespaces');

    expect(ns_all).toBeInTheDocument();

    await act(async () => {
      fireEvent.mouseOver(ns_all);
      fireEvent.click(ns_all);

      await new Promise((r) => setTimeout(r, 1000));
    })

    expect(window.api.namespace.current).toBeNull();

  }, testTimeout)

  test('Namespace listing error', async () => {
    fetch.mockResponse(req => {
      return mocks(req, true);
    })

    setup_login();

    /** Input mock password */
    const tokenInput = screen.getByLabelText('lab');
    await userEvent.type(tokenInput, token);

    /** Click on login button */
    const submitButton = screen.getByRole('button');

    userEvent.click(submitButton);

  }, testTimeout)
})
