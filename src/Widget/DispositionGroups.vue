<template>
  <b-row
    style="margin-top: 5px"
  >
    <b-col cols="3">
      <label :id="label">
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
        @change="onUpdate($event.target.value)"
      >
        <option />
        <option
          v-for="disposition in dispositions"
          :key="disposition.id"
          :value="disposition.id"
          :disabled="isDisabled()"
          :selected="isActive(disposition.id)"
        >
          {{ disposition.name }}
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
        :value="value"
        disabled
      >
        <option />
        <option
          v-for="disposition in dispositions"
          :key="disposition.id"
          :value="disposition.id"
          :selected="isEffective(disposition.id)"
        >
          {{ disposition.name }}
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
        @change="onUpdate($event.target.value)"
      >
        <option />
        <option
          v-for="disposition in dispositions"
          :key="disposition.id"
          :value="disposition.id"
          :disabled="isDisabled()"
          :selected="isActive(disposition.id)"
        >
          {{ disposition.name }}
        </option>
      </select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'WidgetDispositions',
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number],
      default: ""
    },
    effective: {
      type: [String, Number],
      default: ""
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
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.dispositions.length == 0
    },
    isEffective(Id) {
      return Id == this.effective
    },
    query: async function () {
      this.dispositions = await this.$agent.p_mfa('ws_db_disposition_group', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
