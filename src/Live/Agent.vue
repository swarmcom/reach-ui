<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse">
    <group></group>
    <stats></stats>
  </b-collapse>
</div>
</template>

<script>
import Stats from '@/Live/Agent/Stats'
import Group from '@/Live/Agent/Group'

export default {
  widgetName: 'Agent Stats',
  components: {
    group: Group,
    stats: Stats
  },
  data () {
    return {
      showCollapse: false
    }
  },
}
</script>
