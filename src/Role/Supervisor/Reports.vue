<template>
<div v-access:reports-ui>
<ul style="margin-top: 10px" class="nav nav-tabs">

  <b-nav-item-dropdown text="Inbound">
    <b-dropdown-item to="/reports/inbound/summary">Summary</b-dropdown-item>
    <b-dropdown-item to="/reports/inbound/sessions">Sessions</b-dropdown-item>
    <b-dropdown-item to="/reports/inbound/unanswered">Unanswered</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Outbound">
    <b-dropdown-item to="/reports/outbound/summary">Summary</b-dropdown-item>
    <b-dropdown-item to="/reports/outbound/sessions">Sessions</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Voicemail">
    <b-dropdown-item to="/reports/voicemail/summary">Summary</b-dropdown-item>
    <b-dropdown-item to="/reports/voicemail/sessions">Sessions</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Agent">
    <b-dropdown-item to="/reports/agents/sessions">Sessions</b-dropdown-item>
    <b-dropdown-item to="/reports/agents/events">Events</b-dropdown-item>
    <b-dropdown-item to="/reports/agents/releases">Releases</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Summary">
    <b-dropdown-item to="/reports/answer">Answer</b-dropdown-item>
    <b-dropdown-item to="/reports/activity">Activity</b-dropdown-item>
    <b-dropdown-item to="/reports/productivity">Productivity</b-dropdown-item>
    <b-dropdown-item to="/reports/availability">Availability</b-dropdown-item>
    <b-dropdown-item to="/reports/dispositions">Dispositions</b-dropdown-item>
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
