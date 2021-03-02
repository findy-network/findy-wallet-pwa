import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Connections from './Connections';

const mocks = [];
const wrapToProvider = (component: ReactElement) =>
    <MockedProvider mocks={mocks} addTypename={false}>{component}</MockedProvider>

test('renders connections text', () => {
    const component = wrapToProvider(<Connections />)
    const { getByText } = render(component);
    const linkElement = getByText(/connections/i);
    expect(linkElement).toBeInTheDocument();
});
