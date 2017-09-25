<template>
<div>
  <div class="row">
    <div class="col"><h3>Inqueue requests</h3></div>
  </div>
  <b-table style="margin-top:10px" striped hover responsive :items="inqueues" :fields="fields">
    <template slot="twe" scope="data">
      {{data.item.time}} {{data.item.weight}} {{data.item.effective}}
    </template>
    <template slot="actions" scope="data">
      <b-button size="sm" variant="primary" @click="take(data.item)">Take</b-button>
      <b-button size="sm" variant="success" @click="spy(data.item)">Spy</b-button>
      <b-button size="sm" variant="danger" @click="barge(data.item)">Barge</b-button>
    </template>
  </b-table>
</div>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'inqueues',
  data () {
    return {
      fields: {
        state: { label: 'State', sortable: true },
        record: { label: 'Type', sortable: true },
        queue: { label: 'Queue', sortable: true },
        twe: { label: 'T.W.E.', sortable: true },
        actions: { label: 'Actions' }
      },
      name: 'monitor/inqueues',
      inqueues: [],
      queues: [],
      updater: null
    }
  },
  methods: {
    handleState ({info}) {
      let i = this.inqueues.findIndex(E => E.uuid === info.uuid)
      if (i >= 0) {
        if (info.state === 'terminate') {
          this.inqueues.splice(i, 1)
        } else {
          this.inqueues.splice(i, 1, info)
        }
      } else {
        this.inqueues.push(info)
      }
    },
    query: async function() {
      this.queues = await this.$agent.p_mfa('ws_admin', 'get_queues', [])
      this.inqueues = await this.$agent.p_mfa('ws_admin', 'inqueues', ['all'])
      this.inqueues.forEach((inq) => {
        inq.time = Math.round(inq.time/1000)
        inq.effective = Math.round(inq.effective_time.time/1000)
        inq.queue = this.queue_name(inq.queue_id)
      })
    },
    onTimer () {
      this.inqueues.forEach((E, i, Arr) => { 
        E.time = E.time + 1
        E.effective = E.effective + 1
        Arr.splice(i, 1, E)
      })
    },
    queue_name (Id) {
      let Queue = this.queues.find(I => I.id == Id)
      return Queue? Queue.name : ''
    },
    take ({record, uuid}) {
      this.$agent.p_mfa('ws_admin', 'take', [record, uuid])
    },
    spy ({record, uuid}) {
      this.$agent.p_mfa('ws_admin', 'spy', [record, uuid])
    },
    barge ({record, uuid}) {
      this.$agent.p_mfa('ws_admin', 'barge', [record, uuid])
    }
  },
  created () {
    this.query()
    this.$agent.subscribe('inqueues')
    this.$bus.$on('inqueue_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
  },
  beforeDestroy () {
    this.$bus.$off('inqueue_state', this.handleState)
    clearInterval(this.updater)
  },
  components: {
    btable: Btable
  }
}
</script>