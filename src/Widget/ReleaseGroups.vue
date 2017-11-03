<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div v-if="effective" class="col-5">
    <select class="custom-select" style="width: 100%" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="release in releases"
        :value="release.id" :selected="isActive(release.id)">{{ release.name }}</option>
    </select>
  </div>
  <div v-if="effective" class="col-4">
    <select class="custom-select" style="width: 100%" :value="value" disabled>
      <option></option>
      <option v-for="release in releases" :value="release.id" :selected="isEffective(release.id)">{{ release.name }}</option>
    </select>
  </div>
  <div v-else class="col-9">
    <select class="custom-select" style="width: 100%" :value="value" @change="onUpdate($event.target.value)">
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
  props: ['label', 'value', 'effective'],
  data () {
    return {
      releases: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isEffective(Id) {
      return Id == this.effective
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
