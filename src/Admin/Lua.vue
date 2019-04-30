<template>
  <div class="form">
    <form-text
      v-model="rec.name"
      label="Lua Name"
    />
    <form-text
      v-model="rec.description"
      label="Lua Description"
    />
    <b-row style="margin-top: 5px">
      <b-col>
        <div
          class="codemirror"
          style="border: 1px solid #eee"
        >
          <!-- codemirror -->
          <codemirror
            v-model="rec.script"
            :options="editorOption"
          />
        </div>
      </b-col>
    </b-row>
    <div style="margin-top: 20px">
      <b-btn
        class="btn btn-primary pointer"
        variant="primary"
        @click="onCommit"
      >
        Commit
      </b-btn>
      <b-btn
        class="pointer"
        variant="outline-primary"
        @click="onCancel"
      >
        Cancel
      </b-btn>
      <b-btn
        class="float-right pointer"
        variant="danger"
        @click="onDelete"
      >
        Delete
      </b-btn>
    </div>
    <help />
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
  name: 'AdminLua',
  mixins: [Common, Obj],
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      rec: {},
      module: 'ws_db_lua',
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
