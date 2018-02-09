<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseQueueManagerView" class="mt-2">
    <b-row>
      <b-col cols="12" md="12" lg="2" xl="2">
        <b-row class="toggle-bar-custom">
          <div class="titlenocollapse">Queue Name</div>
        </b-row>
        <b-table style="margin-top:10px" small hover
                 :items="computedStats"
                 :fields="fieldNames">
          <template slot="name" slot-scope="data">
            <b-row>
              <b-col cols="1" v-if="(data.item.details.length > 0)">
                <div v-if="!data.item.seeDetails" class="pointer" @click="showDetails(data)">
                  <icon name="plus" scale="0.5"></icon>
                </div>
                <div v-if="data.item.seeDetails" class="pointer" @click="showDetails(data)">
                  <icon name="minus" scale="0.5"></icon>
                </div>
              </b-col>
              <b-col>
                <div>{{data.item.name}}</div>
              </b-col>
            </b-row>
            <b-row v-if="data.item.seeDetails && data.item.details.length > 0">
              <b-col cols="6">
                <div class="agent-state-text"><b>Line</b></div>
              </b-col>
              <b-col cols="6">
                <div class="agent-state-text"><b>Customer</b></div>
              </b-col>
            </b-row>
            <b-row v-if="data.item.seeDetails && data.item.details.length > 0" v-for="(v, k) in data.item.details"
                   key="k">
              <b-col cols="6">
                <div class="agent-state-text">{{v.line}}</div>
              </b-col>
              <b-col cols="6">
                <div class="agent-state-text">{{v.customer.name}}</div>
              </b-col>
            </b-row>
          </template>
        </b-table>
      </b-col>
      <b-col cols="12" md="12" xl="10" lg="10">
        <b-row>
          <b-col cols="3" md="3" xl="2" lg="2">
            <b-row class="toggle-bar-custom" style="margin-left:1px">
              <div class="titlenocollapse">Calls in Queue</div>
            </b-row>
            <b-table style="margin-top:10px" small striped bordered hover
                     :items="computedStats"
                     :fields="fieldCIQ">
            </b-table>
          </b-col>
          <b-col cols="9" md="9" xl="10" lg="10">
            <b-row>
              <b-col cols="7" md="7" xl="8" lg="8">
                <b-row class="toggle-bar-custom" style="margin-left:1px">
                  <div class="titlenocollapse">Queue Statistics</div>
                </b-row>
              </b-col>
              <b-col cols="5" md="5" xl="4" lg="4">
                <b-form-select style="margin-top:8px" class="pointer" size="sm" v-model="period.value"
                               @change="set_period">
                  <option v-for="period in periods" :value="period.value">{{period.name}}</option>
                </b-form-select>
              </b-col>
            </b-row>
            <b-table style="margin-top:10px; min-width:500px;" small striped bordered hover
                     :items="computedStats"
                     :fields="fieldsStats">
            </b-table>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>
<script>
import Storage from '@/Storage'

export default {
  name: 'queue-manager-queues',
  widgetName: 'Queue View',
  mixins: [Storage],
  props: {
    inqueues: Array
  },
  data() {
    return {
      fieldCIQ: {
        ciq: {
          label: "CIQ",
          variant: 'warning',
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        }
      },
      fieldNames: {
        name: {
          label: 'Name',
          sortable: false,
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        },
      },
      fieldsStats: {
        speedAnswer: {
          label: 'Speed Answer',
          variant: 'primary',
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        },
        longestWait: {
          label: 'Longest Wait',
          variant: 'primary',
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        },
        connected: {
          label: 'Connected',
          variant: 'success',
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        },
        completed: {
          label: 'Completed',
          variant: 'success',
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        },
        abandonTime: {
          label: 'Abandon Time',
          variant: 'primary',
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        },
        abandoned: {
          label: 'Abandoned',
          variant: 'warning',
          thClass: "table-header-text-center",
          tdClass: "table-body-text-center"
        }
      },
      queues: [],
      periods: [
        {value: "15m", name: "Last 15 minutes"},
        {value: "30m", name: "Last 30 minutes"},
        {value: "1h", name: "Last Hour"},
        {value: "1d", name: "Today"},
        {value: "1w", name: "This Week"},
        {value: "1m", name: "This Month"}
      ],
      period: {value: "15m", name: "Last 15 minutes"},
      showCollapse: true,
    }
  },
  methods: {
    query: async function () {
      this.queues = await this.$agent.p_mfa('ws_agent', 'queues')
    },
    set_period(value) {
      this.period.value = value
    },
    showDetails(value) {
      this.queues[value.index].seeDetails = !this.queues[value.index].seeDetails
    },
    loadDataStorage() {
      this.loadLocal('showCollapse')
    },
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
    computedStats() {
      let queues = this.queues.slice(0)
      let inqueues = this.inqueues.slice(0)
      let stats = []
      queues.forEach((key) => {
        let selectedQueue = key.name
        let object = {
          "seeDetails": key.seeDetails,
          "details": [],
          "name": key.name,
          "ciq": 0,
          "speedAnswer": '-',
          "longestWait": '-',
          "connected": 0,
          "completed": '-',
          "abandonTime": '-',
          "abandoned": '-'
        }
        inqueues.forEach((key) => {
          if (key.queue && selectedQueue == key.queue) {
            object.details.push({customer: key.customer, line: key.line})
            object.ciq++
            if (key.state == 'oncall') {
              object.connected++
            }
          }
        })
        stats.push(object)
      })
      return stats;
    }
  }
}
</script>