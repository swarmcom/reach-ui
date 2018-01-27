import AgentsStates from '@/Report/Agents/States'
import AgentsUnique from '@/Report/Agents/Unique'
import AgentsAvg from '@/Report/Agents/Avg'
import MeasuresAvg from '@/Report/Measures/Avg'
import InqueueSessions from '@/Report/Sessions/Inqueue'
import OutgoingSessions from '@/Report/Sessions/Outgoing'
import AgentSessions from '@/Report/Sessions/Agent'
import InqueueEvents from '@/Report/Events/Inqueue'
import OutgoingEvents from '@/Report/Events/Outgoing'
import AgentEvents from '@/Report/Events/Agent'
import ReachReports from '@/Report/Reports'

export default [
  { path: 'agents/states', component: AgentsStates },
  { path: 'agents/unique', component: AgentsUnique },
  { path: 'agents/avg', component: AgentsAvg },
  { path: 'measures/avg', component: MeasuresAvg },
  { path: 'sessions/inqueue', component: InqueueSessions },
  { path: 'sessions/outgoing', component: OutgoingSessions },
  { path: 'sessions/agent', component: AgentSessions },
  { path: 'events/inqueue/:uuid', component: InqueueEvents, props: true },
  { path: 'events/outgoing/:id', component: OutgoingEvents, props: true },
  { path: 'events/agent/:uuid', component: AgentEvents, props: true },
  { path: 'reports', component: ReachReports }
]
