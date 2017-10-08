<template>
<div class="container">
  <div v-for="sk of value" class="row">
    <div class="for_group col-1">
      <button @click="del(sk.key)" class="btn btn-outline-danger"><icon name="minus" scale="1"></icon></button>
    </div>
    <div class="form-group col-3">
      <input type="text" class="form-control" v-model="sk.key">
    </div>
    <div class="form-group col">
      <input type="text" class="form-control" v-model="sk.value">
    </div>
  </div>
  <div class="row">
    <div class="form-group col-1">
      <button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
    </div>
    <div class="form-group col-3">
      <input type="text" class="form-control" v-model="k">
    </div>
    <div class="form-group col">
      <input type="text" class="form-control" v-model="v">
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
    }
  }
}
</script>
