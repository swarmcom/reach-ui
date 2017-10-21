<template>
<div class="form">
  <form-text label="Name" v-model="rec.name"></form-text>
  <form-text label="Description" v-model="rec.description"></form-text>
  <b-row style="margin-bottom: 20px">
    <b-col>
      <div class="codemirror" style="border: 1px solid #eee">
        <!-- codemirror -->
        <codemirror v-model="rec.script" :options="editorOption"></codemirror>
      </div>
    </b-col>
  </b-row>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import Common from './Common'
import Obj from './Object'

require('codemirror/addon/selection/active-line.js')
require('codemirror/addon/scroll/annotatescrollbar.js')
require('codemirror/addon/search/matchesonscrollbar.js')
require('codemirror/addon/search/searchcursor.js')
require('codemirror/addon/search/match-highlighter.js')

export default {
  name: 'admin-prompt',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_lua',
      redirect: '/admin/luas',

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
