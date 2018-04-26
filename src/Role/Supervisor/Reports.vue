<template>
<div v-access:reports-ui>
<ul style="margin-top: 10px" class="nav nav-tabs">

  <b-nav-item-dropdown text="Sessions">
    <b-dropdown-item to="/reports/sessions/inqueue">Inbound</b-dropdown-item>
    <b-dropdown-item to="/reports/sessions/unanswered">Unanswered</b-dropdown-item>
    <b-dropdown-item to="/reports/sessions/voicemail">Voicemail</b-dropdown-item>
    <b-dropdown-item to="/reports/sessions/outgoing">Outbound</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Agent">
    <b-dropdown-item to="/reports/agents/sessions">Sessions</b-dropdown-item>
    <b-dropdown-item to="/reports/agent/productivity">Productivity</b-dropdown-item>
    <b-dropdown-item to="/reports/agent/call-disposition">Call Disposition</b-dropdown-item>
    <b-dropdown-item to="/reports/agent/bounded-events">Bounded Events</b-dropdown-item>
    <b-dropdown-item to="/reports/agent/events">Events</b-dropdown-item>
    <b-dropdown-item to="/reports/agent/concurrent-logged-in-agents">Concurrent Logged in Agents</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Summary">
    <b-dropdown-item to="/reports/answer">Answer</b-dropdown-item>
    <b-dropdown-item to="/reports/activity">Activity</b-dropdown-item>
    <b-dropdown-item to="/reports/productivity">Productivity</b-dropdown-item>
    <b-dropdown-item to="/reports/availability">Availability</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Traffic">
    <b-dropdown-item to="/reports/inbound/summary">Inbound</b-dropdown-item>
    <b-dropdown-item to="/reports/outbound/summary">Outbound</b-dropdown-item>
    <b-dropdown-item to="/reports/voicemail/summary">Voicemail</b-dropdown-item>
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
