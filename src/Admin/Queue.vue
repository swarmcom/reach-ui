<template>
<div class="form">
  <form-text label="Queue Name" v-model="rec.name"></form-text>
  <queue-groups label="Queue Group" v-model="rec.group_id"></queue-groups>
  <recipes label="Recipe" v-model="rec.recipe_id"></recipes>
  <mohs label="Music on hold" v-model="rec.moh_id" :effective="eff.moh_id"></mohs>
  <form-text label="Weight" v-model="rec.weight" :effective="eff.weight"></form-text>
  <form-text label="Aging" v-model="rec.aging_factor" :effective="eff.aging_factor"></form-text>
  <form-select-bool label="Wrap-up enabled" v-model="rec.wrapup_enabled" :effective="eff.wrapup_enabled"></form-select-bool>
  <form-text label="Wrap-up timer" v-model="rec.wrapup_timer" :effective="eff.wrapup_timer"></form-text>
  <form-text label="Auto Wrap-up" v-model="rec.auto_wrapup" :effective="eff.auto_wrapup"></form-text>
  <form-tags label="Queue Skills" placeholder="Skill..." v-model="skills" :effective="effective_skills"></form-tags>
  <div style="margin-top:20px">
    <button @click="onCommit" class="btn btn-primary">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
    <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
  </div>
  <help></help>
</div>
</template>

<script>
import Common from '@/Admin/Common'

export default {
  name: 'admin-queue',
  props: ['id'],
  mixins: [Common],

  data () {
    return {
      rec: {},
      skills: [],
      effective_skills: [],
      eff: {},
      recipe: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa('ws_db_queue', 'get', [this.id])
        this.skills = this.skills2list(this.rec.skills)
        this.eff = await this.$agent.p_mfa('ws_db_queue', 'inherited', [this.id])
        this.effective_skills = this.skills2list(this.eff.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_queue', 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa('ws_db_queue', 'create', [this.rec])
        }
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_queue', 'delete', [this.id])
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
