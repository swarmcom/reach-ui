<template>
  <div>
    <btable
      :fields="fields"
      :data="profiles"
      :storageName="name"
      :add_button=true>
    </btable>
  </div>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-profiles',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        permissions: { label: 'Permissions', sortable: true },
        ring_timeout: { label: 'Ring Timeout', sortable: true },
        max_ring_fails: { label: 'Max Ring Fails', sortable: true }
      },
      name:"adminProfiles",
      profiles: []
    }
  },
  methods: {
    query: async function () {
      this.profiles = await this.$agent.p_mfa('ws_admin', 'get_profiles')
    },
    add () {
      this.$router.push(`/admin/profile/`)
    },
    onClicked(data) {
      this.$router.push(`/admin/profile/${data.id}`)
    }
  },
  created () {
    this.query()
  },
  components: {
    'btable': Btable
  }
}
</script>