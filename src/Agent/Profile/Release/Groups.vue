<template>
  <b-row style="margin-top: 5px">
    <label
      :id="label"
      class="col-3 col-form-label"
    >
      {{ label }}
    </label>
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
          v-for="release in releases"
          :key="release.id"
          :value="release.id"
          :selected="isActive(release.id)"
        >
          {{ release.name }}
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
          v-for="release in releases"
          :key="release.id"
          :value="release.id"
          :selected="isEffective(release.id)"
        >
          {{ release.name }}
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
          v-for="release in releases"
          :key="release.id"
          :value="release.id"
          :selected="isActive(release.id)"
        >
          {{ release.name }}
        </option>
      </select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'WidgetReleases',
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
      releases: []
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
      return this.releases.length == 0
    },
    isEffective(Id) {
      return Id == this.effective
    },
    query: async function () {
      this.releases = await this.$agent.p_mfa('ws_agent', 'release_groups')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
