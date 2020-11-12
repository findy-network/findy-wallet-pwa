export interface IEdge {
  node: INode
  cursor: string
}

export interface INode {
  id: string
}

export interface IEventEdge extends IEdge {
  node: IEventNode
}

export interface IEventNode extends INode {
  read: boolean
  description: string
  connection?: IConnectionNode
  createdMs: string
  job?: IJobEdge
}

export interface IConnectionEdge extends IEdge {
  node: IConnectionNode
}

export interface IConnectionNode extends INode {
  theirLabel: string
  theirDid: string
  createdMs: string
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

export interface IJobNode extends INode {
  initiatedByUs: boolean
  createdMs: string
  updatedMs: string
  protocol: ProtocolType
  status: JobStatus
  connection?: IConnectionEdge
}
