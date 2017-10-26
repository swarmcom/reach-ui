<template>
<div class="row" style="margin-top: 5px">
  <label class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="release in releases"
        :value="release.id" :selected="isActive(release.id)">{{ release.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'widget-releases',
  props: ['label', 'value'],
  data () {
    return {
      releases: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    query: async function () {
      this.releases = await this.$agent.p_mfa('ws_db_release_group', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  },
  created () {
    this.query()
  }
}
</script>
