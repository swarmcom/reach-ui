<template>
<div class="container">
  <b-row>
    <b-col>
      <h3>All skills</h3>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <tags v-model="tags"></tags>
    </b-col>
  </b-row>
</div>
</template>

<script>
import Tags from '@/Widget/Tags'

export default {
  name: 'admin-tags',
  components: { Tags },
  data () {
    return {
      tags: [],
      copy: []
    }
  },
  methods: {
    query: async function () {
      this.tags = await this.$agent.p_mfa('ws_db_tag', 'get')
      this.copy = this.tags.slice(0)
    },
  },
  created () {
    this.query()
  },
  watch: {
    tags (value, old) {
      if (old.length == 0) {
        return value
      }
      let deleted = this.copy.filter(x => value.indexOf(x) < 0)
      if (deleted.length > 0) {
        this.$agent.p_mfa('ws_db_tag', 'delete', [deleted])
      } else {
        this.$agent.p_mfa('ws_db_tag', 'put', [value])
      }
      this.copy = value.slice(0)
      return value
    }
  }
}
</script>
