<template>
<div class="form">
  <form-text label="Name" v-model="queue_group.name"></form-text>
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
        this.queue_group = await this.$agent.p_mfa('ws_admin', 'get_queue_group', [this.id])
        this.skills = this.object2list(this.queue_group.skills)
      }
    },
    onCommit: async function () {
      this.queue_group.skills = this.list2object(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_admin', 'update_queue_group', [this.id, this.queue_group])
        } else {
          await this.$agent.p_mfa('ws_admin', 'create_queue_group', [this.queue_group])
        }
        this.$router.push('/admin/queue_groups')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'delete_queue_group', [this.id])
        this.$router.push('/admin/queue_groups')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>