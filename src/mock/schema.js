import { gql } from '@apollo/client'

export default gql`
  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
  }

  type Pairwise {
    id: ID!
    ourDid: String!
    theirDid: String!
    theirEndpoint: String!
    theirLabel: String!
    createdMs: String!
    approvedMs: String!
    invited: Boolean!
    messages(
      after: String
      before: String
      first: Int
      last: Int
    ): BasicMessageConnection!
    credentials(
      after: String
      before: String
      first: Int
      last: Int
    ): CredentialConnection!
    proofs(
      after: String
      before: String
      first: Int
      last: Int
    ): ProofConnection!
    jobs(
      after: String
      before: String
      first: Int
      last: Int
      completed: Boolean
    ): JobConnection!
    events(
      after: String
      before: String
      first: Int
      last: Int
    ): EventConnection!
  }

  type PairwiseEdge {
    cursor: String!
    node: Pairwise!
  }

  type PairwiseConnection {
    edges: [PairwiseEdge]
    nodes: [Pairwise]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type BasicMessage {
    id: ID!
    message: String!
    sentByMe: Boolean!
    delivered: Boolean
    createdMs: String!
    connection: Pairwise!
  }

  type BasicMessageEdge {
    cursor: String!
    node: BasicMessage!
  }

  type BasicMessageConnection {
    ConnectionId: ID
    edges: [BasicMessageEdge]
    nodes: [BasicMessage]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  enum CredentialRole {
    ISSUER
    HOLDER
  }

  type CredentialValue {
    id: ID!
    name: String!
    value: String!
  }

  type Credential {
    id: ID!
    role: CredentialRole!
    schemaId: String!
    credDefId: String!
    attributes: [CredentialValue]
    initiatedByUs: Boolean!
    approvedMs: String
    issuedMs: String
    createdMs: String!
    connection: Pairwise!
  }

  type CredentialEdge {
    cursor: String!
    node: Credential!
  }

  type CredentialConnection {
    connectionId: ID
    edges: [CredentialEdge]
    nodes: [Credential]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  enum ProofRole {
    VERIFIER
    PROVER
  }

  type ProofAttribute {
    id: ID!
    name: String!
    credDefId: String!
  }

  type Provable {
    id: ID!
    provable: Boolean!
    attributes: [ProvableAttribute]!
  }

  type ProvableAttribute {
    id: ID!
    attribute: ProofAttribute!
    credentials: [CredentialMatch]!
  }

  type CredentialMatch {
    id: ID!
    credentialId: ID!
    value: String!
  }

  type ProofValue {
    id: ID!
    attributeId: ID!
    value: String!
  }

  type Proof {
    id: ID!
    role: ProofRole!
    attributes: [ProofAttribute]!
    values: [ProofValue]!
    provable: Provable!
    initiatedByUs: Boolean!
    result: Boolean!
    verifiedMs: String
    approvedMs: String
    createdMs: String!
    connection: Pairwise!
  }

  type ProofEdge {
    cursor: String!
    node: Proof!
  }

  type ProofConnection {
    connectionId: ID
    edges: [ProofEdge]
    nodes: [Proof]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type Event {
    id: ID!
    read: Boolean!
    description: String!
    createdMs: String!
    job: JobEdge
    connection: Pairwise
  }

  type EventEdge {
    cursor: String!
    node: Event!
  }

  type EventConnection {
    connectionId: ID
    edges: [EventEdge]
    nodes: [Event]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  enum ProtocolType {
    NONE
    CONNECTION
    CREDENTIAL
    PROOF
    BASIC_MESSAGE
  }

  enum JobStatus {
    WAITING
    PENDING
    COMPLETE
  }

  enum JobResult {
    NONE
    SUCCESS
    FAILURE
  }

  type Job {
    id: ID!
    protocol: ProtocolType!
    initiatedByUs: Boolean!
    status: JobStatus!
    result: JobResult!
    createdMs: String!
    updatedMs: String!
    output: JobOutput!
  }

  type JobOutput {
    connection: PairwiseEdge
    message: BasicMessageEdge
    credential: CredentialEdge
    proof: ProofEdge
  }

  type JobEdge {
    cursor: String!
    node: Job!
  }

  type JobConnection {
    connectionId: ID
    completed: Boolean
    edges: [JobEdge]
    nodes: [Job]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type User {
    id: ID!
    name: String!
  }

  input ConnectInput {
    invitation: String!
  }

  input MessageInput {
    connectionId: ID!
    message: String!
  }

  input ResumeJobInput {
    id: ID!
    accept: Boolean!
  }

  input MarkReadInput {
    id: ID!
  }

  type Response {
    ok: Boolean!
  }

  type InvitationResponse {
    id: ID!
    label: String!
    endpoint: String!

    raw: String!
    imageB64: String!
  }

  type LoginResponse {
    token: String!
  }

  type Query {
    connections(
      after: String
      before: String
      first: Int
      last: Int
    ): PairwiseConnection!
    connection(id: ID!): Pairwise

    message(id: ID!): BasicMessage

    credential(id: ID!): Credential
    credentials(
      after: String
      before: String
      first: Int
      last: Int
    ): CredentialConnection!

    proof(id: ID!): Proof

    events(
      after: String
      before: String
      first: Int
      last: Int
    ): EventConnection!
    event(id: ID!): Event

    jobs(
      after: String
      before: String
      first: Int
      last: Int
      completed: Boolean
    ): JobConnection!
    job(id: ID!): Job

    user: User!
    endpoint(payload: String!): InvitationResponse!
  }

  type Mutation {
    markEventRead(input: MarkReadInput!): Event

    invite: InvitationResponse!
    connect(input: ConnectInput!): Response!
    sendMessage(input: MessageInput!): Response!

    resume(input: ResumeJobInput!): Response!

    # for testing only
    addRandomEvent: Boolean!
    addRandomMessage: Boolean!
    addRandomCredential: Boolean!
    addRandomProof: Boolean!
  }

  type Subscription {
    eventAdded: EventEdge!
  }
`
