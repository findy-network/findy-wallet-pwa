import React, { ReactElement } from 'react'
import { render, waitFor } from '@testing-library/react'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import Connections, { CONNECTIONS_QUERY } from './Connections'
import { MemoryRouter } from 'react-router-dom'

import { connections, connectionName } from '../mock/data'

const mocks: ReadonlyArray<MockedResponse> = [
  {
    request: {
      query: CONNECTIONS_QUERY,
    },
    result: {
      data: {
        connections,
      },
    },
  },
]
const wrapToProvider = (component: ReactElement) => (
  <MemoryRouter>
    <MockedProvider mocks={mocks}>{component}</MockedProvider>
  </MemoryRouter>
)

test('renders connection name', async () => {
  const component = wrapToProvider(<Connections />)
  const { getByText } = render(component)
  await waitFor(() => expect(getByText(connectionName)).toBeInTheDocument())
})
