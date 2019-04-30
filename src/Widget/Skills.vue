<template>
  <b-row>
    <b-col cols="3">
      <label
        :id="label"
      >
        {{ label }}
      </label>
    </b-col>
    <b-col
      v-if="effective"
      cols="5"
    >
      <skills-list
        v-model="value"
      />
    </b-col>
    <b-col
      v-if="effective"
      cols="4"
    >
      <div
        v-for="sk of effective"
        :key="sk"
        class="form-row"
        style="margin-top: 5px"
      >
        <b-col cols="3">
          <input
            v-model="sk.key"
            type="text"
            class="form-control"
            disabled
          >
        </b-col>
        <b-col>
          <input
            v-model="sk.value"
            type="text"
            class="form-control"
            disabled
          >
        </b-col>
      </div>
    </b-col>
    <b-col
      v-else
      cols="9"
    >
      <skills-list
        v-model="value"
      />
    </b-col>
  </b-row>
</template>

<script>
import SkillsList from '@/Widget/SkillsList'

export default {
  name: 'Skills',
  components: { 'skills-list': SkillsList },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    label: {
      type: String,
      default: ""
    },
    effective: {
      type: Boolean,
      default: false
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
