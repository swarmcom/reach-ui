<template>
<div class="row">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <div v-for="v of value" class="form-row" style="margin-top: 5px">
      <div class="col-1">
        <button @click="del(v)" class="btn btn-sm btn-outline-danger"><icon class="align-middle" name="minus" scale="1"></icon></button>
      </div>
      <div class="col">
        <input type="text" class="form-control" v-model="v.uri">
      </div>
    </div>
    <div class="form-row" style="margin-top: 5px">
      <div class="col-1">
        <button @click="add" class="btn btn-sm btn-outline-secondary"><icon class="align-middle" name="plus" scale="1"></icon></button>
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
  name: 'uris',
  props: ['label', 'value'],
  data () {
    return {
      v: ''
    }
  },
  methods: {
    add () {
      if (this.v.length > 0) {
        this.value.push({ uri: this.v })
      }
      this.v = ''
    },
    del (Key) {
      let id = this.value.findIndex(Obj => Obj === Key)
      if (id >= 0) {
        this.value.splice(id, 1)
      }
    }
  }
}
</script>
