<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentManager" class="mt-2">
  <div class="row">
    <div class="col-2">
      <div class="row toggle-bar-custom">
        <div class="title">Filter</div>
      </div>
      <b-form-input size="sm" v-model="filter" placeholder="Search..." style="margin-top:10px" />
      <div class="agent-state-text" style="margin-top:10px">Start Date:</div>
      <date-picker size="sm" v-model="startDate" :config="config"></date-picker>
      <div class="agent-state-text" style="margin-top:10px">End Date:</div>
      <date-picker size="sm" v-model="endDate" :config="config"></date-picker>
      <div class="agent-state-text" style="margin-top:10px">Line:</div>
      <b-form-select size="sm" v-model="selectedLine">
        <option v-for="line in this.line_ins" :value=line.name>{{line.name}}</option>
      </b-form-select>
      <div class="agent-state-text" style="margin-top:10px">Customer:</div>
      <b-form-select size="sm" v-model="selectedCustomer">
        <option v-for="client in this.clients" :value=client.name>{{client.name}}</option>
      </b-form-select>
    </div>
    <div class="col-10">
      <b-table style="margin-top:10px" small striped hover :items="computedRecordings" :fields="fields" :filter="filter">
        <template slot="player" slot-scope="data">
          <player v-if="data.item.keep_record == false" :href="data.item.call_record_path"></player>
        </template>
        <template slot="line_in" slot-scope="data">
          {{ data.item.line_in.name }}
        </template>
        <template slot="client" slot-scope="data">
          {{ data.item.line_in.client.name }}
        </template>
        <template slot="agent" slot-scope="data">
          {{ maybe_name(data.item.agent) }}
        </template>
        <template slot="caller_id" slot-scope="data">
          "{{ data.item.vars['Caller-Caller-ID-Name'] }}" &lt;{{ data.item.vars['Caller-Caller-ID-Number'] }}&gt;
        </template>
        <template slot="called_id" slot-scope="data">
          {{ data.item.vars['Caller-Destination-Number'] }}
        </template>
        <template slot="state_inqueue" slot-scope="data">
          {{ format_ms(data.item.states.inqueue) }}
        </template>
        <template slot="state_agent" slot-scope="data">
          {{ format_ms(data.item.states.agent) }}
        </template>
        <template slot="state_oncall" slot-scope="data">
          {{ format_ms(data.item.states.oncall) }}
        </template>
      </b-table>
    </div>
  </div>
  </b-collapse>
</div>
</template>

<script>
import Player from '../Stats/Player'
import 'bootstrap/dist/css/bootstrap.css';
import datePicker from 'vue-bootstrap-datetimepicker';
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css';
export default {
  name: 'recordings',
  storageName: 'callRecordings',
  widgetName: 'CALL RECORDINGS',
  components: {
    player: Player,
    'date-picker': datePicker
  },
  data () {
    return {
      fields: {
        player: { label: ' ' },
        ts: { label: 'Date / Start Time', sortable: true, formatter: (ts) => (new Date(ts)).toLocaleString() },
        client: { label: 'Customer', sortable: true },
        line_in: { label: 'Line In', sortable: true },
        agent: { label: 'Agent', sortable: true },
        caller_id: { label: 'Caller ID' },
        called_id: { label: 'Called ID' },
        state_inqueue: { label: 'Inqueue' },
        state_agent: { label: 'Agent' },
        state_oncall: { label: 'Oncall' }
      },
      inqueues: [],
      clients: [],
      line_ins: [],
      filter: null,
      startDate: '',
      endDate: '',
      config: {
        format: 'MM/DD/YYYY',
        useCurrent: false
      },
      selectedCustomer: 'Any Customer',
      selectedLine: 'Any Line',
      showCollapse: true
    }
  },
  methods: {
    query: async function() {
      this.startDate = new Date()
      this.startDate.setDate(this.startDate.getDate() - 1)
      this.endDate = new Date()
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
      this.clients.unshift({ name:"Any Customer" })
      this.line_ins = await this.$agent.p_mfa('ws_db_line_in', 'get')
      this.line_ins.unshift({ name:"Any Line" })
      let raw = await this.$agent.p_mfa('ws_stats', 'inqueue', [])
      this.inqueues = raw.map( (re) => re._source )
      console.log(this.inqueues[0].line_in)
      console.log(this.inqueues[0].vars)
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
    }
  },
  created () {
    this.query()
  },
  computed: {
    computedRecordings () {
      let agents = this.inqueues
      let compRecordings = []
      agents.forEach( (key) => {
        compRecordings.push(key);

        let actDate = new Date(key.ts)
        let startDate =new Date(this.startDate)
        let endDate =new Date(this.endDate)

        if(actDate.getTime() > endDate.getTime() || actDate.getTime() < startDate.getTime() )
          compRecordings.pop(key)

        if(key.line_in.client != undefined) {
          if(this.selectedCustomer != key.line_in.client.name && this.selectedCustomer != 'Any Customer'){
            compRecordings.pop(key)
          }
        }
        else if(this.selectedCustomer != 'Any Customer'){
          compRecordings.pop(key)
        }

        if(key.line_in != undefined) {
          if(this.selectedLine != key.line_in.name && this.selectedLine != 'Any Line'){
            compRecordings.pop(key)
          }
        }
        else if(this.selectedLine != 'Any Line'){
          compRecordings.pop(key)
        }

      } )
      return compRecordings;
    }
  }
}
</script>
