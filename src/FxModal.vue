<template>
  <div class="fx-modals">
    <el-dialog
      :custom-class="'fx-modal'"
      v-for="modal in modal_list"
      :key="modal.id"
      :modal="modal.mask"
      :title="modal.title"
      :visible="modal.visible"
      :width="getModalWidth(modal)"
      :before-close="getBeforeClose(modal)"
      @close="onClose(modal)"
      @closed="onClosed(modal)"
    >
      <div class="fx-modal__body">
        <component
          :ref="'modalComponent_'+modal.id"
          :is="modal.component"
          v-bind="modal.data"
          v-on="modal.actions"
        ></component>
      </div>

      <div class="fx-modal__footer" slot="footer" v-if="modal.btns && modal.btns.length">
        <el-button
          v-for="(btn,index) in modal.btns"
          :key="index"
          size="mini"
          :type="btn.type"
          @click="onModalBtnClick(btn,modal)"
        >{{btn.name}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      globalDialog: {
        title: "Global Dialog",
        visible: false,
      },
    };
  },

  computed: {
    ...mapState({
      modal_list: (state) => state.fxModal.modal_list,
    }),
  },

  methods: {
    getModalWidth(modal) {
      const { width, placement } = modal;
      if (width) {
        return width;
      } else {
        if (placement === "top-right") {
          return "25vw";
        } else if (placement === "center") {
          return "45vw";
        } else {
          return "45vw";
        }
      }
    },

    onClose(modal) {
      this.$store.dispatch("fxModal/close", modal.id);
    },

    onClosed(modal) {
      this.$store.dispatch("fxModal/remove", modal.id);
    },

    getBeforeClose(modal) {
      const _this = this;
      return function (done) {
        if (!modal.beforeClose) {
          done();
        } else {
          modal.beforeClose(done, _this.$refs[`modalComponent_${modal.id}`][0]);
        }
      };
    },

    //弹窗按钮点击
    onModalBtnClick(btn, modal) {
      const { method, callback } = btn;

      if (!method) {
        this.onClose(modal);
        return;
      }

      //弹窗内实例组件上下文对象
      const ctx = this.$refs[`modalComponent_${modal.id}`][0];

      ctx && ctx[method] && ctx[method].call(null, callback);
    },
  },

  created() {},
};
</script>

<style src="./style.scss" lang="scss" scoped></style>