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
      v-if="effecitve"
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
          v-for="prompt in prompts"
          :key="prompt.id"
          :value="prompt.id"
          :selected="isActive(prompt.id)"
        >
          {{ prompt.name }}
        </option>
      </select>
    </b-col>
    <b-col
      v-if="effecitve"
      cols="4"
    >
      <select
        class="custom-select"
        style="width: 100%"
        :value="value"
        disabled
      >
        <option />
        <option
          v-for="prompt in prompts"
          :key="prompt.id"
          :value="prompt.id"
          :selected="isEffective(prompt.id)"
        >
          {{ prompt.name }}
        </option>
      </select>
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
          v-for="prompt in prompts"
          :key="prompt.id"
          :value="prompt.id"
          :selected="isActive(prompt.id)"
        >
          {{ prompt.name }}
        </option>
      </select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'WidgetPrompts',
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    effecitve: {
      type: Boolean,
      value: false
    }
  },
  data () {
    return {
      prompts: []
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
      return this.prompts.length == 0
    },
    isEffective(Id) {
      return Id == this.effective
    },
    query: async function () {
      this.prompts = await this.$agent.p_mfa('ws_db_prompt', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
