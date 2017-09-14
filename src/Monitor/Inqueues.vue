<template>
  <div>
    <div class="row">
      <div class="col"><h3>Inqueue requests</h3></div>
    </div>
    <div style="float: right; margin-bottom:10px;">
      Rows
      <input v-model.number="rowsPerPage" type="number" min="0" style="height:38px">
      Filter
      <input v-model="searchQuery" type="text" style="height:38px">
    </div>
    <custom-table style="margin-top: 20px"
      :data="computedInqueues"
      :columns="columns"
      :dataArguments="dataArguments"
      :rowsPerPage="rowsPerPage"
      :filter-key="searchQuery"
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
      rowsPerPage: 0,
      searchQuery: '',
      columns: ['State', 'Record', 'Queue', 'Time', 'Effective Time'],
      dataArguments: ['state', 'record', 'queue', 'timeComputed', 'effective'],
      inqueues: []
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
    query () {
      this.$agent.inqueues(Obj => this.inqueues = Obj.reply)
    },
    onTimer () {
      this.inqueues.forEach((E, i, Arr) => { 
        E.time = E.time + 1000
        E.effective_time.time = E.effective_time.time + 1000
        Arr.splice(i, 1, E)
      })
      setTimeout( this.onTimer, 1000 )
    }
  },
  mounted () {
    this.onTimer()
    if(localStorage.getItem('monitorInqueuesRows')) this.rowsPerPage = localStorage.getItem('monitorInqueuesRows')
  },
  watch: {
    rowsPerPage: {
      handler() {
        localStorage.setItem('monitorInqueuesRows', this.rowsPerPage);
      },
      deep: true,
    },
  },
  created () {
    this.$agent.subscribe('inqueues')
    this.query()
    this.$bus.$on('inqueue_state', (S) => this.handleState(S))
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