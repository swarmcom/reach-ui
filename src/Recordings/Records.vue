<template>
<div>
  <toggle-bar/>
  <b-collapse v-model="showCollapse" id="collapseAgentManager" class="mt-2">
  <b-row>
    <b-col cols="12" lg="2">
      <div class="row toggle-bar-custom">
        <div class="titlenocollapse">Filter</div>
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
            content="You can search for any customer, agent, queue, line, skills, agent call id number,
                     caller id number, called number or by typing characters to the keyboard.">
        </b-popover>
        <b-form-input class="customInput" style="cursor: text" :value="filter" v-on:input="onFilterUpdate" :state="filterState" placeholder="Search ..."></b-form-input>
      </b-input-group>
      <div class="agent-state-text" style="margin-top:10px">Start Date:</div>
      <datepicker v-model="startDate" bootstrapStyling/>
      <div class="agent-state-text" style="margin-top:10px">End Date:</div>
      <datepicker v-model="endDate" bootstrapStyling/>
      <div class="agent-state-text" style="margin-top:10px">Queue:</div>
      <b-form-select class="pointer" size="sm" v-model="selectedQueue">
        <option v-for="queue in this.queues" :value=queue.name>{{queue.name}}</option>
      </b-form-select>
      <div class="agent-state-text" style="margin-top:10px">Line In:</div>
      <b-form-select class="pointer" size="sm" v-model="selectedLine">
        <option v-for="line in this.line_ins" :value=line.name>{{line.name}}</option>
      </b-form-select>
      <div class="agent-state-text" style="margin-top:10px">Line Out:</div>
      <b-form-select class="pointer" size="sm" v-model="selectedLineOut">
        <option v-for="line in this.line_outs" :value=line.name>{{line.name}}</option>
      </b-form-select>
      <div class="agent-state-text" style="margin-top:10px">Customer:</div>
      <b-form-select class="pointer" size="sm" v-model="selectedCustomer">
        <option v-for="client in this.clients" :value=client.name>{{client.name}}</option>
      </b-form-select>
      <div class="agent-state-text" style="margin-top:10px">Skills:</div>
      <b-form-select class="pointer" size="sm" v-model="selectedSkill">
        <option v-for="skill in this.tags" :value=skill>{{skill}}</option>
      </b-form-select>
    </b-col>
    <b-col cols="12" lg="10" style="min-width:700px">
      <b-col cols="2" class="float-right">
      <b-form-select size="sm" :options="pageOptions" v-model="perPage" @input="onSelectChange"></b-form-select>
      </b-col>
      <b-table style="margin-top:10px" small hover
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
          <b-form-checkbox v-if="data.item.keep_record" v-model="data.item._showDetails"></b-form-checkbox>
        </template>
        <template slot="row-details" slot-scope="data">
          <b-card>
            <player :href="data.item.call_record_path"></player>
          </b-card>
        </template>
        <template slot="line" slot-scope="data">
          {{ maybe_name(data.item.line) }}
        </template>
        <template slot="client" slot-scope="data">
          {{ maybe_name(data.item.client) }}
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
        <template slot="agent" slot-scope="data">
          {{ maybe_name(data.item.agent) }}
        </template>
        <template slot="skills" slot-scope="data">
          <b-col cols="12" v-for="(v, k, index) in data.item.skills" key="index">{{k}}</b-col>
        </template>
        <template slot="caller" slot-scope="data">
          <div class="agent-state-text"><b>Direction: </b>{{data.item.direction}}</div>
          <div class="agent-state-text"><b>Call ID: </b>{{data.item.uuid}}</div>
          <div class="agent-state-text"><b>Caller ID: </b>{{data.item.caller}}</div>
          <div class="agent-state-text"><b>From System: </b>{{data.item.caller_ip}}</div>
          <div class="agent-state-text"><b>Called Number: </b>{{data.item.calling}}</div>
        </template>
      </b-table>
      <b-pagination size="sm" align="center" v-if="perPage > 0" :total-rows="totalRows" :per-page="perPage" v-model="currentPage" ></b-pagination>
      <b-btn class="pointer" size="sm" style="width:80px" variant="primary" @click="reload">Refresh</b-btn>
    </b-col>
  </b-row>
  </b-collapse>
</div>
</template>

<script>
import Player from '@/Recordings/Player'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
export default {
  name: 'records',
  storageName: 'callRecordings',
  widgetName: 'CALL RECORDINGS',
  components: {
    player: Player,
    Datepicker
  },
  data () {
    return {
      fields: {
        player: { label: 'Show Recordings', _showDetails: false, thClass:"table-header-text-center" },
        ts_ms: { label: 'Date / Start Time', sortable: true, thClass:"table-header-text-center", tdClass:"table-body-text-center", formatter: ts => new moment(ts, "x").format("YYYY-MM-DD HH:mm:ss") },
        client: { label: 'Customer', sortable: true, thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        queue: { label: 'Queue', sortable: true, thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        line: { label: 'Line', sortable: true, thClass:"table-header-text-center", tdClass:"table-body-text-center"},
        agent: { label: 'Agent', sortable: true, thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        skills: { label: 'Skills', sortable: true, thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        caller: { label: 'Recording', thClass:"table-header-text-center" },
      },
      recordings: [],
      recordings_outbound: [],
      clients: [],
      queues: [],
      line_ins: [],
      line_outs: [],
      tags: [],
      filter: null,
      filterState: null,
      currentPage: 1,
      perPage: 5,
      pageOptions: [
        {text:'All', value:0},
        {text:5,value:5},{text:10,value:10},{text:15,value:15}, {text:20,value:20}, {text:25,value:25}, {text:30,value:30}
      ],
      totalRows: 0,
      startDate: '',
      endDate: '',
      selectedCustomer: 'Any Customer',
      selectedQueue: 'Any Queue',
      selectedLine: 'Any Line In',
      selectedLineOut: 'Any Line Out',
      selectedSkill: 'Any Skill',
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
      Object.keys(this.$agent.vm.agent.permissions).forEach( (key) => {
        if (key.indexOf("-line_ins") !== -1) {
          let name = key.replace("-line_ins", "")
          this.line_ins.push({name: name})
        }
        else if (key.indexOf("-line_outs") !== -1) {
          let name = key.replace("-line_outs", "")
          this.line_outs.push({name: name})
        }
      })
      this.line_ins.unshift({ name:"Any Line In" })
      this.line_outs.unshift({ name:"Any Line Out" })
      this.queues = await this.$agent.p_mfa('ws_db_queue', 'get')
      this.queues.unshift({ name:"Any Queue" })
      this.tags = await this.$agent.p_mfa('ws_db_tag', 'get')
      this.tags.unshift("Any Skill")
      this.params.date_start = parseInt(this.startDate.getTime()/1000)
      this.params.date_end = parseInt(this.endDate.getTime()/1000)
      this.recordings = await this.$agent.p_mfa('ws_report', 'inqueues_sessions', [this.params])
      this.recordings_outbound = await this.$agent.p_mfa('ws_report', 'outgoing_sessions', [this.params])
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
      if (queues !== undefined) {
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
      let startDate = new Date(this.startDate)
      startDate.setHours(0,0,0,0)
      let endDate =new Date(this.endDate)
      endDate.setHours(23,59,59,9999)
      this.params.date_start = parseInt(startDate.getTime()/1000)
      this.params.date_end = parseInt(endDate.getTime()/1000)
      this.recordings = await this.$agent.p_mfa('ws_report', 'inqueues_sessions', [this.params])
      this.recordings_outbound = await this.$agent.p_mfa('ws_report', 'outgoing_sessions', [this.params])
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
    onFilterUpdate (event){
      if (event.match(/[^\w\s]/gi)) {
        this.filter = event.replace(/[^\w\s]/gi, '')
        this.filterState = false
      }
      else {
        this.filter = event
        this.filterState = null
      }
    },
  },
  created () {
    this.query()
    if (this.$agent.vm.storage_data.callRecordingsCollapsed !== undefined)
      this.showCollapse = this.$agent.vm.storage_data.callRecordingsCollapsed
    if (this.$agent.vm.storage_data.callRecordingsSortBy !== undefined)
      this.sortBy = this.$agent.vm.storage_data.callRecordingsSortBy
    if (this.$agent.vm.storage_data.callRecordingsSortDesc !== undefined)
      this.sortDesc = this.$agent.vm.storage_data.callRecordingsSortDesc
    if (this.$agent.vm.storage_data.callRecordingsPerPage !== undefined)
      this.perPage = this.$agent.vm.storage_data.callRecordingsPerPage
  },
  computed: {
    computedRecordings () {
      let recordings = this.recordings.slice(0)
      recordings.push(...this.recordings_outbound);
      let compRecordings = []
      recordings.forEach( (key) => {
        let actDate = new Date(key.ts_ms)
        let startDate = new Date(this.startDate)
        startDate.setHours(0,0,0,0)
        let endDate =new Date(this.endDate)
        endDate.setHours(23,59,59,9999)

        if(key.line_in) {
          key.line = key.line_in
          key.direction = 'inbound'
        }
        else if(key.line_out) {
          key.line = key.line_out
          key.direction = 'outbound'
        }
        if(!key.keep_record)
          return

        if(actDate.getTime() > endDate.getTime() || actDate.getTime() < startDate.getTime() )
          return

        if(key.client && this.selectedCustomer !== 'Any Customer') {
          if(this.selectedCustomer !== key.client.name && this.selectedCustomer !== 'Any Customer'){
            return
          }
        }

        if(key.queue && this.selectedQueue !== 'Any Queue') {
          if(this.selectedQueue !== key.queue.name && this.selectedQueue !== 'Any Queue'){
            return
          }
        }

        if(key.line_in) {
          let line_in_perm = this.line_ins.findIndex(E => E.name === key.line_in.name)
          if(this.selectedLine !== key.line_in.name && this.selectedLine !== 'Any Line In'){
            return
          }
          else if (line_in_perm < 0)
            return
        }

        if(key.line_out) {
          let line_outs_perm = this.line_outs.findIndex(E => E.name === key.line_out.name)
          if(this.selectedLineOut !== key.line_out.name && this.selectedLineOut !== 'Any Line Out'){
            return
          }
          else if (line_outs_perm < 0)
            return
        }

        if(key.skills && this.selectedSkill !== 'Any Skill') {
          let skills = Object.keys(key.skills)
          if(!skills.includes(this.selectedSkill)){
            return
          }
        }

        compRecordings.push(key);

      } )
      this.totalRows = compRecordings.length
      return compRecordings;
    }
  }
}
</script>
