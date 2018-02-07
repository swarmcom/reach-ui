<template>
<div v-bind:class="classObject">
<ul style="margin-top: 10px" class="nav nav-tabs">
  <b-nav-item-dropdown text="Experimental">
    <b-dropdown-item to="/reports/agents/states">Agents man-hours</b-dropdown-item>
    <b-dropdown-item to="/reports/agents/unique">Unique agents</b-dropdown-item>
    <b-dropdown-item to="/reports/agents/avg">Agents averages</b-dropdown-item>
    <b-dropdown-item to="/reports/measures/avg">Measures averages</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Sessions">
    <b-dropdown-item to="/reports/sessions/agent">Agent</b-dropdown-item>
    <b-dropdown-item to="/reports/sessions/inqueue">Inqueue</b-dropdown-item>
    <b-dropdown-item to="/reports/sessions/outgoing">Outgoing</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="CDR">
    <b-dropdown-item to="/reports/legacy/cdr/cdr">CDR</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/cdr/extended">Extended</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/cdr/compact">Compact</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Agent">
    <b-dropdown-item to="/reports/legacy/agent/activity-individual">Activity Individual</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/activity-by-group">Activity by Group</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/answer-performance-by-group">Answer Performance by Group</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/availability">Availability</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/call-disposition">Call Disposition</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/group-activity">Group Activity</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/group-productivity">Group Productivity</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/productivity-by-group">Productivity by Group</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/state-history">State History</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/states-overview">States Overview</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/concurrent-logged-in-agents">Concurrent Logged in Agents</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/unanswered-call-details">Unanswered Call Details</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Outbound">
    <b-dropdown-item to="/reports/legacy/outbound/detail-by-client">Detail by Client</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/outbound/overview-by-client">Overview by Client</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Traffic">
    <b-dropdown-item to="/reports/legacy/traffic/client-detail">Client Detail</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/traffic/client-overview">Client Overview</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/traffic/line-detail">Line Detail</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/traffic/line-overview">Line Overview</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/traffic/queue-group-overview">Queue Group Overview</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/traffic/queue-detail">Queue Detail</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/traffic/queue-overview">Queue Overview</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/traffic/voicemail-detail">Voicemail Detail</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/traffic/voicemail-overview">Voicemail Overview</b-dropdown-item>
  </b-nav-item-dropdown>

</ul>
<transition name="reach" mode="out-in">
  <router-view style="margin-top: 20px"></router-view>
</transition>
</div>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    classObject: function () {
      this.$agent.vm.storage_data["narrowScreenReports"] = this.$agent.vm.isNarrowLayout.reports
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return {
        container: this.$agent.vm.isNarrowLayout.reports,
        'padding-container-fluid': !this.$agent.vm.isNarrowLayout.reports
      }
    }
  },
}
</script>

<style>
</style>
