<template>
  <div>
    <div style="margin-top: 20px; margin-bottom: 20px; max-width: 300px">
      <b-form-select v-model="selected" size="sm" @input="loadReport">
        <option value="null" disabled>Select report</option>
        <optgroup v-for="reportGroup in reports" :label="reportGroup.reportGroupName">
          <option v-for="report in reportGroup.reports" :value="report">{{ report.name }}</option>
        </optgroup>
      </b-form-select>
    </div>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import VueRouter from 'vue-router'
  import CDR from '@/Report/CDR/CDR'
  import Empty from '@/Report/Empty'

  const router = new VueRouter({
    routes: [
      {path: '/cdr/cdr', component: CDR},
      {path: '/empty', component: Empty}
    ]
  })

  export default {
    name: 'reach-reports',
    router,
    data () {
      return {
        selected: null,
        reports: [
          {
            reportGroupName: "CDR reports",
            reports: [
              {path: "/cdr/cdr", name: "CDR"},
              {path: "/empty", name: "CDR Extended"},
              {path: "/empty", name: "CDR Compact"}
            ]
          },
          {
            reportGroupName: "Agent reports",
            reports: [
              {path: "/empty", name: "Agent Activity Individual"},
              {path: "/empty", name: "Agent Activity by Group"},
              {path: "/empty", name: "Agent Answer Performance by Group"},
              {path: "/empty", name: "Agent Availability"},
              {path: "/empty", name: "Agent Call Disposition"},
              {path: "/empty", name: "Agent Group Activity"},
              {path: "/empty", name: "Agent Group Productivity"},
              {path: "/empty", name: "Agent Productivity by Group"},
              {path: "/empty", name: "Agent State History"},
              {path: "/empty", name: "Agent States Overview"},
              {path: "/empty", name: "Concurrent Logged in Agents"},
              {path: "/empty", name: "Unanswered Call Details"}
            ]
          },
          {
            reportGroupName: "Outbound reports",
            reports: [
              {path: "/empty", name: "Outbound Detail by Client"},
              {path: "/empty", name: "Outbound Overview by Client"}
            ]
          },
          {
            reportGroupName: "Traffic reports",
            reports: [
              {path: "/empty", name: "Client Traffic Detail"},
              {path: "/empty", name: "Client Traffic Overview"},
              {path: "/empty", name: "Line Traffic Detail"},
              {path: "/empty", name: "Line Traffic Overview"},
              {path: "/empty", name: "Queue Group Traffic Overview"},
              {path: "/empty", name: "Queue Traffic Detail"},
              {path: "/empty", name: "Queue Traffic Overview"},
              {path: "/empty", name: "Voicemail Detail"},
              {path: "/empty", name: "Voicemail Overview"}
            ]
          }
        ]
      }
    },
    methods: {
      loadReport () {
        this.$router.push({path: this.selected.path})
      }

    },
    created () {

    }
  }
</script>
