<template>
<div v-access:queueManager-widget>
  <toggle-bar style="cursor: move"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseQueueManager" class="mt-2 itemDragable">
    <inqueues-view :inqueues="inqueues"></inqueues-view>
    <inqueues-monitor :inqueues="inqueues"></inqueues-monitor>
    <outgoings></outgoings>
  </b-collapse>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import InqueuesView from '@/Monitor/Widget/InqueuesView'
import InqueuesMonitor from '@/Monitor/Widget/InqueuesMonitor'
import Outgoings from '@/Monitor/Widget/Outgoings'
import Storage from '@/Storage'

export default {
  name: 'queue-manager',
  widgetName: 'QUEUE MANAGER',
  mixins: [Common, Storage],
  data() {
    return {
      name: 'monitor/inqueues',
      inqueues: [],
      queues: [],
      updater: null,
      showCollapse: true
    }
  },
  methods: {
    handleState({info}) {
      if (info != undefined) {
        let i = this.inqueues.findIndex(E => E.uuid === info.uuid)
        if (i >= 0) {
          if (info.state === 'terminate') {
            this.inqueues.splice(i, 1)
          } else {
            this.inqueues.splice(i, 1, this.enrich_queue(info))
          }
        } else {
          this.inqueues.push(this.enrich_queue(info))
        }
      }
    },
    enrich_queue(info) {
      info.date = new Date()
      info.effective = Math.round(info.effective_time.time / 1000)
      info.queue = this.queue_name(info.queue_id)
      info.skillsReq = (Object.keys(info.skills)).toString()
      info.customer = info.line_in.client
      info.line = info.line_in.name
      return info
    },
    query: async function () {
      this.queues = await this.$agent.p_mfa('ws_agent', 'queues')
      this.inqueues = await this.$agent.p_mfa('ws_agent', 'inqueues')
      this.inqueues.forEach((inq) => {
        inq.date = new Date() - inq.time
        inq.effective = Math.round(inq.effective_time.time / 1000)
        inq.queue = this.queue_name(inq.queue_id)
        inq.customer = inq.line_in.client
        inq.line = inq.line_in.name
        inq.skillsReq = (Object.keys(inq.skills)).toString()
      })
    },
    onTimer() {
      this.inqueues.forEach((E, i, Arr) => {
        E.effective = E.effective + 1
        E.timeInQueue = this.msToHms((new Date() - E.date).toString())
        Arr.splice(i, 1, E)
      })
    },
    queue_name(Id) {
      let Queue = this.queues.find(I => I.id == Id)
      return Queue ? Queue.name : ''
    },
    loadDataStorage() {
      this.loadLocal(['showCollapse'])
    },
    saveDataStorage() {
      this.saveLocal(['showCollapse']).writeLocal()
    }
  },
  created() {
    this.query()
    this.$agent.subscribe('inqueues')
    this.$bus.$on('inqueue_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
    this.maybeInitLocal().loadDataStorage()
  },
  beforeDestroy() {
    this.$bus.$off('inqueue_state', this.handleState)
    clearInterval(this.updater)
  },
  watch: {
    showCollapse: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveDataStorage()
      }
    },
  },
  components: {
    'inqueues-view': InqueuesView,
    'inqueues-monitor': InqueuesMonitor,
    'outgoings': Outgoings
  }
}
</script>
