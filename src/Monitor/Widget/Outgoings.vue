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
          <b-form-select class="pointer" size="sm" v-model="selectedLine" style="margin-top:10px">
            <option v-for="line in this.lines" :value=line.name :key=line.name>{{line.name}}</option>
          </b-form-select>
          <b-form-select class="pointer" size="sm" v-model="selectedCustomer" style="margin-top:10px">
            <option v-for="client in this.clients" :value=client.name :key="client.name">{{client.name}}</option>
          </b-form-select>
          <b-form-select class="pointer" size="sm" v-model="selectedState" style="margin-top:10px">
            <option v-for="state in this.states" :value=state.value :key=state.value>{{state.name}}</option>
          </b-form-select>
        </b-col>
        <b-col cols="12" md="12" lg="9" xl="10" style="min-width:700px">
          <b-table style="margin-top:10px" small bordered hover
                   :items="computedOutgoings"
                   :fields="fields"
                   :filter="filter"
                   :sort-by="sortBy"
                   :sort-desc="sortDesc"
                   @sort-changed="onSortingChanged">
            <template slot="row-details" slot-scope="data">
              <b-row>
                <b-col>
                  <b-badge variant="warning" class="pointer" v-if="allowMonitor(data.item.state)" @click="spy(data.item)">Monitor</b-badge>
                  <b-badge variant="danger" class="pointer" @click="hangup(data.item)">Hangup</b-badge>
                </b-col>
              </b-row>
            </template>
            <template slot="media" slot-scope="data">
              <b-row>
                <b-col cols="1" v-if="data.item.record === 'outgoing_call'">
                  <icon name="mobile" scale="2" class='agent-state-color'/>
                </b-col>
                <b-col cols="1">
                  <b-img v-if="data.item.customer.avatar" :src="$agent.avatar_uri(data.item.customer.avatar)"
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
                <b-col v-if="data.item.state === 'oncall'">
                  Connected
                </b-col>
                <b-col v-if="data.item.state === 'ringing'">
                  Ringing
                </b-col>
                <b-col v-if="data.item.state === 'init'">
                  Init
                </b-col>
              </b-row>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-collapse>
  </div>
</template>

<script>
import Common from '@/Admin/Common'
import Storage from '@/Storage'

export default {
  name: 'queue-manager-outgoings',
  widgetName: 'Outgoing Call View',
  mixins: [Common, Storage],
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
        timeInQueue: {
          label: 'T in State',
          sortable: true,
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        },
      },
      outgoings: [],
      lines: [],
      clients: [],
      states: [
        {name: "Any State", value: "Any State"},
        {name: "Connected", value: "oncall"},
        {name: "Ringing", value: "ringing"},
        {name: "Init", value: "init"}
      ],
      updater: null,
      selectedLine: 'Any Lines',
      selectedCustomer: 'Any Customers',
      selectedState: 'Any State',
      filter: null,
      filterState: null,
      sortBy: 'agent_id',
      sortDesc: false,
      showCollapse: true
    }
  },
  methods: {
    handleState({state}) {
      let i = this.outgoings.findIndex(E => E.uuid === state.uuid)
      if (i >= 0) {
        if (state.state === 'terminate') {
          this.outgoings.splice(i, 1)
        } else {
          this.outgoings.splice(i, 1, this.enrich_queue(state))
        }
      } else {
        this.outgoings.push(this.enrich_queue(state))
      }
    },
    enrich_queue(state) {
      state.time = Math.round(state.time / 1000)
      state.date = new Date()
      state.line = state.line_out.name
      state.customer = state.line_out.client
      return state
    },
    query: async function () {
      this.outgoings = await this.$agent.p_mfa('ws_agent', 'outgoings')
      this.outgoings.forEach((inq) => {
        inq.date = new Date() - inq.time
        inq.time = Math.round(inq.time / 1000)
        inq.line = inq.line_out.name
        inq.customer = inq.line_out.client
      })
      this.lines = await this.$agent.p_mfa('ws_agent', 'lines_out')
      this.lines.unshift({name: "Any Lines"})
      this.clients = await this.$agent.p_mfa('ws_agent', 'clients')
      this.clients.unshift({name: "Any Customers"})
    },
    onTimer() {
      this.outgoings.forEach((E, i, Arr) => {
        E.time = E.time + 1
        E.timeInQueue = this.msToHms((new Date() - E.date).toString())
        Arr.splice(i, 1, E)
      })
    },
    allowMonitor(state) {
      return (this.$agent.permAllowed('monitor-feature')) && (state === 'oncall') &&
        (!this.$agent.is_onsession() && !this.$agent.is_barge())
    },
    takeover({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'takeover', [record, uuid])
    },
    spy({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'spy', [record, uuid])
    },
    hangup({uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'hangup', ['outgoing', uuid])
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
    onSortingChanged(ctx) {
      this.sortBy = ctx.sortBy
      this.sortDesc = ctx.sortDesc
      this.saveDataStorage()
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
    this.$agent.subscribe('outgoings')
    this.$bus.$on('outgoing_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
    this.maybeInitLocal().loadDataStorage()
  },
  beforeDestroy() {
    this.$bus.$off('outgoing_state', this.handleState)
    clearInterval(this.updater)
  },
  watch: {
    showCollapse: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveLocal('showCollapse').writeLocal()
      }
    },
  },
  computed: {
    computedOutgoings() {
      let outgoings = this.outgoings.slice(0)
      let compOutgoings = []
      outgoings.forEach((key) => {
        key._showDetails = true
        key._cellVariants = {
          actions: 'success',
          media: 'primary',
          state: 'primary',
          line: 'primary',
          timeInQueue: 'primary'
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

        compOutgoings.push(key)
      })
      return compOutgoings
    }
  }
}
</script>
