<template>
<div class="form">
  <form-text label="Name" v-model="rec.name"></form-text>
  <release-groups label="Release Group" v-model="rec.release_group_id"></release-groups>
  <form-text label="Permissions" v-model="rec.permissions"></form-text>
  <form-text label="Ring timeout" v-model="rec.ring_timeout"></form-text>
  <form-text label="Suspend time" v-model="rec.suspend_time"></form-text>
  <form-text label="Max rings" v-model="rec.max_ring_fails"></form-text>
  <form-text label="Auto logout" v-model="rec.autologout"></form-text>
  <skills label="Skills" v-model="skills"></skills>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import Obj from '../Object'
import Common from '../Common'

export default {
  name: 'admin-agent-group',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_agent_group',
      redirect: '/admin/agents'
    }
  },
}
</script>
