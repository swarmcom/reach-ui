<template>
<btable :fields="fields" :data="releases" :add_button=true :filter_button=true :paginate=true></btable>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-releases',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        score: { label: 'Score', sortable: true }
      },
      releases: []
    }
  },
  methods: {
    query: async function () {
      this.releases = await this.$agent.p_mfa('ws_admin', 'get_releases')
    },
    add () {
      this.$router.push(`/admin/release/`)
    },
    onClick (data) {
      this.$router.push(`/admin/release/${data.id}`)
    },
  },
  created () {
    this.query()
  },
  components: {
    btable: Btable
  }
}
</script>