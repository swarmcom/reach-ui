<template>
  <div v-access:widget-call-details>
    <toggle-bar style="cursor: move" />
    <b-collapse
      id="collapseCallDetails"
      v-model="showCollapse"
      class="mt-2 itemDragable"
    >
      <b-row style="margin-top:10px">
        This is page for calls waiting in queue for particular agent
      </b-row>
    </b-collapse>
  </div>
</template>

<script>
import Common from '@/Admin/Common'
import Storage from '@/Storage'

export default {
  widgetName: 'Call details',
  name: 'CallDetails',
  mixins: [Common, Storage],
  data () {
    return {
      showCollapse: true
    }
  },
  watch: {
    showCollapse: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveLocal('showCollapse').writeLocal()
      }
    }
  },
  created () {
    this.maybeInitLocal().loadLocal('showCollapse')
  }
}
</script>
