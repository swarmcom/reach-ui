import Domains from '@/Kam/Domains'
import Domain from '@/Kam/Domain'
import DomainDialplan from '@/Kam/Domain/Dialplan'

import Registry from '@/Kam/Registry'

import Nodes from '@/Kam/Nodes'
import NodeProps from '@/Kam/Node/Props'

export default [
  { path: 'domains', component: Domains },
  { path: 'nodes', component: Nodes },
  { path: 'domain', component: Domain },
  { path: 'domain/:id', component: Domain, props: true },
  { path: 'domain/:id/dialplan', component: DomainDialplan, props: true },
  { path: 'node', component: Domain },
  { path: 'node/:id', component: NodeProps, props: true },
  { path: 'registry', component: Registry }
]
