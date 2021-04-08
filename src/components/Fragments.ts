import { gql } from '@apollo/client'

const pairwiseNodeFragment = gql`
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

export const pairwise = {
  node: pairwiseNodeFragment,
  edge: gql`
    fragment PairwiseEdgeFragment on PairwiseEdge {
      cursor
      node {
        ...PairwiseNodeFragment
        events(last: 1) {
          nodes {
            read
          }
        }
      }
    }
    ${pairwiseNodeFragment}
  `,
}

const credentialNodeFragment = gql`
  fragment CredentialNodeFragment on Credential {
    id
    role
    schemaId
    credDefId
    attributes {
      id
      name
      value
    }
    initiatedByUs
    createdMs
    approvedMs
    issuedMs
  }
`

export const credential = {
  node: credentialNodeFragment,
  edge: gql`
    fragment CredentialEdgeFragment on CredentialEdge {
      cursor
      node {
        ...CredentialNodeFragment
      }
    }
    ${credentialNodeFragment}
  `,
}

const proofNodeFragment = gql`
  fragment ProofNodeFragment on Proof {
    id
    role
    attributes {
      id
      name
      credDefId
    }
    initiatedByUs
    result
    createdMs
    approvedMs
    verifiedMs
    values {
      attributeId
      value
    }
    provable {
      provable
    }
  }
`

export const proof = {
  node: proofNodeFragment,
  edge: gql`
    fragment ProofEdgeFragment on ProofEdge {
      cursor
      node {
        ...ProofNodeFragment
      }
    }
    ${proofNodeFragment}
  `,
}

const messageNodeFragment = gql`
  fragment MessageNodeFragment on BasicMessage {
    id
    message
    sentByMe
    delivered
    createdMs
  }
`

export const message = {
  node: messageNodeFragment,
  edge: gql`
    fragment MessageEdgeFragment on BasicMessageEdge {
      cursor
      node {
        ...MessageNodeFragment
      }
    }
    ${messageNodeFragment}
  `,
}

const jobNodeFragment = gql`
  fragment JobNodeFragment on Job {
    id
    protocol
    initiatedByUs
    status
    result
    createdMs
    updatedMs
    output {
      connection {
        ...PairwiseEdgeFragment
      }
      message {
        ...MessageEdgeFragment
      }
      credential {
        ...CredentialEdgeFragment
      }
      proof {
        ...ProofEdgeFragment
      }
    }
  }
  ${pairwise.edge}
  ${message.edge}
  ${credential.edge}
  ${proof.edge}
`

export const job = {
  node: jobNodeFragment,
  edge: gql`
    fragment JobEdgeFragment on JobEdge {
      node {
        ...JobNodeFragment
      }
      cursor
    }
    ${jobNodeFragment}
  `,
}

const eventNodeFragment = gql`
  fragment EventNodeFragment on Event {
    id
    read
    description
    createdMs
    connection {
      id
      theirLabel
    }
  }
`

const fullEventNodeFragment = gql`
  fragment FullEventNodeFragment on Event {
    ...EventNodeFragment
    job {
      ...JobEdgeFragment
    }
  }
  ${eventNodeFragment}
  ${job.edge}
`

export const event = {
  node: eventNodeFragment,
  fullNode: fullEventNodeFragment,
  edge: gql`
    fragment EventEdgeFragment on EventEdge {
      cursor
      node {
        ...EventNodeFragment
      }
    }
    ${eventNodeFragment}
  `,
  fullEdge: gql`
    fragment FullEventEdgeFragment on EventEdge {
      cursor
      node {
        ...FullEventNodeFragment
      }
    }
    ${fullEventNodeFragment}
  `,
}

export const pageInfo = gql`
  fragment PageInfoFragment on PageInfo {
    endCursor
    startCursor
    hasPreviousPage
    hasNextPage
  }
`
