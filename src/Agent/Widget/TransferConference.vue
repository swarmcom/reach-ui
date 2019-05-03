<template>
  <div v-if="isVisible">
    <toggle-bar />
    <b-collapse
      id="collapseTransferConference"
      v-model="showCollapse"
      class="mt-2"
    >
      <b-row>
        <b-col cols="4">
          <b-form-select
            v-model="selected"
            class="pointer"
          >
            <option :value="null">
              Transfer / Conference
            </option>
            <option
              v-if="!this.$agent.is_conference ()"
              :value="'queue'"
            >
              Queue...
            </option>
            <option :value="'agent'">
              Agent...
            </option>
            <option
              v-if="can_call()"
              :value="'number'"
            >
              Number...
            </option>
          </b-form-select>
          <b-form-input
            v-if="selected==='agent'"
            v-model="filter"
            class="customInput"
            placeholder="Search..."
          />
        </b-col>
        <b-col
          v-if="(selected==='queue')"
          cols="4"
        >
          <b-form-select
            v-model="selectedQueue"
            class="pointer"
          >
            <option :value="null">
              Select Queue...
            </option>
            <option
              v-for="queue in queues"
              :key="queue.id"
              :value="queue.id"
            >
              {{ queue.name }}
            </option>
          </b-form-select>
        </b-col>
        <b-col
          v-if="(selected==='number')"
          cols="8"
        >
          <b-input-group>
            <b-form-input
              v-model="selectedNumber"
              type="text"
              list="tr-number-list-id"
              placeholder="enter a number..."
              @change="updateCacheNumber()"
            />
            <datalist id="tr-number-list-id">
              <option
                v-for="num in cachedNumber"
                :key="num"
              >
                {{ num }}
              </option>
            </datalist>
            <b-input-group-append>
              <b-dropdown
                v-if="lines.length > 0"
                text="Call as"
                variant="outline-secondary"
                right
              >
                <b-dropdown-item
                  v-for="line of lines"
                  :key="line.id"
                  @click="selectLine(line)"
                >
                  {{ line.name }}
                </b-dropdown-item>
              </b-dropdown>
              <b-btn
                v-if="$agent.vm.agent.line_id"
                variant="outline-secondary"
                @click="selectLine($agent.vm.agent.line)"
              >
                {{ $agent.vm.agent.line.name }}
              </b-btn>
            </b-input-group-append>
          </b-input-group>
          <div
            v-if="!selectedLine"
            style="color:#F2635F"
            class="agent-state-text"
          >
            Please select the line
          </div>
        </b-col>
        <b-col
          v-if="selected==='agent'"
          cols="8"
        >
          <b-table
            small
            bordered
            tbody-tr-class="pointer"
            :items="computedAgents"
            :fields="fieldsAgents"
            :filter="filter"
            @row-clicked="onSelectAgent"
          />
          <div
            v-if="!allowTransConf"
            style="color:#F2635F"
            class="agent-state-text"
          >
            Transfer or Conference only to the
            available agent is allowed
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-if="selected=='queue' && selectedQueue!==null"
          cols="9"
          order="3"
          style="margin-top:5px"
        >
          <queue-skills
            v-if="canTransConf(uuid)"
            :uuid="uuid"
          />
        </b-col>
      </b-row>
      <b-row style="margin-top:10px">
        <b-col>
          <button
            v-if="can_conference()"
            class="btn call-action-button"
            style="margin-left:5px; float:right"
            @click="conference()"
          >
            Conference
          </button>
          <button
            v-if="can_transfer()"
            class="btn call-action-button"
            style=" float:right"
            @click="transfer()"
          >
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
  name: 'SmTransferConference',
  components: {
    'queue-skills': QueueSkills,
  },
  mixins: [Common, Storage],
  props: {
    uuid: {
      type: String,
      default: ""
    },
    inqueueRecord: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showCollapse: true,
      allowTransConf: true,
      selected: null,
      fieldsAgents: {
        agent: {
          label: 'Name', 
          sortable: true, 
          thClass: "table-header-text-center", 
          tdClass: "table-body-text-center", 
          formatter: (value) => {
            return value.name
          }
        },
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
      agents: [],
      lines: [],
      selectedLine: null,
      cachedNumber: []
    }
  },
  computed: {
    computedAgents () {
      let self = this
      let agents_comp = this.agents.slice(0)
      this.agents.slice(0).forEach((key) => {
        key._rowVariant = 'primary'
        key.group = key.agent.group
        if (key.agent_id === self.selectedAgent) {
          if (key.state === 'available')
            key._rowVariant = 'warning'
          else
            self.selectedAgent = 'null'
        }
      })
      return agents_comp
    },
    isVisible () {
      if ( this.inqueue_record != 'inqueue_vm' && (this.$agent.is_onsession() || this.$agent.is_hold()) )
        return true
      else
        return false
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
  created: async function () {
    this.query()
    this.maybeInitLocal().loadLocal('showCollapse', 'cachedNumber')
  },
  beforeDestroy: async function () {
    this.$bus.$off('live_agent_state', this.handleState)
    await this.$agent.p_mfa('ws_live', 'unsubscribe', ['agents', 'group'])
  },
  methods: {
    query: async function () {
      this.queues = await this.$agent.p_mfa('ws_agent', 'get_transfer_queues')
      this.agents = await this.$agent.p_mfa('ws_live', 'agents', ['group'])
      this.lines = await this.$agent.p_mfa('ws_agent', 'lines_out')
      this.$bus.$on('live_agent_state', this.handleState)
      await this.$agent.p_mfa('ws_live', 'subscribe', ['agents', 'group'])
    },
    handleState ({tag, state}) {
      if (tag === 'ws_login') {
        let i = this.agents.findIndex(E => E.agent_id === state.agent_id)
        if (i >= 0) {
          this.agents.splice(i, 1, state)
        } else {
          this.agents.push(state)
        }
      }
      else if (state.state === 'terminate') {
        let i = this.agents.findIndex(E => E.agent_id === state.agent_id)
        if (i >= 0) {
          this.agents.splice(i, 1)
        }
      }
      else {
        let i = this.agents.findIndex(E => E.agent_id === state.agent_id)
        if (i >= 0) {
          this.agents.splice(i, 1, state)
        }
      }
    },
    conference () {
      if (this.selected === 'queue' && this.selectedQueue !== 'null') {
        this.$agent.conference_to_queue(this.selectedQueue)
      }
      else if (this.selected === 'agent' && this.selectedAgent !== 'null') {
        this.$agent.conference_to_agent(this.selectedAgent)
      }
      else if (this.selected === 'number' && this.selectedNumber !== 'null') {
        this.$agent.conference_to_uri(this.selectedNumber, this.selectedLine)
      }
    },
    transfer () {
      if (this.selected === 'queue' && this.selectedQueue !== 'null') {
        this.$agent.transfer_to_queue(this.selectedQueue)
      }
      else if (this.selected === 'agent' && this.selectedAgent !== 'null') {
        this.$agent.transfer_to_agent(this.selectedAgent)
      }
      else if (this.selected === 'number' && this.selectedNumber !== '') {
        this.$agent.transfer_to_uri(this.selectedNumber, this.selectedLine)
      }
    },
    onSelectAgent (data) {
      if (data.state === 'available') {
        this.selectedAgent === data.agent_id ? this.selectedAgent = 'null' : this.selectedAgent = data.agent_id
        this.allowTransConf = true
      }
      else {
        this.allowTransConf = false
      }
    },
    canTransConf (uuid) {
      return this.$agent.permAllowed('agent-feature-conference-change-skills') && uuid != ""
    },
    can_conference () {
      if (this.$agent.can_conference() &&
        ((this.selectedAgent !== 'null' && this.$agent.permAllowed('agent-feature-conference-agent')) ||
          (this.selectedQueue !== 'null' && this.$agent.permAllowed('agent-feature-conference-queue')) ||
          (this.selectedNumber !== '' && this.selectedLine) && this.$agent.permAllowed('agent-feature-conference-number'))) {
        return true
      }
      else {
        return false
      }
    },
    can_transfer () {
      if (this.$agent.can_transfer() &&
        ((this.selectedAgent !== 'null' && this.$agent.permAllowed('agent-feature-transfer-agent')) ||
          (this.selectedQueue !== 'null' && this.$agent.permAllowed('agent-feature-transfer-queue')) ||
          (this.selectedNumber !== '' && this.selectedLine) && this.$agent.permAllowed('agent-feature-transfer-number'))) {
        return true
      }
      else {
        return false
      }
    },
    can_call () {
      return (this.lines.length > 0 || this.$agent.vm.agent.line_id)
    },
    selectLine (line) {
      if (this.selectedLine === line.id) {
        this.selectedLine = null
      }
      else {
        this.selectedLine = line.id
      }
    },
    updateCacheNumber () {
      let found = this.cachedNumber.find((element) => element === this.selectedNumber)
      if (!found) {
        this.cachedNumber.push(this.selectedNumber)
        this.saveLocal('cachedNumber').writeLocal()
      }
    }
  }
}
</script>
