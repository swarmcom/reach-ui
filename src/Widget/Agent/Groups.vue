<template>
  <div style="margin-top: 5px">
    <b-row>
      <b-col cols="3">
        <label
          :id="label"
          class="col-form-label"
        >{{ label }}</label>
      </b-col>
      <b-col cols="9">
        <b-form-select
          class="pointer"
          :value="value"
          :disabled="isDisabled()"
          @change="onUpdate"
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
        </b-form-select>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'AgentGroups',
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: [Number, String],
      default: ""
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
      this.groups = await this.$agent.p_mfa('ws_db_agent_group', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
