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
