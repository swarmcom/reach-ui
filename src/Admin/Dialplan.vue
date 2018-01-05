<template>
<b-container>
  <b-row style="margin-bottom: 10px">
    <b-col><h3>Inbound routing:</h3></b-col>
  </b-row>

  <b-form-row v-for="dial of entries" :key="dial.id" style="margin-top: 5px">
    <b-col cols=2>
      <button @click="del(dial.id)" class="btn btn-sm btn-outline-danger">
        <icon class="align-middle" name="minus" scale="1"></icon>
      </button>
      <button @click="up(dial.id)" class="btn btn-sm btn-outline-success">
        <icon class="align-middle" name="arrow-up" scale="1"></icon>
      </button>
      <button @click="down(dial.id)" class="btn btn-sm btn-outline-primary">
        <icon class="align-middle" name="arrow-down" scale="1"></icon>
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
    <b-col cols=2>
      <button @click="add" class="btn btn-sm btn-outline-secondary">
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

  <b-row style="margin-top: 20px">
    <b-col>
Add, Delete or reorder inbound routing pattern matches. Each pattern can be added to try to match the destination number of the offered call or to try to match some specific part of the caller's information. The pattern to match is standard regex capable. So, the pattern could be something as simple as a static number like 21005 or could be as complex as a full regex pattern such as [2-9]1. The routing entries here will be searched top to bottom until a match is found. Once a match is found, the inbound call will be sent to the specified line.
    </b-col>
  </b-row>

</b-container>
</template>

<script>
import LineIns from '@/Widget/LineIns'

export default {
  name: 'admin-dialplan',
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
      entries: []
    }
  },
  methods: {
    query: async function () {
      this.entries = await this.$agent.p_mfa('ws_db_dial', 'get')
    },
    onChange (dial) {
      this.$agent.p_mfa('ws_db_dial', 'update', [dial.id, dial])
    },
    up: async function (id) {
      this.entries = await this.$agent.p_mfa('ws_db_dial', 'up', [id])
    },
    down: async function (id) {
      this.entries = await this.$agent.p_mfa('ws_db_dial', 'down', [id])
    },
    add: async function() {
      let dial = await this.$agent.p_mfa('ws_db_dial', 'create', [{ match: this.match, line_in_id: this.line_id, header: this.header }])
      this.entries.push(dial)
      this.match = ''
      this.line_id = ''
      this.header = ''
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_db_dial', 'delete', [Key])
      let id = this.entries.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.entries.splice(id, 1)
      }
    }
  },
  created () {
    this.query()
  },
}
</script>
