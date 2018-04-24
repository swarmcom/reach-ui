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
import AgentActivity from '@/Report/Legacy/Agent/Activity'
import AgentAnswerPerformance from '@/Report/Legacy/Agent/AnswerPerformance'
import AgentAvailability from '@/Report/Legacy/Agent/Availability'
import AgentProductivity from '@/Report/Legacy/Agent/Productivity'
import AgentCallDisposition from '@/Report/Legacy/Agent/CallDisposition'
import AgentBoundedEvents from '@/Report/Legacy/Agent/BoundedEvents'
import AgentEvents from '@/Report/Legacy/Agent/Events'
import ConcurrentLoggedInAgents from '@/Report/Legacy/Agent/ConcurrentLoggedInAgents'

// Agent Group
import AgentGroupActivity from '@/Report/Legacy/Agent/Group/Activity'
import AgentGroupAnswerPerformance from '@/Report/Legacy/Agent/Group/AnswerPerformance'
import AgentGroupProductivity from '@/Report/Legacy/Agent/Group/Productivity'

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
  { path: 'legacy/agent/activity', component: AgentActivity },
  { path: 'legacy/agent/answer-performance', component: AgentAnswerPerformance },
  { path: 'legacy/agent/availability', component: AgentAvailability },
  { path: 'legacy/agent/call-disposition', component: AgentCallDisposition },
  { path: 'legacy/agent/concurrent-logged-in-agents', component: ConcurrentLoggedInAgents },
  { path: 'legacy/agent/productivity', component: AgentProductivity },
  { path: 'legacy/agent/bounded-events', component: AgentBoundedEvents },
  { path: 'legacy/agent/events', component: AgentEvents },

  // Agent Group
  { path: 'legacy/agent/group/activity', component: AgentGroupActivity },
  { path: 'legacy/agent/group/answer-performance', component: AgentGroupAnswerPerformance },
  { path: 'legacy/agent/group/productivity', component: AgentGroupProductivity },
  
  // Traffic
  { path: 'legacy/outbound/details', component: OutboundDetails },
  { path: 'legacy/outbound/summary', component: OutboundSummary },
  { path: 'legacy/inbound/details', component: InboundDetails },
  { path: 'legacy/inbound/summary', component: InboundSummary },
  { path: 'legacy/voicemail/details', component: VoicemailDetails },
  { path: 'legacy/voicemail/summary', component: VoicemailSummary },
]
