<template>
  <b-row
    style="margin-top: 5px"
  >
    <b-col cols="3">
      <label
        :id="label"
      >
        {{ label }}
      </label>
    </b-col>
    <b-col cols="9">
      <select
        class="custom-select pointer"
        style="width: 100%"
        :value="value"
        :disabled="isDisabled()"
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
  name: 'QueueGroups',
  props: {
    value: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
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
    isDisabled() {
      return this.groups.length == 0
    },
    isActive(Id) {
      return Id == this.value
    },
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_db_queue_group', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
