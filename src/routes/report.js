import AgentsStates from '@/Report/Agents/States'
import AgentsUnique from '@/Report/Agents/Unique'
import AgentsAvg from '@/Report/Agents/Avg'
import MeasuresAvg from '@/Report/Measures/Avg'

// Agents
import AgentsSessions from '@/Report/Agents/Sessions'
import AgentSessionEvents from '@/Report/Agent/Session/Events'
import AgentsEvents from '@/Report/Agents/Events'

// Agent
import AgentCallDisposition from '@/Report/Agent/CallDisposition'
import AgentBoundedEvents from '@/Report/Agent/BoundedEvents'
import ConcurrentLoggedInAgents from '@/Report/Agent/ConcurrentLoggedInAgents'

// Inbound
import InboundDetails from '@/Report/Inbound/Details'
import InboundSummary from '@/Report/Inbound/Summary'
import InboundSessions from '@/Report/Inbound/Sessions'
import InboundUnansweredSessions from '@/Report/Inbound/Unanswered'
import InboundSessionEvents from '@/Report/Inbound/Session/Events'

// Outbound
import OutboundDetails from '@/Report/Outbound/Details'
import OutboundSummary from '@/Report/Outbound/Summary'
import OutboundSessions from '@/Report/Outbound/Sessions'
import OutboundSessionEvents from '@/Report/Outbound/Session/Events'

// Voicemail
import VoicemailDetails from '@/Report/Voicemail/Details'
import VoicemailSummary from '@/Report/Voicemail/Summary'
import VoicemailSessions from '@/Report/Voicemail/Sessions'
import VoicemailSessionEvents from '@/Report/Voicemail/Session/Events'

// Summary reports
import AnswerSummary from '@/Report/Answer'
import ActivitySummary from '@/Report/Activity'
import ProductivitySummary from '@/Report/Productivity'
import Availability from '@/Report/Availability'

export default [
  { path: 'agents/states', component: AgentsStates },
  { path: 'agents/unique', component: AgentsUnique },
  { path: 'agents/avg', component: AgentsAvg },
  { path: 'measures/avg', component: MeasuresAvg },

  // Agents
  { path: 'agents/sessions', component: AgentsSessions },
  { path: 'agents/events', component: AgentsEvents },
  { path: 'agent/session/events/:uuid', component: AgentSessionEvents, props: true },

  // Agent
  { path: 'agent/call-disposition', component: AgentCallDisposition },
  { path: 'agent/concurrent-logged-in-agents', component: ConcurrentLoggedInAgents },

  // Inbound
  { path: 'inbound/sessions', component: InboundSessions },
  { path: 'inbound/unanswered', component: InboundUnansweredSessions },
  { path: 'inbound/details', component: InboundDetails },
  { path: 'inbound/summary', component: InboundSummary },
  { path: 'inbound/session/events/:uuid', component: InboundSessionEvents, props: true },

  // Outbound
  { path: 'outbound/sessions', component: OutboundSessions },
  { path: 'outbound/details', component: OutboundDetails },
  { path: 'outbound/summary', component: OutboundSummary },
  { path: 'outbound/session/events/:id', component: OutboundSessionEvents, props: true },

  // Voicemail
  { path: 'voicemail/details', component: VoicemailDetails },
  { path: 'voicemail/summary', component: VoicemailSummary },
  { path: 'voicemail/sessions', component: VoicemailSessions },
  { path: 'voicemail/session/events/:uuid', component: VoicemailSessionEvents, props: true },

  // Summary
  { path: 'answer', component: AnswerSummary },
  { path: 'availability', component: Availability },
  { path: 'activity', component: ActivitySummary },
  { path: 'productivity', component: ProductivitySummary },

]
