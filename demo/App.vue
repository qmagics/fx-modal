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
        title: "弹窗" + id,
        component: {
          render: () => {
            return (
              <div>
                <p>AAA</p>
              </div>
            );
          },
          methods: {
            confirm(cb) {
              cb("提交表单");
              return true;
            },
          },
        },
        btns: [
          {
            name: "确认",
            method: "confirm",
            type: "primary",
            size: "small",
            icon: "el-icon-check",
            callback(a) {
              alert(a);
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
.page {
}
</style>