export interface IEdge {
  node: INode
  cursor: string
}

export interface INode {
  id: string
  createdMs: string
}

export interface IEventEdge extends IEdge {
  node: IEventNode
}

export interface IEventNode extends INode {
  read: boolean
  description: string
  connection?: IConnectionNode
  job?: IJobEdge
}

export interface IConnectionEdge extends IEdge {
  node: IConnectionNode
}

export interface IConnectionNode extends INode {
  theirLabel: string
  theirDid: string
}

export interface IConnectionArgs {
  id: string
}

export interface IJobEdge extends IEdge {
  node: IJobNode
}

export enum ProtocolType {
  NONE = 'NONE',
  CONNECTION = 'CONNECTION',
  CREDENTIAL = 'CREDENTIAL',
  PROOF = 'PROOF',
  BASIC_MESSAGE = 'BASIC_MESSAGE',
}

export enum JobStatus {
  WAITING = 'WAITING',
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
}

export enum JobResult {
  NONE = 'NONE',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export interface IJobNode extends INode {
  protocol: ProtocolType
  initiatedByUs: boolean
  status: JobStatus
  result: JobResult
  updatedMs: string
  output: IJobOutput
}

export interface IJobOutput {
  connection?: IConnectionEdge
  credential?: ICredentialEdge
  message?: IMessageEdge
}

export interface ICredentialEdge extends IEdge {
  node: ICredentialNode
}

export interface ICredentialValue {
  name: string
  value: string
}

export enum CredentialRole {
  ISSUER = 'ISSUER',
  HOLDER = 'HOLDER',
}

export interface ICredentialNode extends INode {
  role: CredentialRole
  schemaId: string
  credDefId: string
  attributes: ICredentialValue[]
  initiatedByUs: boolean
  approvedMs?: string
  issuedMs?: string
  connection?: IConnectionNode
}

export interface IMessageEdge extends IEdge {
  node: IMessageNode
}

export interface IMessageNode extends INode {
  message: string
  sentByMe: boolean
  delivered: boolean
  connection?: IConnectionNode
}
