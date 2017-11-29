<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentManager" class="mt-2">
  <b-row>
    <b-col cols="2">
      <div class="row toggle-bar-custom">
        <div class="title">Filter</div>
      </div>
      <b-input-group size="sm" style="margin-top:10px">
        <b-btn class="pointer" id="search" size="sm" variant="primary"
                  v-b-popover.hover.top="'Click to see how to search'">
        ?
        </b-btn>
        <b-popover target="search"
            title="Search Help"
            triggers="click"
            placement="top"
            content="You can search for any agent, queue, line, agent called id number,
                     agent caller id name or agent caller id number by typing characters to the keyboard.">
        </b-popover>
        <b-form-input style="cursor: text" v-model="filter" placeholder="Search ..."/>
        </b-form-input>
      </b-input-group>
      </b-input-group>
      <div class="agent-state-text" style="margin-top:10px">Start Date:</div>
      <date-picker class="pointer" size="sm" v-model="startDate" :config="config"></date-picker>
      <div class="agent-state-text" style="margin-top:10px">End Date:</div>
      <date-picker class="pointer" size="sm" v-model="endDate" :config="config"></date-picker>
      <div class="agent-state-text" style="margin-top:10px">Queue:</div>
      <b-form-select class="pointer" size="sm" v-model="selectedQueue">
        <option v-for="queue in this.queues" :value=queue.name>{{queue.name}}</option>
      </b-form-select>
      <div class="agent-state-text" style="margin-top:10px">Line:</div>
      <b-form-select class="pointer" size="sm" v-model="selectedLine">
        <option v-for="line in this.line_ins" :value=line.name>{{line.name}}</option>
      </b-form-select>
      <div class="agent-state-text" style="margin-top:10px">Customer:</div>
      <b-form-select class="pointer" size="sm" v-model="selectedCustomer">
        <option v-for="client in this.clients" :value=client.name>{{client.name}}</option>
      </b-form-select>
    </b-col>
    <b-col cols="10">
      <b-col cols="2" class="float-right">
      <b-form-select size="sm" :options="pageOptions" v-model="perPage" @input="onSelectChange"/>
      </b-col>
      <b-table style="margin-top:10px" small
        :items="computedRecordings"
        :fields="fields"
        :filter="filter"
        :current-page="currentPage"
        :per-page="perPage"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        @filtered="onFiltered"
        @sort-changed="onSortingChanged">
        <template  slot="player" slot-scope="data">
          <b-form-checkbox v-if="data.item.keep_record" v-model="data.item._showDetails" plain></b-form-checkbox>
        </template>
        <template slot="row-details" slot-scope="data">
          <b-card>
            <player :href="data.item.call_record_path"></player>
          </b-card>
        </template>
        <template slot="line_in" slot-scope="data">
          {{ maybe_name(data.item.line_in) }}
        </template>
        <template slot="client" slot-scope="data">
          {{ maybe_name(data.item.line_in.client) }}
        </template>
        <template slot="queue" slot-scope="data">
          {{ maybe_name(data.item.queue) }}
        </template>
        <template slot="queue_names" slot-scope="data">
          {{ getQueueNames(data.item.queues, data.item.queue) }}
        </template>
        <template slot="agent" slot-scope="data">
          {{ maybe_name(data.item.agent) }}
        </template>
        <template slot="caller_id" slot-scope="data">
          <div class="agent-state-text"><b>Name: </b>{{data.item.vars['Caller-Caller-ID-Name']}}</div>
          <div class="agent-state-text"><b>Number: </b>{{data.item.vars['Caller-Caller-ID-Number']}}</div>
        </template>
        <template slot="called_id" slot-scope="data">
          <div class="agent-state-text"><b>Number: </b>{{data.item.vars['Caller-Destination-Number']}}</div>
        </template>
      </b-table>
      <b-pagination size="sm" align="center" v-if="perPage > 0" :total-rows="totalRows" :per-page="perPage" v-model="currentPage" />
      <b-btn class="pointer" size="sm" style="width:80px" variant="primary" @click="reload">Refresh</b-btn>
    </b-col>
  </b-row>
  </b-collapse>
</div>
</template>

<script>
import Player from '@/Recordings/Player'
import 'bootstrap/dist/css/bootstrap.css';
import datePicker from 'vue-bootstrap-datetimepicker';
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css';
export default {
  name: 'records',
  storageName: 'callRecordings',
  widgetName: 'CALL RECORDINGS',
  components: {
    player: Player,
    'date-picker': datePicker
  },
  data () {
    return {
      fields: {
        player: { label: 'Show Recordings', _showDetails: false },
        ts: { label: 'Date / Start Time', sortable: true, formatter: (ts) => (new Date(ts)).toLocaleString() },
        client: { label: 'Customer', sortable: true },
        queue: { label: 'Queue', sortable: true },
        line_in: { label: 'Line In', sortable: true },
        agent: { label: 'Agent', sortable: true },
        caller_id: { label: 'Caller ID' },
        called_id: { label: 'Called ID' }
      },
      recordings: [],
      clients: [],
      queues: [],
      line_ins: [],
      filter: null,
      currentPage: 1,
      perPage: 5,
      pageOptions: [
        {text:'All', value:0},
        {text:5,value:5},{text:10,value:10},{text:15,value:15}, {text:20,value:20}, {text:25,value:25}, {text:30,value:30}
      ],
      totalRows: 0,
      startDate: '',
      endDate: '',
      config: {
        format: 'MM/DD/YYYY',
        useCurrent: false
      },
      selectedCustomer: 'Any Customer',
      selectedQueue: 'Any Queue',
      selectedLine: 'Any Line',
      sortBy: 'ts',
      sortDesc: false,
      showCollapse: true,
      params: {}
    }
  },
  methods: {
    query: async function() {
      this.startDate = new Date()
      this.startDate.setHours(0,0,0,0)
      this.startDate.setDate(this.startDate.getDate() - 1)
      this.endDate = new Date()
      this.endDate.setHours(23,59,59,999)
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
      this.clients.unshift({ name:"Any Customer" })
      this.line_ins = await this.$agent.p_mfa('ws_db_line_in', 'get')
      this.line_ins.unshift({ name:"Any Line" })
      this.queues = await this.$agent.p_mfa('ws_db_queue', 'get')
      this.queues.unshift({ name:"Any Queue" })
      this.recordings = await this.$agent.p_mfa('ws_report', 'inqueues_sessions', [this.params])
    },
    format_ms (ms) {
      if (Number.isInteger(ms)) {
        return (ms/1000).toFixed(1)
      } else {
        return ""
      }
    },
    maybe_name (item) {
      if (typeof item === 'object') {
        return item.name
      } else {
        return ''
      }
    },
    getQueueNames (queues, queue) {
      let names = ''
      if (queues != undefined) {
        queues.forEach( (queue) => {
          names = names + queue + ' '
        } )
        return names;
      }
      else {
        return names = queue.name
      }
    },
    reload: async function() {
      this.recordings = await this.$agent.p_mfa('ws_report', 'inqueues_sessions', [this.params])
    },
    onSortingChanged (ctx){
      this.$agent.vm.storage_data[this.$options.storageName+'SortBy'] = ctx.sortBy
      this.$agent.vm.storage_data[this.$options.storageName+'SortDesc'] = ctx.sortDesc
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onSelectChange (value) {
      this.$agent.vm.storage_data[this.$options.storageName+'PerPage'] = value
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    },
  },
  created () {
    this.query()
    if (this.$agent.vm.storage_data.callRecordingsCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.callRecordingsCollapsed
    if (this.$agent.vm.storage_data.callRecordingsSortBy != undefined)
      this.sortBy = this.$agent.vm.storage_data.callRecordingsSortBy
    if (this.$agent.vm.storage_data.callRecordingsSortDesc != undefined)
      this.sortDesc = this.$agent.vm.storage_data.callRecordingsSortDesc
    if (this.$agent.vm.storage_data.callRecordingsPerPage != undefined)
      this.perPage = this.$agent.vm.storage_data.callRecordingsPerPage
  },
  computed: {
    computedRecordings () {
      let recordings = this.recordings.slice(0)
      let compRecordings = []
      recordings.forEach( (key) => {
        let actDate = new Date(key.ts)
        let startDate =new Date(this.startDate)
        startDate.setHours(0,0,0,0)
        let endDate =new Date(this.endDate)
        endDate.setHours(23,59,59,9999)

        if(!key.keep_record)
          return

        if(actDate.getTime() > endDate.getTime() || actDate.getTime() < startDate.getTime() )
          return

        if(key.line_in.client != undefined) {
          if(this.selectedCustomer != key.line_in.client.name && this.selectedCustomer != 'Any Customer'){
            return
          }
        }
        else if(this.selectedCustomer != 'Any Customer'){
          return
        }

        if(key.queue != undefined) {
          if(this.selectedQueue != key.queue.name && this.selectedQueue != 'Any Queue'){
            return
          }
        }
        else if(this.selectedQueue != 'Any Queue'){
          return
        }

        if(key.line_in != undefined) {
          if(this.selectedLine != key.line_in.name && this.selectedLine != 'Any Line'){
            return
          }
        }
        else if(this.selectedLine != 'Any Line'){
          return
        }
        compRecordings.push(key);

      } )
      this.totalRows = compRecordings.length
      return compRecordings;
    }
  }
}
</script>
