<template>
<div class="form">
  <form-text label="Name" v-model="rec.name"></form-text>
  <recipes label="Recipe" v-model="rec.recipe_id"></recipes>
  <mohs label="Music on hold" v-model="rec.moh_id"></mohs>
  <form-text label="Aging" v-model="rec.aging_factor"></form-text>
  <form-text label="Weight" v-model="rec.weight"></form-text>
  <form-text label="Wrap-up enabled" v-model="rec.wrapup_enabled"></form-text>
  <form-text label="Wrap-up timer" v-model="rec.wrapup_timer"></form-text>
  <form-text label="Auto wrap-up" v-model="rec.auto_wrapup"></form-text>
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
  name: 'admin-queue-group',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_queue_group',
      redirect: '/admin/queues'
    }
  },
}
</script>
