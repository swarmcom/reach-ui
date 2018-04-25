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
import AgentAvailability from '@/Report/Legacy/Agent/Availability'
import AgentCallDisposition from '@/Report/Legacy/Agent/CallDisposition'
import AgentBoundedEvents from '@/Report/Legacy/Agent/BoundedEvents'
import AgentEvents from '@/Report/Legacy/Agent/Events'
import ConcurrentLoggedInAgents from '@/Report/Legacy/Agent/ConcurrentLoggedInAgents'

// Summary reports
import AnswerSummary from '@/Report/Legacy/Answer'
import ActivitySummary from '@/Report/Legacy/Activity'
import ProductivitySummary from '@/Report/Legacy/Productivity'

// Traffic reports
import OutboundDetails from '@/Report/Legacy/Outbound/Details'
import OutboundSummary from '@/Report/Legacy/Outbound/Summary'
import InboundDetails from '@/Report/Legacy/Inbound/Details'
import InboundSummary from '@/Report/Legacy/Inbound/Summary'
import VoicemailDetails from '@/Report/Legacy/Voicemail/Details'
import VoicemailSummary from '@/Report/Legacy/Voicemail/Summary'

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
  { path: 'legacy/agent/availability', component: AgentAvailability },
  { path: 'legacy/agent/call-disposition', component: AgentCallDisposition },
  { path: 'legacy/agent/concurrent-logged-in-agents', component: ConcurrentLoggedInAgents },
  { path: 'legacy/agent/bounded-events', component: AgentBoundedEvents },
  { path: 'legacy/agent/events', component: AgentEvents },

  // Summary
  { path: 'legacy/answer', component: AnswerSummary },
  { path: 'legacy/activity', component: ActivitySummary },
  { path: 'legacy/productivity', component: ProductivitySummary },

  // Traffic
  { path: 'legacy/outbound/details', component: OutboundDetails },
  { path: 'legacy/outbound/summary', component: OutboundSummary },
  { path: 'legacy/inbound/details', component: InboundDetails },
  { path: 'legacy/inbound/summary', component: InboundSummary },
  { path: 'legacy/voicemail/details', component: VoicemailDetails },
  { path: 'legacy/voicemail/summary', component: VoicemailSummary },
]
