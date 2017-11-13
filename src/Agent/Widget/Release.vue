<template>
<b-dropdown v-if="areReleases()" text="Release" variant="outline-primary">
  <b-dropdown-item v-for="r in releases" :key="r.id" @click="release(r.id)">{{ r.name }}</b-dropdown-item>
</b-dropdown>
<button v-else @click="default_release()" class="btn btn-outline-primary">Release</button>
</template>

<script>
export default {
  name: 'agent-release',
  data () {
    return {
      releases: []
    }
  },
  methods: {
    query: async function () {
      this.releases = await this.$agent.p_mfa('ws_agent', 'get_releases')
    },
    release (id) {
      this.$agent.release(id)
    },
    default_release() {
      this.$agent.default_release()
    },
    areReleases () {
      return this.releases.length != 0
    }
  },
  mounted () {
    this.query()
  }
}
</script>
