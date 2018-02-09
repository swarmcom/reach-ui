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
          <option v-for="media in this.medias" :value=media.value>{{media.name}}</option>
        </b-form-select>
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
          <option v-for="state in this.states" :value=state.value>{{state.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedSkill" style="margin-top:10px">
          <option v-for="skill in this.tags" :value=skill>{{skill}}</option>
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
          <template slot="actions" slot-scope="data">
            <b-row class="text-center">
              <b-col>
                <b-dropdown size="sm" text="Select Action" variant="outline-secondary">
                  <b-dropdown-item v-access:takeCallQueue-feature
                                   v-if="data.item.state === 'inqueue' || data.item.state === 'agent'"
                                   @click="take(data.item)">Take
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="data.item.state === 'oncall' && (!$agent.is_onsession() && !$agent.is_barge())"
                    @click="spy(data.item)">Monitor
                  </b-dropdown-item>
                  <b-dropdown-item v-access:hangupCallQueue-feature @click="hangup(data.item)">Hangup
                  </b-dropdown-item>
                </b-dropdown>
              </b-col>
            </b-row>
          </template>
          <template slot="media" slot-scope="data">
            <b-row>
              <b-col cols="1" v-if="data.item.record === 'inqueue_call'">
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
              <b-col v-if="data.item.state === 'inqueue'">
                In Queue
              </b-col>
              <b-col v-if="data.item.state === 'oncall'">
                Connected
              </b-col>
              <b-col v-if="data.item.state === 'agent'">
                Ringing
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
export default {
  name: 'monitor-queues-manager',
  storageName: 'queueManagerMonitor',
  widgetName: 'Call View',
  props: {
    inqueues: Array
  },
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
        {name: "In Queue", value: "inqueue"},
        {name: "Ringing", value: "agent"}
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
      this.$agent.vm.storage_data[this.$options.storageName + 'SortBy'] = ctx.sortBy
      this.$agent.vm.storage_data[this.$options.storageName + 'SortDesc'] = ctx.sortDesc
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
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
    if (this.$agent.vm.storage_data.queueManagerMonitorCollapsed !== undefined)
      this.showCollapse = this.$agent.vm.storage_data.queueManagerMonitorCollapsed
    if (this.$agent.vm.storage_data.queueManagerMonitorSortBy !== undefined)
      this.sortBy = this.$agent.vm.storage_data.queueManagerMonitorSortBy
    if (this.$agent.vm.storage_data.queueManagerMonitorSortDesc !== undefined)
      this.sortDesc = this.$agent.vm.storage_data.queueManagerMonitorSortDesc
  },
  computed: {
    computedInqueues() {
      let inqueues = this.inqueues.slice(0)
      let compInqueues = []
      inqueues.forEach((key) => {
        key._cellVariants = {
          actions: 'success',
          media: 'primary',
          state: 'primary',
          line: 'primary',
          queue: 'primary',
          skillsReq: 'primary',
          timeInQueue: 'primary'
        }
        if (key.queue) {
          if ((this.selectedQueue !== key.queue && this.selectedQueue !== 'Any Queue') || this.queues.length < 2)
            return
        }

        let queue_perm = this.queues.findIndex(E => E.name === key.queue)
        if (this.selectedQueue === 'Any Queue' && queue_perm < 0)
          return

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

        if (this.selectedMedia !== key.record && this.selectedMedia !== 'Any Media')
          return

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
