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
          v-for="acl in acls"
          :key="acl.id"
          :value="acl.id"
          :selected="isActive(acl.id)"
        >
          {{ acl.name }}
        </option>
      </b-form-select>
    </b-col>
    <b-col
      v-if="effective"
      cols="4"
    >
      <b-form-input
        type="text"
        :value="safe_effective"
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
          v-for="acl in acls"
          :key="acl.id"
          :value="acl.id"
          :selected="isActive(acl.id)"
        >
          {{ acl.name }}
        </option>
      </b-form-select>
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
    },
    effective: {
      type: [String, Number],
      default: ""
    }
  },
  data () {
    return {
      acls: []
    }
  },
  computed: {
    safe_effective () {
      if (this.effective === 'undefined') {
        return ''
      }
      else {
        let index = this.acls.findIndex(el => el.id === this.effective)
        if (index >= 0) {
          return this.acls[index].name
        }
        else {
          return ''
        }
      }
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
      return this.acls.length == 0
    },
    query: async function () {
      this.acls = await this.$agent.p_mfa('ws_db_acl_group', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
