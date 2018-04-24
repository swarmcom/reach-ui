<template>
<div v-access:reports-ui>
<ul style="margin-top: 10px" class="nav nav-tabs">
  <b-nav-item-dropdown text="Experimental">
    <b-dropdown-item to="/reports/agents/states">Agents man-hours</b-dropdown-item>
    <b-dropdown-item to="/reports/agents/unique">Unique agents</b-dropdown-item>
    <b-dropdown-item to="/reports/agents/avg">Agents averages</b-dropdown-item>
    <b-dropdown-item to="/reports/measures/avg">Measures averages</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Sessions">
    <b-dropdown-item to="/reports/sessions/agent">Agent</b-dropdown-item>
    <b-dropdown-item to="/reports/sessions/inqueue">Inbound</b-dropdown-item>
    <b-dropdown-item to="/reports/sessions/unanswered">Unanswered</b-dropdown-item>
    <b-dropdown-item to="/reports/sessions/voicemail">Voicemail</b-dropdown-item>
    <b-dropdown-item to="/reports/sessions/outgoing">Outbound</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Agent">
    <b-dropdown-item to="/reports/legacy/agent/activity">Activity</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/answer-performance">Answer Performance</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/availability">Availability</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/productivity">Productivity</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/call-disposition">Call Disposition</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/bounded-events">Bounded Events</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/events">Events</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/concurrent-logged-in-agents">Concurrent Logged in Agents</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Agent Group">
    <b-dropdown-item to="/reports/legacy/agent/group/activity">Activity</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/group/answer-performance">Answer Performance</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/agent/group/productivity">Productivity</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Traffic">
    <b-dropdown-item to="/reports/legacy/inbound/summary">Inbound</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/outbound/summary">Outbound</b-dropdown-item>
    <b-dropdown-item to="/reports/legacy/voicemail/summary">Voicemail</b-dropdown-item>
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
}
</script>

<style>
</style>
