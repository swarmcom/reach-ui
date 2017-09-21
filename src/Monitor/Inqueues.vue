<template>
<div>
  <div class="row">
    <div class="col"><h3>Inqueue requests</h3></div>
  </div>
  <btable :fields="fields" :data="inqueues" :storageName="name" :add_button=false></btable>
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
        record: { label: 'Record', sortable: true },
        queue_id: { label: 'Queue', sortable: true },
        time: { label: 'Time', sortable: true },
        effective: { label: 'Effective', sortable: true }
      },
      name: 'monitor/inqueues',
      inqueues: [],
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
      this.inqueues = await this.$agent.p_mfa('ws_admin', 'inqueues', ['all'])
      this.inqueues.forEach((inq) => {
        inq.time = Math.round(inq.time/1000)
        inq.effective = Math.round(inq.effective_time.time/1000)
      })
    },
    onTimer () {
      this.inqueues.forEach((E, i, Arr) => { 
        E.time = E.time + 1
        E.effective = E.effective + 1
        Arr.splice(i, 1, E)
      })
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
    'btable': Btable
  }
}
</script>