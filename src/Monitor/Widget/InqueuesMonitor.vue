<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"/>
  <b-collapse v-model="showCollapse" id="collapseQueueManagerCallView" class="mt-2">
    <b-row class="row">
      <b-col cols="12" md="12" lg="3" xl="2">
        <b-row class="toggle-bar-custom">
          <div class="titlenocollapse">Filter</div>
        </b-row>
        <b-form-input class="customInput" size="sm" :value="filter" v-on:input="onFilterUpdate" :state="filterState"
                      placeholder="Search..." style="margin-top:10px"></b-form-input>
        <b-form-select class="pointer" size="sm" v-model="selectedMedia" style="margin-top:10px">
          <option v-for="media in this.medias" :value=media.value :key=media.name>{{media.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedQueue" style="margin-top:10px">
          <option v-for="queue in this.queues" :value=queue.name :key="queue.name">{{queue.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedLine" style="margin-top:10px">
          <option v-for="line in this.lines" :value=line.name :key="line.name">{{line.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedCustomer" style="margin-top:10px">
          <option v-for="client in this.clients" :value=client.name :key="client.name">{{client.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedState" style="margin-top:10px">
          <option v-for="state in this.states" :value=state.value :key="state.name">{{state.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedSkill" style="margin-top:10px">
          <option v-for="skill in this.tags" :value=skill :key="skill">{{skill}}</option>
        </b-form-select>
      </b-col>
      <b-col cols="12" md="12" lg="9" xl="10" style="min-width:700px">
        <b-table style="margin-top:10px" small bordered hover
                 :items="computedInqueues"
                 :fields="fields"
                 :filter="filter"
                 :sort-by="sortBy"
                 :sort-desc="sortDesc"
                 @sort-changed="onSortingChanged">
          <template slot="row-details" slot-scope="data">
            <b-row>
              <b-col>
                <b-badge variant="warning" class="pointer" v-if="allowTake(data.item.state)" size="sm" @click="take(data.item)">
                  Take
                </b-badge>
                <b-badge variant="warning" class="pointer" v-if="allowMonitor(data.item.state)" size="sm" @click="spy(data.item)">
                  Monitor
                </b-badge>
                <b-badge variant="danger" class="pointer" v-if="$agent.permAllowed('supervisor-feature-hangup-call-queue')" size="sm" @click="hangup(data.item)">
                  Hangup
                </b-badge>
              </b-col>
            </b-row>
          </template>
          <template slot="media" slot-scope="data">
            <b-row>
              <b-col cols="1">
                <icon v-if="data.item.record == 'inqueue_call'" name="mobile" scale="2" class='agent-state-color'/>
                <icon v-if="data.item.record == 'inqueue_vm'" name="file-audio-o" scale="2" class='agent-state-color'/>
              </b-col>
              <b-col cols="1">
                <b-img v-if="data.item.customer && data.item.customer.avatar" :src="$agent.avatar_uri(data.item.customer.avatar)"
                       style="width:32px;"></b-img>
                <icon v-else name="handshake-o" scale="2"/>
              </b-col>
              <b-col>
                {{data.item.customer.name}}
              </b-col>
            </b-row>
          </template>
          <template slot="state" slot-scope="data">
            <b-row>
              <b-col v-if="data.item.state === 'inqueue'">
                In Queue
              </b-col>
              <b-col v-if="data.item.state === 'oncall'">
                Connected
              </b-col>
              <b-col v-if="data.item.state === 'voicemail'">
                Voicemail
              </b-col>
              <b-col v-if="data.item.state === 'agent'">
                Ringing
              </b-col>
              <b-col v-if="data.item.state === 'wrapup'">
                Wrap-up
              </b-col>
            </b-row>
          </template>
          <template slot="skillsReq" slot-scope="data">
            <b-row v-if="data.item.skillsReq ==='_agent'">
              <b-col v-if="data.item.skills._agent.avatar" cols="1">
                <b-img :src="$agent.avatar_uri(data.item.skills._agent.avatar)"
                       style="width:32px;"></b-img>
              </b-col>
              <b-col>
                <b-row>
                  <b-col>
                    name: {{data.item.skills._agent.name}}
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    login: {{data.item.skills._agent.login}}
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row v-else>
              {{data.item.skillsReq}}
            </b-row>
          </template>
        </b-table>
        <b-row class="row">
          <b-badge variant="warning" class="pointer" v-if="canSpy()" size="sm" @click="cancelSpy()">
            Stop Monitor
          </b-badge>
          <b-badge style="margin-left:5px" class="pointer" v-if="canSpy()" size="sm" @click="setMode('spy')">
            Spy
          </b-badge>
          <b-badge style="margin-left:5px" class="pointer" v-if="canBarge()" size="sm" @click="setMode('barge')">
            Barge
          </b-badge>
          <b-badge style="margin-left:5px" class="pointer" v-if="canWhisper()" size="sm" @click="setMode('agent')">
            Whisper
          </b-badge>
        </b-row>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
import Storage from '@/Storage'

export default {
  name: 'queue-manager-monitor',
  widgetName: 'Call View',
  mixins: [Storage],
  props: {
    inqueues: Array
  },
  data() {
    return {
      fields: {
        media: {label: 'Media / Customer', thClass: "table-header-text-center", tdClass: "table-body-text-center"},
        state: {
          label: 'State',
          sortable: true,
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        },
        line: {label: 'Line', sortable: true, thClass: "table-header-text-center", tdClass: "table-body-text-center"},
        queue: {
          label: 'Queue',
          sortable: true,
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        },
        skillsReq: {
          label: 'Skills Req',
          sortable: true,
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        },
        timeInQueue: {
          label: 'T in State',
          sortable: true,
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        }
      },
      clients: [],
      queues: [],
      lines: [],
      tags: [],
      states: [
        {name: "Any State", value: "Any State"},
        {name: "Connected", value: "oncall"},
        {name: "Voicemail", value: "voicemail"},
        {name: "In Queue", value: "inqueue"},
        {name: "Ringing", value: "agent"},
        {name: "Wrap-up", value: "wrapup"}
      ],
      medias: [
        {name: "Any Media", value: "Any Media"},
        {name: "Voice Calls", value: "inqueue_call"},
        {name: "Voicemails", value: "inqueue_vm"}
      ],
      selectedQueue: 'Any Queue',
      selectedCustomer: 'Any Customers',
      selectedLine: 'Any Lines',
      selectedState: 'Any State',
      selectedSkill: 'Any Skill',
      selectedMedia: 'Any Media',
      filter: null,
      filterState: null,
      sortBy: 'agent_id',
      sortDesc: false,
      showCollapse: true
    }
  },
  methods: {
    query: async function () {
      this.clients = await this.$agent.p_mfa('ws_agent', 'clients')
      this.clients.unshift({name: "Any Customers"})
      this.queues = await this.$agent.p_mfa('ws_agent', 'queues')
      this.queues.unshift({name: "Any Queue"})
      this.lines = await this.$agent.p_mfa('ws_agent', 'lines_in')
      this.lines.unshift({name: "Any Lines"})
      this.tags = await this.$agent.p_mfa('ws_agent', 'tags')
      this.tags.unshift("Any Skill")
    },
    onSortingChanged(ctx) {
      this.sortBy = ctx.sortBy
      this.sortDesc = ctx.sortDesc
      this.saveDataStorage()
    },
    allowTake(state) {
      return (this.$agent.permAllowed('supervisor-feature-take-call-queue') &&
        (state === 'inqueue' || state === 'agent'))
    },
    allowMonitor(state) {
      return (this.$agent.permAllowed('supervisor-feature-monitor') &&
        state === 'oncall' && !this.$agent.is_onsession() && !this.$agent.is_barge())
    },
    take({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'take', [record, uuid])
    },
    takeover({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'takeover', [record, uuid])
    },
    spy({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'spy', [record, uuid])
    },
    hangup({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'hangup', [record, uuid])
    },
    canSpy() {
      return (this.$agent.permAllowed('supervisor-feature-monitor') &&
        this.$agent.is_barge())
    },
    canBarge() {
      return (this.$agent.permAllowed('supervisor-feature-barge') &&
        this.$agent.is_barge())
    },
    canWhisper() {
      return (this.$agent.permAllowed('supervisor-feature-whisper') &&
        this.$agent.is_barge())
    },
    cancelSpy() {
      this.$agent.mfa('ws_supervisor', 'cancel', [])
    },
    setMode(mode) {
      this.$agent.mfa('ws_supervisor', 'set_barge_mode', [mode])
    },
    onFilterUpdate(event) {
      if (event.match(/[^\w\s]/gi)) {
        this.filter = event.replace(/[^\w\s]/gi, '')
        this.filterState = false
      }
      else {
        this.filter = event
        this.filterState = null
      }
    },
    loadDataStorage() {
      this.loadLocal('sortBy', 'sortDesc', 'showCollapse')
    },
    saveDataStorage() {
      this.saveLocal('sortBy', 'sortDesc').writeLocal()
    }
  },
  created() {
    this.query()
    this.maybeInitLocal().loadDataStorage()
  },
  watch: {
    showCollapse: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveLocal('showCollapse').writeLocal()
      }
    },
  },
  computed: {
    computedInqueues() {
      let inqueues = this.inqueues.slice(0)
      let compInqueues = []
      inqueues.forEach((key) => {
        key._showDetails = true
        key._cellVariants = {
          media: 'primary',
          state: 'primary',
          line: 'primary',
          queue: 'primary',
          skillsReq: 'primary',
          timeInQueue: 'primary'
        }
        if (key.queue) {
          if ((this.selectedQueue !== key.queue && this.selectedQueue !== 'Any Queue') || this.queues.length < 2) {
            return
          }
        }

        let queue_perm = this.queues.findIndex(E => E.name === key.queue)
        if (this.selectedQueue === 'Any Queue' && queue_perm < 0) {
          return
        }

        if (key.line) {
          if (this.selectedLine !== key.line && this.selectedLine !== 'Any Lines') {
            return
          }
        }
        else if (this.selectedLine !== 'Any Lines') {
          return
        }
        if (key.customer) {
          if (this.selectedCustomer !== key.customer.name && this.selectedCustomer !== 'Any Customers') {
            return
          }
        }
        else if (this.selectedCustomer !== 'Any Customers') {
          return
        }
        if (this.selectedState !== key.state && this.selectedState !== 'Any State') {
          return
        }
        if (this.selectedMedia !== key.record && this.selectedMedia !== 'Any Media') {
          return
        }
        if (key.skillsReq !== undefined && this.selectedSkill !== 'Any Skill') {
          let skills = key.skillsReq.split(",")
          if (!skills.includes(this.selectedSkill)) {
            return
          }
        }

        compInqueues.push(key)
      })
      return compInqueues
    }
  }
}
</script>
