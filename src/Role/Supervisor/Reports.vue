<template>
<div v-bind:class="classObject">
<ul style="margin-top: 10px" class="nav nav-tabs">
  <b-nav-item-dropdown text="Experimental">
    <b-dropdown-item to="/report/agents/states">Agents man-hours</b-dropdown-item>
    <b-dropdown-item to="/report/agents/unique">Unique agents</b-dropdown-item>
    <b-dropdown-item to="/report/agents/avg">Agents averages</b-dropdown-item>
    <b-dropdown-item to="/report/measures/avg">Measures averages</b-dropdown-item>
    <b-dropdown-item to="/report/sessions/inqueue">Call sessions</b-dropdown-item>
    <b-dropdown-item to="/report/sessions/agent">Agent sessions</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="CDR">
    <b-dropdown-item to="/report/legacy/cdr/cdr">CDR</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/cdr/cdr-extended">Extended</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/cdr/cdr-compact">Compact</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Agent">
    <b-dropdown-item to="/report/legacy/agent/agent-activity-individual">Activity Individual</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/agent/agent-activity-by-group">Activity by Group</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/agent/agent-answer-performance-by-group">Answer Performance by Group</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/agent/agent-availability">Availability</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/agent/agent-call-disposition">Call Disposition</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/agent/agent-group-activity">Group Activity</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/agent/agent-group-productivity">Group Productivity</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/agent/agent-productivity-by-group">Productivity by Group</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/agent/agent-state-history">State History</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/agent/agent-states-overview">States Overview</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/agent/concurrent-logged-in-agents">Concurrent Logged in Agents</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/agent/unanswered-call-details">Unanswered Call Details</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Outbound">
    <b-dropdown-item to="/report/legacy/outbound/outbound-detail-by-client">Detail by Client</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/outbound/outbound-overview-by-client">Overview by Client</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Traffic">
    <b-dropdown-item to="/report/legacy/traffic/client-traffic-detail">Client Traffic Detail</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/traffic/client-traffic-overview">Client Traffic Overview</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/traffic/line-traffic-detail">Line Traffic Detail</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/traffic/line-traffic-overview">Line Traffic Overview</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/traffic/queue-group-traffic-overview">Queue Group Traffic Overview</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/traffic/queue-traffic-detail">Queue Traffic Detail</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/traffic/queue-traffic-overview">Queue Traffic Overview</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/traffic/voicemail-detail">Voicemail Detail</b-dropdown-item>
    <b-dropdown-item to="/report/legacy/traffic/voicemail-overview">Voicemail Overview</b-dropdown-item>
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
      this.$agent.vm.storage_data["narrowScreenAdmin"] = this.$agent.vm.isNarrowLayout.admin
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return {
        container: this.$agent.vm.isNarrowLayout.admin,
        'padding-container-fluid': !this.$agent.vm.isNarrowLayout.admin
      }
    }
  },
}
</script>

<style>
</style>
