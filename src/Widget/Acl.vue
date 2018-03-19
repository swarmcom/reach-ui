<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div v-if="effective" class="col-5">
    <select class="custom-select" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="acl in acls" :value="acl.id" :selected="isActive(acl.id)" :key="acl.id">{{ acl.name }}</option>
    </select>
  </div>
  <div v-if="effective" class="col-4">
    <input class="form-control" type="text" :value="safe_effective" disabled>
  </div>
  <div v-else class="col-9">
    <select class="custom-select" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="acl in acls" :value="acl.id" :selected="isActive(acl.id)" :key="acl.id">{{ acl.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'form-text',
  props: ['label', 'value', 'effective'],
  data () {
    return {
      acls: []
    }
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
  }
}
</script>
