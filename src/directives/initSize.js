export default {
    bind(el, binding, vnode, oldVnode) {
        const bodyH = document.body.clientHeight;
        const bodyW = document.body.clientWidth;
        let { placement, height, width } = binding.value;

        if (typeof height === "string" && height.includes("%")) {
            height = bodyH * (+height.replace(/\%/g, "") / 100);
        }
        if (typeof width === "string" && width.includes("%")) {
            width = bodyW * (+width.replace(/\%/g, "") / 100);
        }

        if (width > bodyW) {
            width = bodyW;
        }

        const modalEl = el.querySelector(".el-dialog");
        modalEl.style.width = width + "px";
        modalEl.style.height = height + "px";

        let top = "5vh";
        let left = (bodyW - width) / 2 + "px";

        if (placement === "center") {
            if (height) {
                top = (bodyH - height) / 2 + "px";
            }
        }

        modalEl.style.left = left;
        modalEl.style.top = top;
    },
}