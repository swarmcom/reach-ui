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
