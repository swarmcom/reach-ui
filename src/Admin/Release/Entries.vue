<template>
  <div>
    <b-row
      style="margin-bottom: 10px"
    >
      <b-col>
        <h3>Release types:</h3>
      </b-col>
    </b-row>
    <div
      v-for="release of releases"
      :key="release.id"
      class="form-row"
      style="margin-top: 5px"
    >
      <b-col cols="1">
        <b-btn
          class="pointer"
          variant="outline-danger"
          size="sm"
          @click="del(release.id)"
        >
          <icon
            name="minus"
            class="align-middle"
            scale="1"
          />
        </b-btn>
      </b-col>
      <b-col cols="4">
        <input
          type="text"
          class="form-control"
          :value="safe_value(release.name)"
          @change="onChange(release, 'name', $event.target.value)"
        >
      </b-col>
      <b-col cols="5">
        <input
          type="text"
          class="form-control"
          :value="safe_value(release.description)"
          @change="onChange(release, 'description', $event.target.value)"
        >
      </b-col>
      <b-col cols="2">
        <input
          type="number"
          class="form-control"
          :value="safe_value(release.score)"
          @change="onChange(release, 'score', $event.target.value)"
        >
      </b-col>
    </div>
    <div
      class="form-row"
      style="margin-top: 5px"
    >
      <b-col cols="1">
        <b-btn
          class="pointer"
          variant="outline-secondary"
          size="sm"
          @click="add"
        >
          <icon
            name="plus"
            class="align-middle"
            scale="1"
          />
        </b-btn>
      </b-col>
      <b-col cols="4">
        <input
          v-model="name"
          type="text"
          class="form-control"
          placeholder="Name"
        >
      </b-col>
      <b-col cols="5">
        <input
          v-model="description"
          type="text"
          class="form-control"
          placeholder="Description"
        >
      </b-col>
      <b-col cols="2">
        <input
          v-model="score"
          type="number"
          class="form-control"
          placeholder="Score"
        >
      </b-col>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminReleaseEntries',
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      name: undefined,
      description: undefined,
      score: undefined,
      releases: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      this.releases = await this.$agent.p_mfa('ws_db_release', 'by_group', [this.id])
    },
    onChange (release, field, value) {
      release[field] = value
      this.$agent.p_mfa('ws_db_release', 'update', [release.id, release])
    },
    add: async function() {
      let release = await this.$agent.p_mfa('ws_db_release', 'create', [this.id, {
        name: this.name, description: this.description, score: this.score
      }])
      this.releases.push(release)
      this.name = undefined
      this.description = undefined
      this.score = undefined
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_db_release', 'delete', [Key])
      let id = this.releases.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.releases.splice(id, 1)
      }
    },
    safe_value (Value) {
      return Value === 'undefined' ? '' : Value
    }
  }
}
</script>
