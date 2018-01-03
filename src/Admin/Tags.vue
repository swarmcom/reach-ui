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
  <b-row style="margin-top: 20px">
    <b-col>
Add skills to the system by typing in the skill name in the entry box and pressing return. Once added, a full list of the skills built in the system can be seen by using the drop down. Remove skills from the system by clicking on the skill name to the right of the drop down selector. Note that once a skill is built in the system here, it can be referenced throughout the system by name. Example configuration referenceing these skills includes skill groups, queue, queue group, agent, agent group, line, client, etc.
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
