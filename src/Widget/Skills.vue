<template>
<div class="row">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <skills-list v-if="effective" v-model="value" class="col-5"></skills-list>
  <div v-if="effective" class="col-4">
    <div v-for="sk of effective" class="form-row" style="margin-top: 5px">
      <div class="col-3">
        <input type="text" class="form-control" v-model="sk.key" disabled>
      </div>
      <div class="col">
        <input type="text" class="form-control" v-model="sk.value" disabled>
      </div>
    </div>
  </div>
  <skills-list v-model="value" v-else class="col-9"></skills-list>
</div>
</template>

<script>
import SkillsList from './SkillsList'

export default {
  name: 'skills',
  props: ['label', 'value', 'effective'],
  components: { 'skills-list': SkillsList },
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
