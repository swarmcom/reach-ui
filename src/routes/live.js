import LiveAgent from '@/Live/Agent'
import LiveAgents from '@/Live/Agents'
import LiveInbounds from '@/Live/Inbounds'
import LiveOutbounds from '@/Live/Outbounds'
import LiveVoicemails from '@/Live/Voicemails'

export default [
  { path: 'agent', component: LiveAgent },
  { path: 'agents', component: LiveAgents },
  { path: 'inbounds', component: LiveInbounds },
  { path: 'outbounds', component: LiveOutbounds },
  { path: 'voicemails', component: LiveVoicemails },
]
