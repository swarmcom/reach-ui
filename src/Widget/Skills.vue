<template>
<div class="row">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <div v-for="sk of value" class="form-row" style="margin-top: 5px">
      <div class="col-1">
        <button @click="del(sk.key)" class="btn btn-outline-danger"><icon class="align-middle" name="minus" scale="1"></icon></button>
      </div>
      <div class="col-3">
        <input type="text" class="form-control" v-model="sk.key">
      </div>
      <div class="col">
        <input type="text" class="form-control" v-model="sk.value">
      </div>
    </div>
    <div class="form-row" style="margin-top: 5px">
      <div class="col-1">
        <button @click="add" class="btn btn-outline-secondary"><icon class="align-middle" name="plus" scale="1"></icon></button>
      </div>
      <div class="col-3">
        <input type="text" class="form-control" v-model="k">
      </div>
      <div class="col">
        <input type="text" class="form-control" v-model="v">
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'skills',
  props: ['label', 'value'],
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
