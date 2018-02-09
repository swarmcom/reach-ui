<template>
<div v-if="this.$agent.is_onsession() || this.$agent.is_hold() ">
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseTransferConference" class="mt-2">
    <b-row>
      <b-col cols="4">
        <b-form-select class="pointer" v-model="selected">
          <option :value="null">Transfer / Conference</option>
          <option v-if="!this.$agent.is_conference ()" :value="'queue'">Queue...</option>
          <option :value="'agent'">Agent...</option>
          <option v-if="this.$agent.can_call()" :value="'number'">Number...</option>
        </b-form-select>
        <b-form-input class="customInput" v-if="selected==='agent'" v-model="filter" placeholder="Search..."/>
      </b-col>
      <b-col cols="4" v-if="(selected==='queue' || selected==='number')">
        <b-form-select class="pointer" v-if="selected==='queue'" v-model="selectedQueue">
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
        <div v-if="!allowTransConf" style="color:#F2635F" class="agent-state-text">Transfer or Conference only to the
          available agent is allowed
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="9" order="3" style="margin-top:5px" v-if="selected=='queue' && selectedQueue!==null">
        <queue-skills v-access:transConfChangeSkills-feature v-if="uuid!==undefined" :uuid="uuid"></queue-skills>
      </b-col>
    </b-row>
    <b-row style="margin-top:10px">
      <b-col>
        <button v-if="this.can_conference()" class="btn call-action-button" @click="conference()"
                style="margin-left:5px; float:right">Conference
        </button>
        <button v-if="this.can_transfer()" class="btn call-action-button" @click="transfer()" style=" float:right">
          Transfer
        </button>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
import Common from '../../Admin/Common'
import QueueSkills from '@/Agent/Inqueue/Skills'
import Storage from '@/Storage'

export default {
  widgetName: 'Transfer / Conference',
  name: 'sm-transfer-conference',
  components: {
    'queue-skills': QueueSkills,
  },
  mixins: [Common, Storage],
  props: {
    uuid: String
  },
  data() {
    return {
      showCollapse: true,
      allowTransConf: true,
      selected: null,
      fieldsAgents: {
        name: {label: 'Name', sortable: true, thClass: "table-header-text-center", tdClass: "table-body-text-center"},
        group: {
          label: 'Group',
          sortable: true,
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center",
          formatter: (value) => {
            return value.name
          }
        },
        state: {
          label: 'State',
          sortable: true,
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        }
      },
      selectedQueue: 'null',
      selectedAgent: 'null',
      selectedNumber: '',
      filter: null,
      queues: [],
    }
  },
  methods: {
    query: async function () {
      this.queues = await this.$agent.p_mfa('ws_agent', 'get_transfer_queues')
    },
    conference() {
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
    transfer() {
      if (this.selected === 'queue' && this.selectedQueue !== 'null') {
        this.$agent.transfer_to_queue(this.selectedQueue)
      }
      else if (this.selected === 'agent' && this.selectedAgent !== 'null') {
        this.$agent.transfer_to_agent(this.selectedAgent)
      }
      else if (this.selected === 'number' && this.selectedNumber !== '') {
        this.$agent.transfer_to_uri(this.selectedNumber)
      }
    },
    onSelectAgent(data) {
      if (data.state === 'available') {
        this.selectedAgent === data.id ? this.selectedAgent = 'null' : this.selectedAgent = data.id
        this.allowTransConf = true
      }
      else {
        this.allowTransConf = false
      }
    },
    can_conference() {
      if (this.$agent.can_conference() &&
        ((this.selectedAgent !== 'null' && this.$agent.vm.agent.permissions['confAgent-feature']) ||
          (this.selectedQueue !== 'null' && this.$agent.vm.agent.permissions['confQueue-feature']) ||
          (this.selectedNumber !== '') && this.$agent.vm.agent.permissions['confNumber-feature'])) {
        return true
      }
      else
        return false
    },
    can_transfer() {
      if (this.$agent.can_transfer() &&
        ((this.selectedAgent !== 'null' && this.$agent.vm.agent.permissions['transAgent-feature']) ||
          (this.selectedQueue !== 'null' && this.$agent.vm.agent.permissions['transQueue-feature']) ||
          (this.selectedNumber !== '') && this.$agent.vm.agent.permissions['transNumber-feature'])) {
        return true
      }
      else
        return false
    }
  },
  computed: {
    computedAgents() {
      let agents = this.$agent.vm.transfer_agents.slice(0)
      agents.forEach((key) => {
        key._rowVariant = 'primary'
        if (key.id === this.selectedAgent) {
          if (key.state === 'available')
            key._rowVariant = 'warning'
          else
            this.selectedAgent = 'null'
        }
      })
      return agents
    }
  },
  watch: {
    selected: function (val) {
      this.selectedAgent = 'null'
      this.selectedQueue = 'null'
      this.selectedNumber = ''
    },
    showCollapse: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveLocal('showCollapse').writeLocal()
      }
    }
  },
  created() {
    this.a = this.$agent.getData()
    this.query()
    this.maybeInitLocal().loadLocal('showCollapse')
  }
}
</script>
