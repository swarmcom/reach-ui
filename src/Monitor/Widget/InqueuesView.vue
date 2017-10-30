<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseQueueManagerView" class="mt-2">
    <div class="row">
      <div class="col-2">
        <div class="row toggle-bar-custom">
          <div class="title">Queue Name</div>
        </div>
        <br></br>
        <label v-for="queueName in this.queues" :id=queueName.name class="col-12" style="height:27px; border-bottom: solid 1px;">{{ queueName.name }}</label>
      </div>
      <div class="row col-10">
        <div class="col-2">
          <div class="row toggle-bar-custom" style="margin-left:1px">
            <div class="title">Calls in Queue</div>
          </div>
          <b-table style="margin-top:10px" small striped hover
            :items="computedStats"
            :fields="fieldCIQ">
          </b-table>
        </div>
        <div class="col-10">
          <div class="row toggle-bar-custom" style="margin-left:1px">
            <div class="title">Queue Statistics</div>
          </div>
          <b-table style="margin-top:10px" small striped hover
            :items="computedStats"
            :fields="fieldsStats">
          </b-table>
        </div>
      </div>
    </div>
  </b-collapse>
</div>
</template>
<script>
import ToggleBar from '../../Widget/ToggleBar'
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
      fieldsStats: {
        speedAnswer: { label: 'Speed Answer' },
        longestWait: { label: 'Longest Wait' },
        connected: { label: 'Connected' },
        completed: { label: 'Completed' },
        abandonTime: { label: 'Abandon Time' },
        abandoned: { label: 'Abandoned' }
      },
      queues: [],
      showCollapse: true,
    }
  },
  methods: {
    query: async function() {
      this.queues = await this.$agent.p_mfa('ws_db_queue', 'get')
    }
  },
  created () {
    this.query()
    if (this.$agent.vm.storage_data.queueManagerViewCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.queueManagerViewCollapsed
  },
  components: {
    toggleBar: ToggleBar
  },
  computed: {
    computedStats () {
      let stats = []
      this.queues.forEach( (key) => {
        let selectedQueue = key.name
        let object = {
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