<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseQueueManagerCallView" class="mt-2">
    <div class="row">
      <div class="col-2">
        <div class="row toggle-bar-custom">
          <div class="titlenocollapse">Filter</div>
        </div>
        <b-form-input size="sm" v-model="filter" placeholder="Search..." style="margin-top:10px" />
        <b-form-select class="pointer" size="sm" v-model="selectedQueue" style="margin-top:10px">
          <option v-for="queue in this.queues" :value=queue.name>{{queue.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedLine" style="margin-top:10px">
          <option v-for="line in this.lines" :value=line.name>{{line.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedCustomer" style="margin-top:10px">
          <option v-for="client in this.clients" :value=client.name>{{client.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedState" style="margin-top:10px">
          <option v-for="state in this.states" :value=state.name>{{state.name}}</option>
        </b-form-select>
      </div>
      <div class="col-10">
        <b-table style="margin-top:10px" small bordered
          :items="computedInqueues"
          :fields="fields"
          :filter="filter"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          @sort-changed="onSortingChanged">
          <template slot="actions" slot-scope="data">
            <b-row>
              <b-col>
                <button type="button" class="btn btn-sm pointer" v-if="data.item._showDetails" @click="data.item._showDetails = false">
                  <icon name="minus" scale="0.5"></icon>
                </button>
                <button type="button" class="btn btn-sm pointer" v-if="!data.item._showDetails" @click="data.item._showDetails = true">
                    <icon name="plus" scale="0.5"></icon>
                </button>
              </b-col>
            </b-row>
          </template>
          <template slot="row-details" slot-scope="data">
            <b-row class="text-center">
            <b-col>
            <b-dropdown size="sm" class="agent-release-dropdown" text="Select Action" variant="outline-secondary">
              <b-dropdown-item @click="take(data.item)">Take</b-dropdown-item>
              <b-dropdown-item @click="takeover(data.item)">Takeover</b-dropdown-item>
              <b-dropdown-item @click="spy(data.item)">Spy</b-dropdown-item>
              <b-dropdown-item @click="hangup(data.item)">Hangup</b-dropdown-item>
            </b-dropdown>
            </b-col>
            </b-row>
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
        actions: { label: 'Actions' },
        state: { label: 'State', sortable: true },
        record: { label: 'Type', sortable: true },
        customer: { label: 'Customer', sortable: true },
        line: { label: 'Line', sortable: true },
        queue: { label: 'Queue', sortable: true },
        skillsReq: { label: 'Skills Req', sortable: true },
        timeInQueue: { label: 'T in Queue', sortable: true }
      },
      clients: [],
      queues: [],
      lines: [],
      states: [
        {name: "Any State"},
        {name: "oncall"},
        {name: "inqueue"}
      ],
      selectedQueue: 'Any Queue',
      selectedCustomer: 'Any Customers',
      selectedLine: 'Any Lines',
      selectedState: 'Any State',
      filter: null,
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
      let inqueues = this.inqueues.slice(0)
      let compInqueues = []
      inqueues.forEach( (key) => {
        if(key.queue != undefined){
          if(this.selectedQueue != key.queue && this.selectedQueue != 'Any Queue')
            return
        }
        else if(this.selectedQueue != 'Any Queue')
          return

        if(key.line != undefined) {
          if(this.selectedLine != key.line && this.selectedLine != 'Any Lines')
            return
        }
        else if(this.selectedLine != 'Any Lines')
          return

        if(key.customer != undefined) {
          if(this.selectedCustomer != key.customer && this.selectedCustomer != 'Any Customers')
            return
        }
        else if(this.selectedCustomer != 'Any Customers')
          return

        if(this.selectedState == 'inqueue' && key.state == 'agent') {
          compInqueues.push(key)
          return
        }
        else if(this.selectedState != key.state && this.selectedState != 'Any State')
          return

        compInqueues.push(key)
      } )
      return compInqueues
    }
  }
}
</script>
