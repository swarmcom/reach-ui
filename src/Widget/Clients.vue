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
        :value="value"
        style="width: 100%"
        :disabled="isDisabled()"
        @change="onUpdate($event.target.value)"
      >
        <option />
        <option
          v-for="client in clients"
          :key="client.id"
          :value="client.id"
          :selected="isActive(client.id)"
        >
          {{ client.name }}
        </option>
      </select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'FormText',
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number],
      default: ""
    }
  },
  data () {
    return {
      clients: []
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
      return this.clients.length == 0
    },
    query: async function () {
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
