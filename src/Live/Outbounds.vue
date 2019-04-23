<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse">
    <stats></stats>
    <monitor></monitor>
  </b-collapse>
</div>
</template>

<script>
import Monitor from '@/Live/Outbounds/Monitor'
import Stats from '@/Live/Outbounds/Stats'

export default {
  widgetName: 'Outbound Queue Manager',
  components: {
    monitor: Monitor,
    stats: Stats
  },
  data () {
    return {
      showCollapse: true
    }
  },
}
</script>
