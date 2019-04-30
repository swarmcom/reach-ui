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
      <b-form-select
        class="pointer"
        :value="value"
        :disabled="isDisabled()"
        @change="onUpdate"
      >
        <option />
        <option
          v-for="role in roles"
          :key="role.id"
          :value="role.id"
          :selected="isActive(role.id)"
        >
          {{ role.name }}
        </option>
      </b-form-select>
    </b-col>
    <b-col
      v-if="effective"
      cols="4"
    >
      <b-form-input
        type="text"
        :value="roles.find((element) => element.id == effective).name"
        disabled
      />
    </b-col>
    <b-col
      v-else
      cols="9"
    >
      <b-form-select
        class="pointer"
        :value="value"
        :disabled="isDisabled()"
        @change="onUpdate"
      >
        <option />
        <option
          v-for="role in roles"
          :key="role.id"
          :value="role.id"
          :selected="isActive(role.id)"
        >
          {{ role.name }}
        </option>
      </b-form-select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'WidgetRoles',
  props: {
    value: {
      type: [Number, String],
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    effective: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      roles: []
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
      return this.roles.length == 0
    },
    isEffective(Id) {
      return Id == this.effective
    },
    query: async function () {
      this.roles = await this.$agent.p_mfa('ws_db_role', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
