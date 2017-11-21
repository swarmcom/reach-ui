<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseQueueManagerCallView" class="mt-2">
    <div class="row">
      <div class="col-2">
        <div class="row toggle-bar-custom">
          <div class="title">Filter</div>
        </div>
        <b-form-select class="pointer" size="sm" v-model="selectedQueue" style="margin-top:10px">
          <option v-for="queue in this.queues" :value=queue.name>{{queue.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedLine" style="margin-top:10px">
          <option v-for="line in this.lines" :value=line.name>{{line.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedCustomer" style="margin-top:10px">
          <option v-for="client in this.clients" :value=client.name>{{client.name}}</option>
        </b-form-select>
      </div>
      <div class="col-10">
        <b-table style="margin-top:10px" small striped bordered hover
          :items="computedInqueues"
          :fields="fields"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          @sort-changed="onSortingChanged">
          <template slot="actions" slot-scope="data">
          <b-input-group-button size="sm">
            <b-button size="sm" variant="outline-secondary" @click="take(data.item)">Take</b-button>
            <b-button size="sm" variant="outline-secondary" @click="takeover(data.item)">Takeover</b-button>
            <b-button size="sm" variant="outline-secondary" @click="spy(data.item)">Spy</b-button>
            <b-button size="sm" variant="outline-secondary" @click="hangup(data.item)">Hangup</b-button>
          </b-input-group-button size="sm">
          </template>
        </b-table>
      </div>
    </div>
  </b-collapse>
</div>
</template>

<script>
export default {
  name: 'monitor-queues-manager',
  storageName: 'queueManagerMonitor',
  widgetName: 'Call View',
  props: {
    inqueues: Array
  },
  data () {
    return {
      fields: {
        state: { label: 'State', sortable: true },
        record: { label: 'Type', sortable: true },
        customer: { label: 'Customer', sortable: true },
        line: { label: 'Line', sortable: true },
        queue: { label: 'Queue', sortable: true },
        skillsReq: { label: 'Skills Req', sortable: true },
        timeInQueue: { label: 'T in Queue', sortable: true },
        //twe: { label: 'T in Queue', sortable: true },
        actions: { label: 'Actions' }
      },
      clients: [],
      queues: [],
      lines: [],
      selectedQueue: 'Any Queue',
      selectedCustomer: 'Any Customers',
      selectedLine: 'Any Lines',
      sortBy: 'agent_id',
      sortDesc: false,
      showCollapse: true
    }
  },
  methods: {
    query: async function() {
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
      this.clients.unshift({ name:"Any Customers" })
      this.queues = await this.$agent.p_mfa('ws_db_queue', 'get', [])
      this.queues.unshift({ name:"Any Queue" })
      this.lines = await this.$agent.p_mfa('ws_db_line_in', 'get')
      this.lines.unshift({ name:"Any Lines" })
    },
    onSortingChanged (ctx){
      this.$agent.vm.storage_data[this.$options.storageName+'SortBy'] = ctx.sortBy
      this.$agent.vm.storage_data[this.$options.storageName+'SortDesc'] = ctx.sortDesc
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
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
    if (this.$agent.vm.storage_data.queueManagerMonitorCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.queueManagerMonitorCollapsed
    if (this.$agent.vm.storage_data.queueManagerMonitorSortBy != undefined)
      this.sortBy = this.$agent.vm.storage_data.queueManagerMonitorSortBy
    if (this.$agent.vm.storage_data.queueManagerMonitorSortDesc != undefined)
      this.sortDesc = this.$agent.vm.storage_data.queueManagerMonitorSortDesc
  },
  computed: {
    computedInqueues () {
      let inqueues = this.inqueues
      let compInqueues = []
      inqueues.forEach( (key) => {
        compInqueues.push(key);

        if(key.queue != undefined){
          if(this.selectedQueue != key.queue && this.selectedQueue != 'Any Queue')
            compInqueues.pop(key)
        }
        else if(this.selectedQueue != 'Any Queue'){
          compInqueues.pop(key)
        }

        if(key.line != undefined) {
          if(this.selectedLine != key.line && this.selectedLine != 'Any Lines'){
            compInqueues.pop(key)
          }
        }
        else if(this.selectedLine != 'Any Lines'){
          compInqueues.pop(key)
        }

        if(key.customer != undefined) {
          if(this.selectedCustomer != key.customer && this.selectedCustomer != 'Any Customers'){
            compInqueues.pop(key)
          }
        }
        else if(this.selectedCustomer != 'Any Customers'){
          compInqueues.pop(key)
        }

      } )
      return compInqueues;
    }
  }
}
</script>
