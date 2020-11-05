export interface IEventEdge {
  node: IEventNode
}

export interface IEventNode {
  id: string
  read: boolean
  description: string
  connection: IConnectionNode
  createdMs: string
}

export interface IConnectionEdge {
  node: IConnectionNode
}

export interface IConnectionNode {
  id: string
  theirLabel: string
  theirDid: string
  createdMs: string
}

export interface IConnectionArgs {
  id: string
}

export interface IJobEdge {
  node: IJobNode
}

enum ProtocolType {
  NONE = 'NONE',
  CONNECTION = 'CONNECTION',
  CREDENTIAL = 'CREDENTIAL',
  PROOF = 'PROOF',
  BASIC_MESSAGE = 'BASIC_MESSAGE',
}

enum JobStatus {
  WAITING = 'WAITING',
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
}

export interface IJobNode {
  id: string
  initiatedByUs: boolean
  createdMs: string
  updatedMs: string
  protocol: ProtocolType
  status: JobStatus
}
