import AgentsStates from '@/Report/Agents/States'
import AgentsUnique from '@/Report/Agents/Unique'
import AgentsAvg from '@/Report/Agents/Avg'
import MeasuresAvg from '@/Report/Measures/Avg'
import InqueueSessions from '@/Report/Sessions/Inqueue'
import VoicemailSessions from '@/Report/Sessions/Voicemail'
import OutgoingSessions from '@/Report/Sessions/Outgoing'
import AgentSessions from '@/Report/Sessions/Agent'
import InqueueEvents from '@/Report/Events/Inqueue'
import VoicemailEvents from '@/Report/Events/Voicemail'
import OutgoingEvents from '@/Report/Events/Outgoing'
import AgentSessionEvents from '@/Report/Events/Agent'

// Agent
import AgentActivity from '@/Report/Legacy/Agent/Activity'
import AgentAnswerPerformance from '@/Report/Legacy/Agent/AnswerPerformance'
import AgentAvailability from '@/Report/Legacy/Agent/Availability'
import AgentProductivity from '@/Report/Legacy/Agent/Productivity'
import AgentCallDisposition from '@/Report/Legacy/Agent/CallDisposition'
import AgentBoundedEvents from '@/Report/Legacy/Agent/BoundedEvents'
import AgentEvents from '@/Report/Legacy/Agent/Events'
import ConcurrentLoggedInAgents from '@/Report/Legacy/Agent/ConcurrentLoggedInAgents'
import UnansweredCallDetails from '@/Report/Legacy/Agent/UnansweredCallDetails'

// Agent Group
import AgentGroupActivity from '@/Report/Legacy/Agent/Group/Activity'
import AgentGroupAnswerPerformance from '@/Report/Legacy/Agent/Group/AnswerPerformance'
import AgentGroupProductivity from '@/Report/Legacy/Agent/Group/Productivity'

// Outbound
import OutboundDetailByClient from '@/Report/Legacy/Outbound/OutboundDetailByClient'
import OutboundOverviewByClient from '@/Report/Legacy/Outbound/OutboundOverviewByClient'
// Traffic
import ClientTrafficDetail from '@/Report/Legacy/Traffic/ClientTrafficDetail'
import ClientTrafficOverview from '@/Report/Legacy/Traffic/ClientTrafficOverview'
import LineTrafficDetail from '@/Report/Legacy/Traffic/LineTrafficDetail'
import LineTrafficOverview from '@/Report/Legacy/Traffic/LineTrafficOverview'
import QueueGroupTrafficOverview from '@/Report/Legacy/Traffic/QueueGroupTrafficOverview'
import QueueTrafficDetail from '@/Report/Legacy/Traffic/QueueTrafficDetail'
import QueueTrafficOverview from '@/Report/Legacy/Traffic/QueueTrafficOverview'
import VoicemailDetail from '@/Report/Legacy/Traffic/VoicemailDetail'
import VoicemailOverview from '@/Report/Legacy/Traffic/VoicemailOverview'

export default [
  { path: 'agents/states', component: AgentsStates },
  { path: 'agents/unique', component: AgentsUnique },
  { path: 'agents/avg', component: AgentsAvg },
  { path: 'measures/avg', component: MeasuresAvg },
  { path: 'sessions/inqueue', component: InqueueSessions },
  { path: 'sessions/voicemail', component: VoicemailSessions },
  { path: 'sessions/outgoing', component: OutgoingSessions },
  { path: 'sessions/agent', component: AgentSessions },
  { path: 'events/inqueue/:uuid', component: InqueueEvents, props: true },
  { path: 'events/voicemail/:uuid', component: VoicemailEvents, props: true },
  { path: 'events/outgoing/:id', component: OutgoingEvents, props: true },
  { path: 'events/agent/:uuid', component: AgentSessionEvents, props: true },

  // Agent
  { path: 'legacy/agent/activity', component: AgentActivity },
  { path: 'legacy/agent/answer-performance', component: AgentAnswerPerformance },
  { path: 'legacy/agent/availability', component: AgentAvailability },
  { path: 'legacy/agent/call-disposition', component: AgentCallDisposition },
  { path: 'legacy/agent/concurrent-logged-in-agents', component: ConcurrentLoggedInAgents },
  { path: 'legacy/agent/productivity', component: AgentProductivity },
  { path: 'legacy/agent/bounded-events', component: AgentBoundedEvents },
  { path: 'legacy/agent/events', component: AgentEvents },
  { path: 'legacy/agent/unanswered-call-details', component: UnansweredCallDetails },

  // Agent Group
  { path: 'legacy/agent/group/activity', component: AgentGroupActivity },
  { path: 'legacy/agent/group/answer-performance', component: AgentGroupAnswerPerformance },
  { path: 'legacy/agent/group/productivity', component: AgentGroupProductivity },
  
  // Outbound
  { path: 'legacy/outbound/detail-by-client', component: OutboundDetailByClient },
  { path: 'legacy/outbound/overview-by-client', component: OutboundOverviewByClient },
  // Traffic
  { path: 'legacy/traffic/client-detail', component: ClientTrafficDetail },
  { path: 'legacy/traffic/client-overview', component: ClientTrafficOverview },
  { path: 'legacy/traffic/line-detail', component: LineTrafficDetail },
  { path: 'legacy/traffic/line-overview', component: LineTrafficOverview },
  { path: 'legacy/traffic/queue-group-overview', component: QueueGroupTrafficOverview },
  { path: 'legacy/traffic/queue-detail', component: QueueTrafficDetail },
  { path: 'legacy/traffic/queue-overview', component: QueueTrafficOverview },
  { path: 'legacy/traffic/voicemail-detail', component: VoicemailDetail },
  { path: 'legacy/traffic/voicemail-overview', component: VoicemailOverview }
]
