<template>
  <div>
    <toggle-bar style="cursor: move" />
    <b-collapse
      id="collapseSessionManager"
      v-model="showCollapse"
      class="mt-2 itemDragable"
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
  widgetName: 'Inbounds Manager',
  components: {
    monitor: Monitor,
    stats: Stats,
    vmstats: VMStats
  },
  data () {
    return {
      showCollapse: true,
    }
  },
}
</script>
