import AgentsStates from '@/Report/Agents/States'
import AgentsUnique from '@/Report/Agents/Unique'
import AgentsAvg from '@/Report/Agents/Avg'
import MeasuresAvg from '@/Report/Measures/Avg'
import InqueueSessions from '@/Report/Sessions/Inqueue'
import AgentSessions from '@/Report/Sessions/Agent'
import InqueueEvents from '@/Report/Events/Inqueue'
import AgentEvents from '@/Report/Events/Agent'
import ReachReports from '@/Report/Reports'

export default [
  { path: 'agents/states', component: AgentsStates },
  { path: 'agents/unique', component: AgentsUnique },
  { path: 'agents/avg', component: AgentsAvg },
  { path: 'measures/avg', component: MeasuresAvg },
  { path: 'sessions/inqueue', component: InqueueSessions },
  { path: 'sessions/agent', component: AgentSessions },
  { path: 'events/inqueue/:uuid', component: InqueueEvents, props: true },
  { path: 'events/agent/:uuid', component: AgentEvents, props: true },
  { path: 'reports', component: ReachReports }
]
