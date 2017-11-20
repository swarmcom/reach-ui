<template>
<b-container>
  <b-row style="margin-bottom: 10px">
    <b-col><h3>Dialplan:</h3></b-col>
  </b-row>

  <b-form-row v-for="dial of dials" :key="this.id" style="margin-top: 5px">
    <b-col cols=1>
      <button @click="del(dial.id)" class="btn btn-outline-danger pointer">
        <icon class="align-middle" name="minus" scale="1"></icon>
      </button>
    </b-col>
    <b-col cols=3>
      <select class="custom-select" v-model="dial.header" v-on:change="onChange(dial)">
        <option></option>
        <option v-for="header in headers" :value="header" :selected="header == dial.header">{{ header }}</option>
      </select>
    </b-col>
    <b-col cols=5>
      <input type="text" class="form-control" v-model="dial.match" placeholder="Regex" v-on:change="onChange(dial)">
    </b-col>
    <b-col>
      <lines v-model="dial.line_in_id" v-on:input="onChange(dial)"></lines>
    </b-col>
  </b-form-row>

  <b-form-row style="margin-top: 5px">
    <b-col cols=1>
      <button @click="add" class="btn btn-outline-secondary pointer">
        <icon name="plus" scale="1" class="align-middle"></icon>
      </button>
    </b-col>
    <b-col cols=3>
      <select class="custom-select" v-model="header">
        <option></option>
        <option v-for="header in headers" :value="header">{{ header }}</option>
      </select>
    </b-col>
    <b-col cols=5>
      <input type="text" class="form-control" v-model="match" placeholder="Regex">
    </b-col>
    <b-col>
      <lines v-model="line_id"></lines>
    </b-col>
  </b-form-row>
</b-container>
</template>

<script>
import LineIns from '../Widget/LineIns.vue'

export default {
  name: 'admin-dials',
  components: {
    lines: LineIns
  },
  data () {
    return {
      headers: [
        'Caller-Destination-Number',
        'Caller-Caller-ID-Number',
        'Caller-ANI',
        'Caller-Username',
      ],
      match: undefined,
      line_id: undefined,
      header: undefined,
      dials: []
    }
  },
  methods: {
    query: async function () {
      this.dials = await this.$agent.p_mfa('ws_db_dial', 'get')
    },
    onChange (dial) {
      this.$agent.p_mfa('ws_db_dial', 'update', [dial.id, dial])
    },
    add: async function() {
      let dial = await this.$agent.p_mfa('ws_db_dial', 'create', [{ match: this.match, line_in_id: this.line_id, header: this.header }])
      this.dials.push(dial)
      this.match = ''
      this.line_id = ''
      this.header = ''
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_db_dial', 'delete', [Key])
      let id = this.dials.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.dials.splice(id, 1)
      }
    }
  },
  created () {
    this.query()
  },
}
</script>
