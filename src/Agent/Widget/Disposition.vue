<template>
  <b-dropdown
    size="sm"
    text="Disposition"
    :disabled="isDisabled()"
    variant="outline-secondary"
  >
    <b-dropdown-item
      v-for="r in dispositions"
      :key="r.id"
      :active="isActive(r.id)"
      @click="disposition(r.id)"
    >
      {{ r.name }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: 'AgentDisposition',
  props: {
    uuid: {
      type: String,
      default: ''
    },
    active: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dispositions: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    isActive(id) {
      return this.active == id
    },
    isDisabled() {
      return this.dispositions.length == 0
    },
    query: async function () {
      this.dispositions = await this.$agent.p_mfa('ws_agent', 'dispositions', [this.uuid])
    },
    disposition (id) {
      this.$emit('input', id)
      this.$agent.p_mfa('ws_agent', 'disposition', [this.uuid, id])
    },
  }
}
</script>
