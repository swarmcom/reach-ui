<template>
  <div>
    <div
      v-for="sk of value"
      :key="sk"
      class="form-row"
      style="margin-top: 5px"
    >
      <div class="col-2">
        <button
          class="btn btn-outline-danger pointer"
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
          class="form-control"
        >
      </div>
      <div class="col">
        <input
          v-model="sk.value"
          type="text"
          class="form-control"
        >
      </div>
    </div>
    <div
      class="form-row"
      style="margin-top: 5px"
    >
      <div class="col-2">
        <button
          class="btn btn-outline-secondary pointer"
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
          class="form-control"
        >
      </div>
      <div class="col">
        <input
          v-model="v"
          type="text"
          class="form-control"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkillsList',
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
    }
  }
}
</script>
