<template>
<div class="form">
  <form-text label="Queue Group Name" v-model="rec.name"></form-text>
  <recipes label="Recipe" v-model="rec.recipe_id"></recipes>
  <mohs label="Music on hold" v-model="rec.moh_id"></mohs>
  <form-text label="Aging" v-model="rec.aging_factor"></form-text>
  <form-text label="Weight" v-model="rec.weight"></form-text>
  <form-text label="Wrap-up enabled" v-model="rec.wrapup_enabled"></form-text>
  <form-text label="Wrap-up timer" v-model="rec.wrapup_timer"></form-text>
  <form-text label="Auto wrap-up" v-model="rec.auto_wrapup"></form-text>
  <skills label="Skills" v-model="skills"></skills>
  <div style="margin-top:20px">
    <button @click="onCommit" class="btn btn-primary pointer">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary pointer">Cancel</button>
    <button @click="onDelete" class="btn btn-danger float-right pointer">Delete</button>
  </div>
  <help></help>
</div>
</template>

<script>
import Common from '@/Admin/Common'

export default {
  name: 'admin-queue-group',
  props: ['id'],
  mixins: [Common],
  data () {
    return {
      rec: {},
      module: 'ws_db_queue_group',
      redirect: '/admin/queues',
      skills: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa('ws_db_queue_group', 'get', [this.id])
        this.skills = this.object2list(this.rec.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2object(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_queue_group', 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa('ws_db_queue_group', 'create', [this.rec])
        }
        this.$router.push('/admin/agents')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_queue_group', 'delete', [this.id])
        this.$router.push('/admin/agents')
      }
    },
    onCancel: async function () {
      this.$router.push('/admin/agents')
    },
  },
  created () {
    this.query()
  }
}
</script>
