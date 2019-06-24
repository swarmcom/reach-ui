<template>
  <div v-access:monitor-ui>
    <!-- <ul style="margin-top: 10px" class="nav nav-tabs">
  <li class="nav-item">
    <router-link class="nav-link" to="/live/agent">Agent</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/live/agents">All Agents</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/live/inbounds">Inbound calls</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/live/outbounds">Outbounds</router-link>
  </li>
</ul>
<transition name="reach" mode="out-in">
  <router-view style="margin-top: 20px"></router-view>
</transition> -->
    <live-agent style="margin-top:20px" />
    <live-agents />
    <live-inbound />
    <live-outbound />
  </div>
</template>

<script>
import LiveAgent from '@/Live/Agent'
import LiveAgents from '@/Live/Agents'
import LiveInbound from '@/Live/Inbounds'
import LiveOutbound from '@/Live/Outbounds'

export default {
  components: {
    'live-agent': LiveAgent,
    'live-agents': LiveAgents,
    'live-inbound': LiveInbound,
    'live-outbound': LiveOutbound
  },
  data () {
    return {
      showCollapse: true,
    }
  },
  created () {
  },
  methods: {
  }
}
</script>
