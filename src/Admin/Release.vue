<template>
<div class="form">
  <form-text id="name" label="Name" v-model="release.name"></form-text>
  <form-text id="score" label="Score" v-model="release.score"></form-text>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
import Common from './Common'

export default {
  name: 'admin-release',
  props: ['id'],
  components: { 'form-text': FormText },
  mixins: [Common],
  data () {
    return {
      release: {}
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.release = await this.$agent.p_mfa('ws_admin', 'get_release', [this.id])
      }
    },
    onCommit: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'update_release', [this.id, this.release])
      } else {
        await this.$agent.p_mfa('ws_admin', 'create_release', [this.release])
      }
      this.$router.push('/admin/releases')
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'delete_release', [this.id])
        this.$router.push('/admin/releases')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>