<template>
  <div class="container">
    <div
      v-for="sk of value"
      :key="sk.key"
      class="row"
      style="margin-top: 5px"
    >
      <div class="col-1">
        <button
          class="btn btn-sm btn-outline-danger"
          @click="del(sk.key)"
        >
          <icon
            class="align-middle"
            name="minus"
            scale="1"
          />
        </button>
      </div>
      <div class="col-3">
        <input
          v-model="sk.key"
          type="text"
          class="form-control form-control-sm"
        >
      </div>
      <div class="col">
        <input
          v-model="sk.value"
          type="text"
          class="form-control form-control-sm"
        >
      </div>
    </div>

    <div
      class="row"
      style="margin-top: 5px"
    >
      <div class="col-1">
        <button
          class="btn btn-sm btn-outline-secondary"
          @click="add"
        >
          <icon
            class="align-middle"
            name="plus"
            scale="1"
          />
        </button>
      </div>
      <div class="col-3">
        <input
          v-model="k"
          type="text"
          class="form-control form-control-sm"
        >
      </div>
      <div class="col">
        <input
          v-model="v"
          type="text"
          class="form-control form-control-sm"
        >
      </div>
    </div>

    <div
      class="row"
      style="margin-top: 10px"
    >
      <div class="col">
        <button
          class="btn btn-sm btn-primary float-right pointer"
          @click="commit"
        >
          Commit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Skills',
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
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
