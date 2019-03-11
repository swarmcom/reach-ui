<template>
<b-row>
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <b-col cols=9>
    <div v-for="(v, index) of value" :key=index class="form-row" style="margin-top: 5px">
      <b-col>
        <b-input-group>
          <b-input-group-prepend>
            <b-btn @click="del(v)" size="sm" variant="outline-danger"><icon class="align-middle" name="minus" scale="1"></icon></b-btn>
          </b-input-group-prepend>
          <b-form-input type="text" v-model="v.uri"></b-form-input>
        </b-input-group>
      </b-col>
    </div>
    <b-row style="margin-top: 5px">
      <b-col>
        <b-input-group>
          <b-input-group-prepend>
            <b-btn @click="add" size="sm" variant="outline-secondary"><icon class="align-middle" name="plus" scale="1"></icon></b-btn>
          </b-input-group-prepend>
          <b-form-input type="text" v-model="v"></b-form-input>
        </b-input-group>
      </b-col>
    </b-row>
  </b-col>
</b-row>
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
