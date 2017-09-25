<template>
  <div>
    <btable
      :fields="fields"
      :data="releases"
      :storageName="name"
      :add_button=true>
    </btable>
  </div>
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
      name: "adminReleases",
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
    'btable': Btable
  }
}
</script>