<template>
<b-dropdown id="ddown1" text="Release" variant="outline-primary">
  <b-dropdown-item v-for="r in releases" :key="r.id" @click="release(r.id)">{{ r.name }}</b-dropdown-item>
</b-dropdown>
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
    query () {
      this.$agent.get_releases(Obj => this.releases = Obj.reply)
    },
    release (id) {
      this.$agent.release(id)
    },
  },
  mounted () {
    this.query()
  }
}
</script>