import AgentsStates from '@/Report/Agents/States'
import AgentsUnique from '@/Report/Agents/Unique'
import AgentsAvg from '@/Report/Agents/Avg'
import MeasuresAvg from '@/Report/Measures/Avg'
import InqueueSessions from '@/Report/Sessions/Inqueue'
import VoicemailSessions from '@/Report/Sessions/Voicemail'
import OutgoingSessions from '@/Report/Sessions/Outgoing'
import AgentSessions from '@/Report/Sessions/Agent'
import UnansweredSessions from '@/Report/Sessions/Unanswered'
import InqueueEvents from '@/Report/Events/Inqueue'
import VoicemailEvents from '@/Report/Events/Voicemail'
import OutgoingEvents from '@/Report/Events/Outgoing'
import AgentSessionEvents from '@/Report/Events/Agent'

// Agent
import AgentCallDisposition from '@/Report/Agent/CallDisposition'
import AgentBoundedEvents from '@/Report/Agent/BoundedEvents'
import AgentEvents from '@/Report/Agent/Events'
import ConcurrentLoggedInAgents from '@/Report/Agent/ConcurrentLoggedInAgents'

// Summary reports
import AnswerSummary from '@/Report/Answer'
import ActivitySummary from '@/Report/Activity'
import ProductivitySummary from '@/Report/Productivity'
import Availability from '@/Report/Availability'

// Traffic reports
import OutboundDetails from '@/Report/Outbound/Details'
import OutboundSummary from '@/Report/Outbound/Summary'
import InboundDetails from '@/Report/Inbound/Details'
import InboundSummary from '@/Report/Inbound/Summary'
import VoicemailDetails from '@/Report/Voicemail/Details'
import VoicemailSummary from '@/Report/Voicemail/Summary'

export default [
  { path: 'agents/states', component: AgentsStates },
  { path: 'agents/unique', component: AgentsUnique },
  { path: 'agents/avg', component: AgentsAvg },
  { path: 'measures/avg', component: MeasuresAvg },
  { path: 'sessions/inqueue', component: InqueueSessions },
  { path: 'sessions/voicemail', component: VoicemailSessions },
  { path: 'sessions/outgoing', component: OutgoingSessions },
  { path: 'sessions/agent', component: AgentSessions },
  { path: 'sessions/unanswered', component: UnansweredSessions },
  { path: 'events/inqueue/:uuid', component: InqueueEvents, props: true },
  { path: 'events/voicemail/:uuid', component: VoicemailEvents, props: true },
  { path: 'events/outgoing/:id', component: OutgoingEvents, props: true },
  { path: 'events/agent/:uuid', component: AgentSessionEvents, props: true },

  // Agent
  { path: 'agent/call-disposition', component: AgentCallDisposition },
  { path: 'agent/concurrent-logged-in-agents', component: ConcurrentLoggedInAgents },
  { path: 'agent/bounded-events', component: AgentBoundedEvents },
  { path: 'agent/events', component: AgentEvents },

  // Summary
  { path: 'answer', component: AnswerSummary },
  { path: 'availability', component: Availability },
  { path: 'activity', component: ActivitySummary },
  { path: 'productivity', component: ProductivitySummary },

  // Traffic
  { path: 'outbound/details', component: OutboundDetails },
  { path: 'outbound/summary', component: OutboundSummary },
  { path: 'inbound/details', component: InboundDetails },
  { path: 'inbound/summary', component: InboundSummary },
  { path: 'voicemail/details', component: VoicemailDetails },
  { path: 'voicemail/summary', component: VoicemailSummary },
]
