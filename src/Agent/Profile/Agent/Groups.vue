<template>
  <b-row style="margin-top: 5px">
    <label
      :id="label"
      class="col-3 col-form-label"
    >
      {{ label }}
    </label>
    <b-col cols="9">
      <select
        class="custom-select pointer"
        style="width: 100%"
        :disabled="isDisabled()"
        :value="value"
        @change="onUpdate($event.target.value)"
      >
        <option />
        <option
          v-for="group in groups"
          :key="group.id"
          :value="group.id"
          :selected="isActive(group.id)"
        >
          {{ group.name }}
        </option>
      </select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'AgentGroups',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      groups: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.groups.length == 0
    },
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_agent', 'agent_groups')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
