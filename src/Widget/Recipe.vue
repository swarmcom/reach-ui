<template>
<div class="form-group row">
  <label :for="id" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
  </div>
</div>
</template>

<script>
export default {
  name: 'recipe',
  props: ['id', 'label', 'value'],
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