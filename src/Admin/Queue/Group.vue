<template>
<div class="form">
  <form-text label="Queue Group Name" v-model="rec.name"></form-text>
  <recipes label="Recipe" v-model="rec.recipe_id"></recipes>
  <mohs label="Music on hold" v-model="rec.moh_id"></mohs>
  <form-number-real label="Aging" v-model="rec.aging_factor"></form-number-real>
  <form-number label="Weight" v-model="rec.weight"></form-number>
  <form-select-bool label="Wrap-up enabled" v-model="rec.wrapup_enabled"></form-select-bool>
  <form-number label="Wrap-up timer" v-model="rec.wrapup_timer"></form-number>
  <form-number label="Auto wrap-up" v-model="rec.auto_wrapup"></form-number>
  <form-tags label="Skills" placeholder="Skill..." v-model="skills"></form-tags>
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
      skills: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa('ws_db_queue_group', 'get', [this.id])
        this.skills = this.skills2list(this.rec.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_queue_group', 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa('ws_db_queue_group', 'create', [this.rec])
        }
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_queue_group', 'delete', [this.id])
        this.$router.go(-1)
      }
    },
    onCancel () {
      this.$router.go(-1)
    },
  },
  created () {
    this.query()
  }
}
</script>
