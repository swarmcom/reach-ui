<template>
<div class="container">
  <div class="row" style="margin-bottom: 10px"><div class="col"><h3>Tags:</h3></div></div>

  <div v-for="tag of tags" class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="del(tag.id)" class="btn btn-outline-danger pointer"><icon name="minus" scale="1"></icon></button>
    </div>
    <div class="col-3">
      <input type="text" class="form-control"
        :value="safe_value(tag.name)" v-on:change="onChange(tag, 'name', $event.target.value)">
    </div>
    <div class="col-3">
      <input type="text" class="form-control"
        :value="safe_value(tag.value)" v-on:change="onChange(tag, 'value', $event.target.value)">
    </div>
    <div class="col-5">
      <input type="text" class="form-control"
        :value="safe_value(tag.description)" v-on:change="onChange(tag, 'description', $event.target.value)">
    </div>
  </div>

  <div class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="add" class="btn btn-outline-secondary pointer"><icon name="plus" scale="1"></icon></button>
    </div>
    <div class="col-3">
      <input type="text" class="form-control" v-model="name" placeholder="Name">
    </div>
    <div class="col-3">
      <input type="text" class="form-control" v-model="value" placeholder="Value">
    </div>
    <div class="col-5">
      <input type="text" class="form-control" v-model="description" placeholder="Description">
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'admin-tag-entries',
  props: ['id'],
  data () {
    return {
      name: undefined,
      value: undefined,
      description: undefined,
      tags: []
    }
  },
  methods: {
    query: async function () {
      this.tags = await this.$agent.p_mfa('ws_db_tag', 'get', [this.id])
    },
    onChange (tag, field, value) {
      tag[field] = value
      this.$agent.p_mfa('ws_db_tag', 'update', [tag.id, tag])
    },
    add: async function() {
      let tag = await this.$agent.p_mfa('ws_db_tag', 'create', [this.id, {
        name: this.name, value: this.value, description: this.description
      }])
      this.tags.push(tag)
      this.name = undefined
      this.value = undefined
      this.description = undefined
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_db_tag', 'delete', [Key])
      let id = this.tags.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.tags.splice(id, 1)
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
