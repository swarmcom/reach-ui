<template>
  <div>
    <toggle-bar />
    <b-collapse
      id="liveManager"
      v-model="showCollapse"
      style="padding-top: 10px"
    >
      <stats />
      <monitor />
    </b-collapse>
  </div>
</template>

<script>
import Monitor from '@/Live/Outbounds/Monitor'
import Stats from '@/Live/Outbounds/Stats'

export default {
  widgetName: 'Outbound Call Manager',
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
