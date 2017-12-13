import Domains from '@/Admin/Kam/Domains'
import Domain from '@/Admin/Kam/Domain'
import DomainNodes from '@/Admin/Kam/Domain/Nodes'
import DomainDialplan from '@/Admin/Kam/Domain/Dialplan'

import Nodes from '@/Admin/Kam/Nodes'
import Node from '@/Admin/Kam/Node'

export default [
  { path: 'domains', component: Domains },
  { path: 'nodes', component: Nodes },
  { path: 'domain', component: Domain },
  { path: 'domain/:id', component: Domain, props: true },
  { path: 'domain/:id/nodes', component: DomainNodes, props: true },
  { path: 'domain/:id/dialplan', component: DomainDialplan, props: true },
  { path: 'node', component: Domain },
  { path: 'node/:id', component: Domain, props: true }
]
