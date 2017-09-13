<template>
<div class="form">
  <form-text label="Name" v-model="group.name"></form-text>
  <form-text label="Music on hold" v-model="group.hold_music"></form-text>
  <form-text label="Aging" v-model="group.aging_factor"></form-text>
  <form-text label="Weight" v-model="group.weight"></form-text>
  <form-text label="Wrap-up enabled" v-model="group.wrapup_enabled"></form-text>
  <form-text label="Wrap-up timer" v-model="group.wrapup_timer"></form-text>
  <form-text label="Auto wrap-up" v-model="group.auto_wrapup"></form-text>
  <skills label="Skills" v-model="skills"></skills>
  <recipe label="Recipe" v-model="recipe"></recipe>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
import Skills from '../Widget/Skills.vue'
import Recipe from '../Widget/Recipe.vue'
import Common from './Common'

export default {
  name: 'admin-group',
  props: ['id'],
  mixins: [Common],
  components: { 'form-text': FormText, 'skills': Skills, 'recipe': Recipe },
  data () {
    return {
      group: {},
      skills: [],
      recipe: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.group = await this.$agent.p_mfa('ws_admin', 'get_group', [this.id])
        this.skills = this.object2list(this.group.skills)
      }
    },
    onCommit: async function () {
      this.group.skills = this.list2object(this.skills)
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'update_group', [this.id, this.group])
      } else {
        await this.$agent.p_mfa('ws_admin', 'create_group', [this.group])
      }
      this.$router.push('/admin/groups')
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'delete_group', [this.id])
        this.$router.push('/admin/groups')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>