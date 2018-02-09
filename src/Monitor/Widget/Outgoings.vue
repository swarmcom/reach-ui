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
            <option v-for="line in this.lines" :value=line.name>{{line.name}}</option>
          </b-form-select>
          <b-form-select class="pointer" size="sm" v-model="selectedCustomer" style="margin-top:10px">
            <option v-for="client in this.clients" :value=client.name>{{client.name}}</option>
          </b-form-select>
          <b-form-select class="pointer" size="sm" v-model="selectedState" style="margin-top:10px">
            <option v-for="state in this.states" :value=state.value>{{state.name}}</option>
          </b-form-select>
        </b-col>
        <b-col cols="12" md="12" lg="9" xl="10" style="min-width:700px">
          <b-table style="margin-top:10px" small bordered hover
                   :items="computedOutgoings"
                   :fields="fields"
                   :filter="filter">
            <template slot="actions" slot-scope="data">
              <b-row class="text-center">
                <b-col>
                  <b-dropdown size="sm" text="Select Action" variant="outline-secondary">
                    <b-dropdown-item @click="takeover(data.item)">Take over</b-dropdown-item>
                    <b-dropdown-item
                      v-if="data.item.state === 'oncall' && (!$agent.is_onsession() && !$agent.is_barge())"
                      @click="spy(data.item)">Monitor
                    </b-dropdown-item>
                    <b-dropdown-item @click="hangup(data.item)">Hangup</b-dropdown-item>
                  </b-dropdown>
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

  export default {
    name: 'outgoings',
    storageName: 'queueManagerOutgoings',
    widgetName: 'Outgoing Call View',
    mixins: [Common],
    data() {
      return {
        fields: {
          actions: {label: 'Actions', thClass: "table-header-text-center"},
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
        name: 'monitor/outgoings',
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
        showCollapse: true
      }
    },
    methods: {
      handleState({state}) {
        let i = this.outgoings.findIndex(E => E.id === state.id)
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
      takeover({record, uuid}) {
        this.$agent.p_mfa('ws_supervisor', 'takeover', [record, uuid])
      },
      spy({record, uuid}) {
        this.$agent.p_mfa('ws_supervisor', 'spy', [record, uuid])
      },
      hangup({id}) {
        this.$agent.p_mfa('ws_supervisor', 'hangup', ['outgoing', id])
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
    },
    created() {
      this.query()
      this.$agent.subscribe('outgoings')
      this.$bus.$on('outgoing_state', this.handleState)
      this.updater = setInterval(this.onTimer, 1000)
      if (this.$agent.vm.storage_data.queueManagerOutgoingsCollapsed !== undefined)
        this.showCollapse = this.$agent.vm.storage_data.queueManagerOutgoingsCollapsed
    },
    beforeDestroy() {
      this.$bus.$off('outgoing_state', this.handleState)
      clearInterval(this.updater)
    },
    computed: {
      computedOutgoings() {
        let outgoings = this.outgoings.slice(0)
        let compOutgoings = []
        outgoings.forEach((key) => {
          key._cellVariants = {
            actions: 'success',
            media: 'primary',
            state: 'primary',
            line: 'primary',
            timeInQueue: 'primary'
          }

          if (key.line) {
            if (this.selectedLine !== key.line && this.selectedLine !== 'Any Lines')
              return
          }
          else if (this.selectedLine !== 'Any Lines')
            return

          if (key.customer) {
            if (this.selectedCustomer !== key.customer.name && this.selectedCustomer !== 'Any Customers')
              return
          }
          else if (this.selectedCustomer !== 'Any Customers')
            return

          if (this.selectedState !== key.state && this.selectedState !== 'Any State')
            return

          compOutgoings.push(key)
        })
        return compOutgoings
      }
    }
  }
</script>