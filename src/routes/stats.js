import Agent from '@/Stats/Agent'
import Inqueue from '@/Stats/Inqueue'
import InqueueEvents from '@/Stats/Inqueue/Events'
import AgentEvents from '@/Stats/Agent/Events'

export default [
  { path: 'inqueue', component: Inqueue },
  { path: 'agent', component: Agent },
  { path: 'inqueue/:uuid', component: InqueueEvents, props: true },
  { path: 'agent/:uuid', component: AgentEvents, props: true }
]
