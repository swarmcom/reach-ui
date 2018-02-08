<script>
export default {
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa(this.module, 'get', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa(this.module, 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa(this.module, 'create', [this.rec])
        }
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa(this.module, 'delete', [this.id])
        this.$router.go(-1)
      }
    },
    onCancel () {
      this.$router.go(-1)
    },
  },
  created () {
    this.query()
  }
}
</script>
