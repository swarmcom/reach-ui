<template>
<div>
  <h3>System-wide parameters</h3>
  <div v-for="param of params" class="form-row">
    <div class="for_group col-1">
      <button @click="del(param.key)" class="btn btn-outline-danger"><icon name="minus" scale="1"></icon></button>
    </div>
    <div class="form-group col-3">
      <input type="text" class="form-control" v-model="param.key">
    </div>
    <div class="form-group col">
      <input type="text" class="form-control" v-model="param.value">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group col-1">
      <button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
    </div>
    <div class="form-group col-3">
      <input type="text" class="form-control" v-model="name">
    </div>
    <div class="form-group col">
      <input type="text" class="form-control" v-model="value">
    </div>
  </div>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
</div>
</template>

<script>
function object2list(Obj) {
  return Object.keys(Obj).map( K => { return { "key": K, "value": Obj[K] } } )
}

function list2object(List) {
  let Re = {}
  List.forEach(Obj => Re[Obj.key] = Obj.value)
  return Re
}

export default {
  name: 'admin-params',
  data () {
    return {
      params: [],
      name: '',
      value: ''
    }
  },
  methods: {
    query () {
      this.$agent.get_params(Obj => this.params = object2list(Obj.reply))
    },
    add () {
      this.params.push({ key: this.name, value: this.value })
      this.name = ''
      this.value = ''
    },
    del (Key) {
      let id = this.params.findIndex(Obj => Obj.key === Key)
      if (id >= 0) {
        this.params.splice(id, 1)
      }
    },
    onCommit () {
      let Params = list2object(this.params)
      this.$agent.set_params(Params, (Re) => this.handleCommit(Re))
    },
    handleCommit (Re) {
      if (Re.reply === 'ok') {
        this.$notify({ title: 'Success:', text: 'Parameters updated.', type: 'success' });
      } else {
        this.$notify({ title: 'Error:', text: Re.error, type: 'error' });
      }
    }
  },
  created () {
    this.query()
  }
}
</script>