<template>
  <b-row>
    <b-col cols="3">
      <label
        :id="label"
      >
        {{ label }}
      </label>
    </b-col>
    <b-col cols="9">
      <div
        v-for="(itemValue, index) of value"
        :key="index"
        class="form-row"
        style="margin-top: 5px"
      >
        <b-col>
          <b-input-group>
            <b-input-group-prepend>
              <b-btn
                size="sm"
                variant="outline-danger"
                @click="del(itemValue)"
              >
                <icon
                  class="align-middle"
                  name="minus"
                  scale="1"
                />
              </b-btn>
            </b-input-group-prepend>
            <b-form-input
              v-model="itemValue.uri"
              type="text"
            />
          </b-input-group>
        </b-col>
      </div>
      <b-row style="margin-top: 5px">
        <b-col>
          <b-input-group>
            <b-input-group-prepend>
              <b-btn
                size="sm"
                variant="outline-secondary"
                @click="add"
              >
                <icon
                  class="align-middle"
                  name="plus"
                  scale="1"
                />
              </b-btn>
            </b-input-group-prepend>
            <b-form-input
              v-model="v"
              type="text"
            />
          </b-input-group>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'Uris',
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: Array,
      default: () => ([]) 
    }
  },
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
