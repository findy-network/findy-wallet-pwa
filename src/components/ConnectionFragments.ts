import { gql } from '@apollo/client'

const nodeFragment = gql`
  fragment PairwiseNodeFragment on Pairwise {
    id
    ourDid
    theirDid
    theirEndpoint
    theirLabel
    createdMs
    approvedMs
    invited
  }
`

export const fragments = {
  node: nodeFragment,
  edge: gql`
    fragment PairwiseEdgeFragment on PairwiseEdge {
      cursor
      node {
        ...PairwiseNodeFragment
      }
    }
    ${nodeFragment}
  `,
}
