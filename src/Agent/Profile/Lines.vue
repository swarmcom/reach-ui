<template>
  <b-row style="margin-top: 5px">
    <b-col cols="3">
      <label
        :id="label"
        class="col-form-label"
      >{{ label }}</label>
    </b-col>
    <b-col
      v-if="effective"
      cols="5"
    >
      <select
        class="custom-select"
        style="width: 100%"
        :value="value"
        :disabled="isDisabled()"
        @change="onUpdate($event.target.value)"
      >
        <option />
        <option
          v-for="line in lines"
          :key="line.id"
          :value="line.id"
          :selected="isActive(line.id)"
        >
          {{ line.name }}
        </option>
      </select>
    </b-col>
    <b-col
      v-if="effective"
      cols="4"
    >
      <input
        class="form-control"
        :value="safe_effective"
        disabled
      >
    </b-col>
    <b-col
      v-else
      cols="9"
    >
      <select
        class="custom-select"
        style="width: 100%"
        :value="value"
        :disabled="isDisabled()"
        @change="onUpdate($event.target.value)"
      >
        <option />
        <option
          v-for="line in lines"
          :key="line.id"
          :value="line.id"
          :selected="isActive(line.id)"
        >
          {{ line.name }}
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
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    effective: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      lines: []
    }
  },
  computed: {
    safe_effective () {
      return this.effective === 'undefined' ? '' : this.effective
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
      return this.lines.length == 0
    },
    query: async function () {
      this.lines = await this.$agent.p_mfa('ws_agent', 'lines_out')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
