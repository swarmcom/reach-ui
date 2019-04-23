<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse">
    <stats></stats>
    <vmstats></vmstats>
    <monitor></monitor>
  </b-collapse>
</div>
</template>

<script>
import Monitor from '@/Live/Inbounds/Monitor'
import Stats from '@/Live/Inbounds/Stats'
import VMStats from '@/Live/Voicemails/Stats'

export default {
  widgetName: 'Inbound Queue Manager',
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
