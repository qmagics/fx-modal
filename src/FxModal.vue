<template>
  <div class="fx-modals">
    <el-dialog
      :custom-class="getCustomClass(modal)"
      v-for="modal in modal_list"
      :key="modal.id"
      :modal="modal.mask"
      top="0"
      :title="modal.title"
      :visible="modal.visible"
      :append-to-body="modal.appendToBody"
      :mask-append-to-body="modal.maskAppendToBody"
      :destroyOnClose="modal.destroyOnClose"
      :closeOnClickModal="modal.closeOnClickMask"
      :fullscreen="modal.fullscreen"
      :before-close="getBeforeClose(modal)"
      :lockScroll="modal.lockScroll"
      @close="onClose(modal)"
      @closed="onClosed(modal)"
      v-drag
      v-initSize="modal"
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
          :size="btn.size"
          :type="btn.type"
          :icon="btn.icon"
          @click="onModalBtnClick(btn,modal)"
        >{{btn.name}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import drag from "./directives/drag";
import initSize from "./directives/initSize";

export default {
  directives: {
    drag,
    initSize,
  },
  data() {
    return {
      // globalDialog: {
      //   title: "Global Dialog",
      //   visible: false,
      // },
    };
  },

  computed: {
    ...mapState({
      modal_list: (state) => state.fxModal.modal_list,
    }),
  },

  methods: {
    getCustomClass(modal) {
      let str = "fx-modal ";
      const { placement = "center", classes } = modal;

      if (classes) {
        str += `${classes} `;
      }

      str += `placement--${placement} `;

      return str;
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
        callback && callback.call();
        return;
      }

      //弹窗内实例组件上下文对象
      const ctx = this.$refs[`modalComponent_${modal.id}`][0];

      if (ctx && ctx[method] && "function" === typeof ctx[method]) {
        const bl = ctx[method].call(null, callback);
        if (bl) {
          this.onClose(modal);
        }
      }
    },
  },

  created() {},
};
</script>

<style src="./style.scss" lang="scss"></style>