<template>
  <div>
    <toggle-bar />
    <b-collapse
      id="liveManager"
      v-model="showCollapse"
      style="padding-top: 10px"
    >
      <stats />
      <vmstats />
      <monitor />
    </b-collapse>
  </div>
</template>

<script>
import Monitor from '@/Live/Inbounds/Monitor'
import Stats from '@/Live/Inbounds/Stats'
import VMStats from '@/Live/Voicemails/Stats'

export default {
  widgetName: 'Inbound Call Manager',
  components: {
    monitor: Monitor,
    stats: Stats,
    vmstats: VMStats
  },
  data () {
    return {
      showCollapse: true
    }
  },
}
</script>
