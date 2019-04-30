<template>
  <b-form-row>
    <b-col cols="4">
      <b-form-select
        v-model="comparision"
        :options="comparasions"
        @change="commit"
      />
    </b-col>
    <b-col cols="6">
      <select
        v-model="value"
        class="custom-select"
        @change="commit"
      >
        <option />
        <option
          v-for="client in clients"
          :key="client.id"
          :value="client.id"
        >
          {{ client.name }}
        </option>
      </select>
    </b-col>
  </b-form-row>
</template>

<script>
export default {
  name: 'AdminRecipeConditionClient',
  props: {
    args: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      comparasions: ['=', '!=' ],
      comparision: this.args[0],
      value: this.args[1],
      clients: []
    }
  },
  watch: {
    comparision () {
      this.commit()
    },
    value () {
      this.commit()
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
    },
    commit () {
      this.$emit('input', [this.comparision, this.value])
    }
  },
}
</script>
