<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseQueueManagerView" class="mt-2">
    <b-row>
      <b-col cols="2">
        <b-row class="toggle-bar-custom">
          <div class="titlenocollapse">Queue Name</div>
        </b-row>
        <b-table style="margin-top:10px" small bordered hover
          :items="computedStats"
          :fields="fieldNames">
        </b-table>
      </b-col>
      <b-col cols="10">
        <b-row>
          <b-col cols="2">
            <b-row class="toggle-bar-custom" style="margin-left:1px">
              <div class="titlenocollapse">Calls in Queue</div>
            </b-row>
            <b-table style="margin-top:10px" small striped bordered hover
              :items="computedStats"
              :fields="fieldCIQ">
            </b-table>
          </b-col>
          <b-col cols="10">
            <b-row class="toggle-bar-custom" style="margin-left:1px">
              <b-col cols="9">
              <div class="titlenocollapse">Queue Statistics</div>
              </b-col>
              <b-col cols="3">
              <b-form-select style="height:28px" class="pointer" size="sm" v-model="period.value" @change="set_period">
                <option v-for="period in periods" :value="period.value">{{period.name}}</option>
              </b-form-select>
              </b-col>
            </b-row>
            <b-table style="margin-top:10px" small striped bordered hover
              :items="computedStats"
              :fields="fieldsStats">
            </b-table>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>
<script>
export default {
  name: 'monitor-queues-view',
  storageName: 'queueManagerView',
  widgetName: 'Queue View',
  props: {
    inqueues: Array
  },
  data () {
    return {
      fieldCIQ: {
        ciq: { label: "CIQ"}
      },
      fieldNames: {
        name: { label: 'Name', sortable: false },
      },
      fieldsStats: {
        speedAnswer: { label: 'Speed Answer' },
        longestWait: { label: 'Longest Wait' },
        connected: { label: 'Connected' },
        completed: { label: 'Completed' },
        abandonTime: { label: 'Abandon Time' },
        abandoned: { label: 'Abandoned' }
      },
      queues: [],
      periods: [
        { value:"15m", name:"Last 15 minutes"},
        { value:"30m", name:"Last 30 minutes"},
        { value:"1h", name:"Last Hour"},
        { value:"1d", name:"Today" },
        { value:"1w", name:"This Week" },
        { value:"1m", name:"This Month" }
      ],
      period: { value: "15m", name: "Last 15 minutes"},
      showCollapse: true,
    }
  },
  methods: {
    query: async function() {
      this.queues = await this.$agent.p_mfa('ws_db_queue', 'get')
    },
    set_period (value) {
      this.period.value = value
    }
  },
  created () {
    this.query()
    if (this.$agent.vm.storage_data.queueManagerViewCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.queueManagerViewCollapsed
  },
  computed: {
    computedStats () {
      let stats = []
      this.queues.forEach( (key) => {
        let selectedQueue = key.name
        let object = {
          "name": key.name,
          "ciq":0,
          "speedAnswer": '-',
          "longestWait": '-',
          "connected": 0,
          "completed": '-',
          "abandonTime": '-',
          "abandoned": '-'
        }
        object._cellVariants = {
          ciq: 'warning',
          speedAnswer: 'primary',
          longestWait: 'primary',
          connected: 'success',
          completed: 'success',
          abandonTime: 'primary',
          abandoned: 'warning'
        }
        this.inqueues.forEach( (key) => {
          if(key.queue != undefined && selectedQueue == key.queue) {
            object.ciq++
            if(key.state == 'oncall')
            object.connected++
          }
        } )
        stats.push(object)
      })
      return stats;
    }
  }
}
</script>