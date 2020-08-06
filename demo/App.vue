<template>
  <div class="page">
    <FxModal />

    <el-button @click="openModal('A')">openModal</el-button>
    <el-button @click="openModal('B')">openModal</el-button>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";

export default {
  methods: {
    openModal(id) {
      this.$modal({
        id,
        title: "Modal_" + id,
        component: {
          render: () => <div>AAA</div>,
        },
        btns: [],
      });
    },
  },
};
</script>

<style lang="scss">
.page {
}
</style>