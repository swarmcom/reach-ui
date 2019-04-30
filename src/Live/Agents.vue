<template>
  <div>
    <toggle-bar />
    <b-collapse
      id="liveManager"
      v-model="showCollapse"
    >
      <stats />
      <monitor />
    </b-collapse>
  </div>
</template>

<script>
import Monitor from '@/Live/Agents/Monitor'
import Stats from '@/Live/Agents/Stats'

export default {
  widgetName: 'Agents Manager',
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
