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
    <b-col
      v-if="effective"
      cols="5"
    >
      <select
        class="custom-select pointer"
        style="width: 100%"
        :value="value"
        :disabled="isDisabled()"
        @change="onUpdate($event.target.value)"
      >
        <option />
        <option
          v-for="lua in luas"
          :key="lua.id"
          :value="lua.id"
          :selected="isActive(lua.id)"
        >
          {{ lua.name }}
        </option>
      </select>
    </b-col>
    <b-col
      v-if="effective"
      cols="4"
    >
      <select
        class="custom-select pointer"
        style="width: 100%"
        :value="effective"
        disabled
      >
        <option />
        <option
          v-for="lua in luas"
          :key="lua.id"
          :value="lua.id"
          :selected="isEffective(lua.id)"
        >
          {{ lua.name }}
        </option>
      </select>
    </b-col>
    <b-col
      v-else
      cols="9"
    >
      <select
        class="custom-select pointer"
        style="width: 100%"
        :value="value"
        :disabled="isDisabled()"
        @change="onUpdate($event.target.value)"
      >
        <option />
        <option
          v-for="lua in luas"
          :key="lua.id"
          :value="lua.id"
          :selected="isActive(lua.id)"
        >
          {{ lua.name }}
        </option>
      </select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'FormText',
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    effective: {
      type: [String, Number],
      default: ""
    }
  },
  data () {
    return {
      luas: []
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
      return this.luas.length == 0
    },
    isEffective(Id) {
      return Id == this.effective
    },
    query: async function () {
      this.luas = await this.$agent.p_mfa('ws_db_lua', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
