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
          v-for="moh in mohs"
          :key="moh.id"
          :value="moh.id"
          :selected="isActive(moh.id)"
        >
          {{ moh.name }}
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
          v-for="moh in mohs"
          :key="moh.id"
          :value="moh.id"
          :selected="isEffective(moh.id)"
        >
          {{ moh.name }}
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
          v-for="moh in mohs"
          :key="moh.id"
          :value="moh.id"
          :selected="isActive(moh.id)"
        >
          {{ moh.name }}
        </option>
      </select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'WidgetMohss',
  props: {
    value: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    effective: {
      type: Boolean,
      value: false
    }
  },
  data () {
    return {
      mohs: []
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
      return this.mohs.length == 0
    },
    isEffective(Id) {
      return Id == this.effective
    },
    query: async function () {
      this.mohs = await this.$agent.p_mfa('ws_db_moh', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
