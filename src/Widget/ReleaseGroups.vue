<template>
  <div style="margin-top: 5px">
    <b-row>
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
            v-for="release in releases"
            :key="release.id"
            :value="release.id"
            :selected="isActive(release.id)"
          >
            {{ release.name }}
          </option>
        </b-form-select>
      </b-col>
      <b-col
        v-if="effective"
        cols="4"
      >
        <b-form-input
          type="text"
          :value="releases.find((element) => element.id == effective).name"
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
            v-for="release in releases"
            :key="release.id"
            :value="release.id"
            :selected="isActive(release.id)"
          >
            {{ release.name }}
          </option>
        </b-form-select>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'WidgetReleases',
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
      this.releases = await this.$agent.p_mfa('ws_db_release_group', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
