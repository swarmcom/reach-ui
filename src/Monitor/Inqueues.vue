<template>
  <div>
    <div class="row">
      <div class="col"><h3>Inqueue requests</h3></div>
    </div>
    <custom-table
      :data="computedInqueues"
      :columns="columns"
      :dataArguments="dataArguments"
      :name="name"
      :clickable="0">
    </custom-table>
  </div>
</template>

<script>
import CustomTable from '../Widget/CustomTable'

export default {
  name: 'inqueues',
  data () {
    return {
      columns: ['State', 'Record', 'Queue', 'Time', 'Effective Time'],
      dataArguments: ['state', 'record', 'queue', 'timeComputed', 'effective'],
      name: "monitorInqueuesRows",
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
      this.agents = await this.$agent.p_mfa('ws_admin', 'agents', ['all'])
    },
    onTimer () {
      this.inqueues.forEach((E, i, Arr) => { 
        E.time = E.time + 1000
        E.effective_time.time = E.effective_time.time + 1000
        Arr.splice(i, 1, E)
      })
    }
  },
  mounted () {
    this.onTimer()
  },
  created () {
    this.query()
    this.$agent.subscribe('inqueues')
    this.$bus.$on('inqueue_state', (S) => this.handleState(S))
    this.updater = setInterval( () => this.onTimer(), 1000 )
  },
  destroyed () {
    clearInterval(this.updater)
  },
  components: {
    'custom-table': CustomTable
  },
  computed: {
    computedInqueues () {
      let inqueues = this.inqueues;
      inqueues.forEach((key) => {
        key.timeComputed = Math.round(key.time/1000).toString() + 's'
        key.effective =  key.effective_time.weight.toString() + '-' + Math.round(key.effective_time.time/1000).toString() + 's'
      })
      return inqueues;
    }
  }
}
</script>