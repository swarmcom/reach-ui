<template>
<div class="form">
  <form-text label="Name" v-model="queue_group.name"></form-text>
  <form-text label="Music on hold" v-model="queue_group.hold_music"></form-text>
  <form-text label="Aging" v-model="queue_group.aging_factor"></form-text>
  <form-text label="Weight" v-model="queue_group.weight"></form-text>
  <form-text label="Wrap-up enabled" v-model="queue_group.wrapup_enabled"></form-text>
  <form-text label="Wrap-up timer" v-model="queue_group.wrapup_timer"></form-text>
  <form-text label="Auto wrap-up" v-model="queue_group.auto_wrapup"></form-text>
  <skills label="Skills" v-model="skills"></skills>
  <recipe label="Recipe" v-model="recipe"></recipe>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../../Widget/FormText.vue'
import Skills from '../../Widget/Skills.vue'
import Recipe from '../../Widget/Recipe.vue'
import Common from '../Common'

export default {
  name: 'admin-queue-group',
  props: ['id'],
  mixins: [Common],
  components: { 'form-text': FormText, 'skills': Skills, 'recipe': Recipe },
  data () {
    return {
      queue_group: {},
      skills: [],
      recipe: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.queue_group = await this.$agent.p_mfa('ws_db_queue_group', 'get', [this.id])
        this.skills = this.object2list(this.queue_group.skills)
      }
    },
    onCommit: async function () {
      this.queue_group.skills = this.list2object(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_queue_group', 'update', [this.id, this.queue_group])
        } else {
          await this.$agent.p_mfa('ws_db_queue_group', 'create', [this.queue_group])
        }
        this.$router.push('/admin/queue_groups')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_queue_group', 'delete', [this.id])
        this.$router.push('/admin/queue_groups')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
