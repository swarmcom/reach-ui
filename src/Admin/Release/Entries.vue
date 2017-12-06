<template>
<div class="container">
  <div class="row" style="margin-bottom: 10px"><div class="col"><h3>Release types:</h3></div></div>

  <div v-for="release of releases" class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="del(release.id)" class="btn btn-outline-danger"><icon name="minus" class="align-middle" scale="1"></icon></button>
    </div>
    <div class="col-4">
      <input type="text" class="form-control"
        :value="safe_value(release.name)" v-on:change="onChange(release, 'name', $event.target.value)">
    </div>
    <div class="col-5">
      <input type="text" class="form-control"
        :value="safe_value(release.description)" v-on:change="onChange(release, 'description', $event.target.value)">
    </div>
    <div class="col-2">
      <input type="text" class="form-control"
        :value="safe_value(release.score)" v-on:change="onChange(release, 'score', $event.target.value)">
    </div>
  </div>

  <div class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="add" class="btn btn-outline-secondary"><icon name="plus" class="align-middle" scale="1"></icon></button>
    </div>
    <div class="col-4">
      <input type="text" class="form-control" v-model="name" placeholder="Name">
    </div>
    <div class="col-5">
      <input type="text" class="form-control" v-model="description" placeholder="Description">
    </div>
    <div class="col-2">
      <input type="text" class="form-control" v-model="score" placeholder="Score">
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'admin-release-entries',
  props: ['id'],
  data () {
    return {
      name: undefined,
      description: undefined,
      score: undefined,
      releases: []
    }
  },
  methods: {
    query: async function () {
      this.releases = await this.$agent.p_mfa('ws_db_release', 'get', [this.id])
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
  },
  created () {
    this.query()
  }
}
</script>
