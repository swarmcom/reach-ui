<template>
<div class="form">
  <form-text id="name" label="Name" v-model="queue.name"></form-text>
  <queue-groups id="group_id" label="Group" v-model="queue.group_id"></queue-groups>
  <form-text id="hold_music" label="Music on hold" v-model="queue.hold_music"></form-text>
  <form-text id="weight" label="Weight" v-model="queue.weight"></form-text>
  <form-text id="aging_factor" label="Aging" v-model="queue.aging_factor"></form-text>
  <form-text id="auto_wrapup" label="Auto Wrap-up" v-model="queue.auto_wrapup"></form-text>
  <form-bool label="Wrap-up enabled" v-model="queue.wrapup_enabled"></form-bool>
  <form-text id="wrapup_timer" label="Wrap-up timer" v-model="queue.wrapup_timer"></form-text>
  <skills id="skills" label="Skills" v-model="skills"></skills>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import Common from './Common'

export default {
  name: 'admin-queue',
  props: ['id'],
  mixins: [Common],

  data () {
    return {
      queue: {},
      skills: [],
      recipe: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.queue = await this.$agent.p_mfa('ws_db_queue', 'get', [this.id])
        this.skills = this.object2list(this.queue.skills)
      }
    },
    onCommit: async function () {
      this.queue.skills = this.list2object(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_queue', 'update', [this.id, this.queue])
        } else {
          await this.$agent.p_mfa('ws_db_queue', 'create', [this.queue])
        }
        this.$router.push('/admin/queues')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_queue', 'delete', [this.id])
        this.$router.push('/admin/queues')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
