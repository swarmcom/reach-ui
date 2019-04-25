<template>
<div>
  <toggle-bar />
  <b-collapse
    v-model="showCollapse"
    id="liveManager"
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
