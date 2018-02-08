<template>
<div class="form">
  <form-text label="Lua Name" v-model="rec.name"></form-text>
  <form-text label="Lua Description" v-model="rec.description"></form-text>
  <b-row style="margin-top: 5px">
    <b-col>
      <div class="codemirror" style="border: 1px solid #eee">
        <!-- codemirror -->
        <codemirror v-model="rec.script" :options="editorOption"></codemirror>
      </div>
    </b-col>
  </b-row>
  <div style="margin-top: 20px">
    <button @click="onCommit" class="btn btn-primary pointer">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary pointer">Cancel</button>
    <button @click="onDelete" class="btn btn-danger float-right pointer">Delete</button>
  </div>
  <help></help>
</div>
</template>

<script>
import Vue from 'vue'
import VueCodeMirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import Common from '@/Admin/Common'
import Obj from '@/Admin/Object'

Vue.use(VueCodeMirror)

require('codemirror/addon/selection/active-line.js')
require('codemirror/addon/scroll/annotatescrollbar.js')
require('codemirror/addon/search/matchesonscrollbar.js')
require('codemirror/addon/search/searchcursor.js')
require('codemirror/addon/search/match-highlighter.js')

export default {
  name: 'admin-lua',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_lua'

      editorOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/x-lua',
        theme: 'default'
      }
    }
  },
}
</script>
