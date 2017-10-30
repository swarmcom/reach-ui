<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseQueueManager" class="mt-2">
    <inqueues-view :inqueues="inqueues"></inqueues-view>
    <b-table style="margin-top:10px" small striped hover :items="inqueues" :fields="fields">
      <template slot="twe" slot-scope="data">
        {{data.item.time}} {{data.item.weight}} {{data.item.effective}}
      </template>
      <template slot="actions" slot-scope="data">
        <b-button size="sm" variant="primary" @click="take(data.item)">Take</b-button>
        <b-button size="sm" variant="primary" @click="takeover(data.item)">Takeover</b-button>
        <b-button size="sm" variant="success" @click="spy(data.item)">Spy</b-button>
        <b-button size="sm" variant="danger" @click="hangup(data.item)">Hangup</b-button>
      </template>
    </b-table>
  </b-collapse>
</div>
</template>

<script>
import ToggleBar from '../Widget/ToggleBar'
import Common from '../Admin/Common'
import InqueuesView from './Widget/InqueuesView'
export default {
  name: 'inqueues',
  storageName: 'queueManager',
  widgetName: 'QUEUE MANAGER',
  mixins: [Common],
  data () {
    return {
      fields: {
        state: { label: 'State', sortable: true },
        groupName: { label: 'Customer', sortable: true },
        record: { label: 'Type', sortable: true },
        queue: { label: 'Queue', sortable: true },
        skillsReq: { label: 'Skills', sortable: true },
        timeInQueue: { label: 'T in Queue', sortable: true },
        //twe: { label: 'T in Queue', sortable: true },
        actions: { label: 'Actions' }
      },
      name: 'monitor/inqueues',
      inqueues: [],
      queues: [],
      updater: null,
      showCollapse: true
    }
  },
  methods: {
    handleState ({info}) {
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
    },
    enrich_queue (info) {
      info.time = this.msToHms(Math.round(info.time)) //Math.round(info.time/1000)
      info.effective = Math.round(info.effective_time.time/1000)
      info.queue = this.queue_name(info.queue_id)
      return info
    },
    query: async function() {
      this.queues = await this.$agent.p_mfa('ws_db_queue', 'get', [])
      this.inqueues = await this.$agent.p_mfa('ws_admin', 'inqueues', ['all'])
      this.inqueues.forEach((inq) => {
        inq.time =  Math.round(inq.time/1000)
        inq.effective = Math.round(inq.effective_time.time/1000)
        inq.queue = this.queue_name(inq.queue_id)
        inq.groupName = inq.group
        inq.skillsReq = (Object.keys(inq.skills)).toString()
      })
    },
    onTimer () {
      this.inqueues.forEach((E, i, Arr) => { 
        E.time = E.time + 1
        E.effective = E.effective + 1
        E.timeInQueue = this.msToHms((E.time*1000).toString())
        Arr.splice(i, 1, E)
      })
    },
    queue_name (Id) {
      let Queue = this.queues.find(I => I.id == Id)
      return Queue? Queue.name : ''
    },
    take ({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'take', [record, uuid])
    },
    takeover ({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'takeover', [record, uuid])
    },
    spy ({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'spy', [record, uuid])
    },
    hangup ({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'hangup', [record, uuid])
    }
  },
  created () {
    this.query()
    this.$agent.subscribe('inqueues')
    this.$bus.$on('inqueue_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
    if (this.$agent.vm.storage_data.queueManagerCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.queueManagerCollapsed
  },
  beforeDestroy () {
    this.$bus.$off('inqueue_state', this.handleState)
    clearInterval(this.updater)
  },
  components: {
    toggleBar: ToggleBar,
    'inqueues-view': InqueuesView
  }
}
</script>
