import React, { ReactElement } from 'react'
import { render, waitFor } from '@testing-library/react'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import Connections, { CONNECTIONS_QUERY } from './Connections'
import { MemoryRouter } from 'react-router'

const connectionName = 'Schowalter Ltd'

const mocks: ReadonlyArray<MockedResponse> = [
  {
    request: {
      query: CONNECTIONS_QUERY,
    },
    result: {
      data: {
        connections: {
          edges: [
            {
              cursor: 'UGFpcndpc2U6MTYxNTQ2MTYwODE0MA==',
              node: {
                id: '9f7e3ccb-ec6c-4922-8a45-5993a816436a',
                ourDid: 'GFUdCdxMPPvaxZPXFoybklCGO',
                theirDid: 'hFMwUXaWNBJSvGNwtKtvxTkdf',
                theirEndpoint: 'http://DwcpVQN.com/ZowrgMH.php',
                theirLabel: connectionName,
                createdMs: '1615461608140',
                approvedMs: '',
                invited: true,
                __typename: 'Pairwise',
              },
              __typename: 'PairwiseEdge',
            },
          ],
          pageInfo: {
            endCursor: 'UGFpcndpc2U6MTYxNTQ2MTYwODE0Ng==',
            startCursor: 'UGFpcndpc2U6MTYxNTQ2MTYwODE0MA==',
            hasPreviousPage: false,
            hasNextPage: false,
            __typename: 'PageInfo',
          },
          __typename: 'PairwiseConnection',
        },
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
