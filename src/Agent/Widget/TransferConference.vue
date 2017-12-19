<template>
<div v-if="this.$agent.is_oncall() || this.$agent.is_hold()">
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseTransferConference" class="mt-2">
    <b-row>
      <b-col cols="4">
        <b-form-select v-model="selected">
        <option :value="null">Transfer / Conference</option>
        <option :value="'queue'">Queue...</option>
        <option :value="'agent'">Agent...</option>
        <option v-if="this.$agent.can_call()" :value="'number'">Number...</option>
        </b-form-select>
        <b-form-input class="customInput" v-if="selected==='agent'" v-model="filter" placeholder="Search..." />
      </b-col>
      <b-col cols="4" v-if="(selected==='queue' || selected==='number')">
        <b-form-select v-if="selected==='queue'" v-model="selectedQueue">
          <option :value="null">Select Queue...</option>
          <option v-for="queue in queues" :key="queue.id" :value="queue.id">{{queue.name}}</option>
        </b-form-select>
        <b-form-input class="customInput" v-if="selected==='number'" v-model="selectedNumber" type="text">
        </b-form-input>
      </b-col>
      <b-col cols="8" v-if="selected==='agent'">
        <b-table small bordered
          tbody-tr-class="pointer"
          @row-clicked="onSelectAgent"
          :items="computedAgents"
          :fields="fieldsAgents"
          :filter="filter">
        </b-table>
      </b-col>
    </b-row>
    <b-row>
    <b-col cols="9" order="3" style="margin-top:5px" v-if="selected=='queue' && selectedQueue">
      <queue-skills v-if="uuid!==undefined" :uuid="uuid"></queue-skills>
    </b-col>
    </b-row>
    <b-row style="margin-top:10px">
      <b-col>
        <button v-if="this.$agent.can_conference()" class="btn call-action-button" @click="conference()" style="margin-left:5px; float:right">Conference</button>
        <button v-if="this.$agent.can_transfer()" class="btn call-action-button" @click="transfer()" style=" float:right">Transfer</button>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
import Common from '../../Admin/Common'
import QueueSkills from '@/Agent/Inqueue/Skills'
export default {
  widgetName: 'Transfer / Conference',
  storageName: 'smtransferConference',
  components: {
    'queue-skills': QueueSkills,
  },
  mixins: [Common],
  props: {
    uuid: String
  },
  data () {
    return {
      showCollapse: true,
      selected: null,
      fieldsAgents: {
        name: { label: 'Name', sortable: true, thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        group: { label: 'Group', sortable: true, thClass:"table-header-text-center", tdClass:"table-body-text-center", formatter: (value) => { return value.name } },
        state: { label: 'State', sortable: true, thClass:"table-header-text-center", tdClass:"table-body-text-center" }
      },
      selectedQueue: 'null',
      selectedAgent: 'null',
      selectedNumber: 'null',
      filter: null,
      queues: [],
    }
  },
  methods: {
    query: async function () {
      this.queues = await this.$agent.p_mfa('ws_agent', 'get_transfer_queues')
    },
    conference () {
      if (this.selected === 'queue' && this.selectedQueue !== 'null') {
        this.$agent.conference_to_queue(this.selectedQueue)
      }
      else if (this.selected === 'agent' && this.selectedAgent !== 'null') {
        this.$agent.conference_to_agent(this.selectedAgent)
      }
      else if (this.selected === 'number' && this.selectedNumber !== 'null') {
        this.$agent.conference_to_uri(this.selectedNumber)
      }
    },
    transfer () {
      if (this.selected === 'queue' && this.selectedQueue !== 'null') {
        this.$agent.transfer_to_queue(this.selectedQueue)
      }
      else if (this.selected === 'agent' && this.selectedAgent !== 'null') {
        this.$agent.transfer_to_agent(this.selectedAgent)
      }
      else if (this.selected === 'number' && this.selectedNumber !== 'null') {
        this.$agent.transfer_to_uri(this.selectedNumber)
      }
    },
    onSelectAgent (data) {
      this.selectedAgent === data.id ? this.selectedAgent = 'null' : this.selectedAgent = data.id
    },
  },
  computed: {
    computedAgents () {
      let agents = this.$agent.vm.transfer_agents.slice(0)
      agents.forEach( (key) => {
        key._rowVariant = 'primary'
        if (key.id === this.selectedAgent)
          key._rowVariant = 'warning'
      })
      return agents
    }
  },
  watch: {
    selected: function(val) {
      this.selectedAgent = 'null'
      this.selectedQueue = 'null'
      this.selectedNumber = 'null'
    }
  },
  created () {
    this.a = this.$agent.getData()
    this.query()
    if (this.a.storage_data.smtransferConferenceCollapsed !== undefined)
      this.showCollapse = this.a.storage_data.smtransferConferenceCollapsed
  }
}
</script>
