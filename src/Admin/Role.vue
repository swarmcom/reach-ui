<template>
  <div style="margin-top:20px">
    <b-row>
      <b-col cols="4">
        <h3>Role:</h3>
      </b-col>
    </b-row>
    <div class="form">
      <form-text
        id="name"
        v-model="rec.name"
        label="Role Name"
      />
      <form-text
        id="description"
        v-model="rec.description"
        label="Role Description"
      />
      <b-row 
        style="margin-top: 5px"
      >
        <label
          id="UI Variant"
          class="col-3 col-form-label"
        >
          Profile Type
        </label>
        <b-col cols="9">
          <select
            v-model="rec.ui"
            class="custom-select"
            :disabled="rec.ui==='admin'"
          >
            <option
              v-for="ui in uis"
              :key="ui"
              :value="ui"
              :selected="ui == rec.ui"
            >
              {{ ui }}
            </option>
          </select>
        </b-col>
      </b-row>
    </div>

    <b-row
      style="margin-top: 20px"
    >
      <b-col>
        <b-btn
          class="pointer"
          variant="primary"
          @click="onCommit"
        >
          Save
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
          :disabled="rec.ui==='admin'"
        >
          Delete
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Obj from '@/Admin/Object'
import Common from '@/Admin/Common'

export default {
  name: 'AdminRole',
  mixins: [Common, Obj],
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      rec: {
        ui: 'agent'
      },
      uis: ['agent', 'supervisor'], // this list must correspond to main.js role components
      module: 'ws_db_role'
    }
  },
}
</script>
