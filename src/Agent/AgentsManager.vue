<template>
  <div>
    <toggle-bar style="cursor: move" />
    <b-collapse
      id="collapseSessionManager"
      v-model="showCollapse"
      class="mt-2 itemDragable"
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
      showCollapse: true,
    }
  },
}
</script>
