<template>
<div class="container">

  <div v-for="sk of value" class="row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="del(sk.key)" class="btn btn-sm btn-outline-danger"><icon class="align-middle" name="minus" scale="1"></icon></button>
    </div>
    <div class="col-3">
      <input type="text" class="form-control form-control-sm" v-model="sk.key">
    </div>
    <div class="col">
      <input type="text" class="form-control form-control-sm" v-model="sk.value">
    </div>
  </div>

  <div class="row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="add" class="btn btn-sm btn-outline-secondary"><icon class="align-middle" name="plus" scale="1"></icon></button>
    </div>
    <div class="col-3">
      <input type="text" class="form-control form-control-sm" v-model="k">
    </div>
    <div class="col">
      <input type="text" class="form-control form-control-sm" v-model="v">
    </div>
  </div>

  <div class="row" style="margin-top: 10px">
    <div class="col">
      <button @click="commit" class="btn btn-sm btn-primary float-right">Commit</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'skills',
  props: ['value'],
  data () {
    return {
      k: '',
      v: ''
    }
  },
  methods: {
    add () {
      this.value.push({ key: this.k, value: this.v })
      this.k = ''
      this.v = ''
    },
    del (Key) {
      let id = this.value.findIndex(Obj => Obj.key === Key)
      if (id >= 0) {
        this.value.splice(id, 1)
      }
    },
    commit () {
      this.$emit('input', this.value)
    }
  }
}
</script>
