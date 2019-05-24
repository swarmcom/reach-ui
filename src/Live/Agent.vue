<template>
  <div>
    <toggle-bar />
    <b-collapse 
      id="liveManager"
      v-model="showCollapse"
      style="padding-top: 10px"
    >
      <group />
      <stats />
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
      showCollapse: true
    }
  },
}
</script>
