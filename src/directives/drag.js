function getStyle(dom) {
    return dom.currentStyle || window.getComputedStyle(dom, null);
}

function toggleTransition(dom, bl) {
    if (bl) {
        dom.style.transition = 'all 0.2s ease';
    } else {
        dom.style.transition = 'none';
    }
}

export default {
    bind(el, binding, vnode, oldVnode) {

        //弹框可拉伸最小宽高
        let minWidth = 120;
        let minHeight = 120;

        //初始非全屏
        let isFullScreen = false;

        //当前宽高
        let nowWidth = 0;
        let nowHight = 0;
        let nowTop = 0;
        let nowLeft = 0;

        //当前顶部高度
        // let nowMarginTop = 0;

        //获取弹框头部（这部分可双击全屏）
        const dialogHeaderEl = el.querySelector('.el-dialog__header');

        //弹窗
        const dragDom = el.querySelector('.el-dialog');

        //给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
        dragDom.style.overflow = "auto";

        //清除选择头部文字效果
        //dialogHeaderEl.onselectstart = new Function("return false");

        //头部加上可拖动cursor
        dialogHeaderEl.style.cursor = 'move';

        // 获取样式
        const sty = getStyle(dragDom);

        //移动事件
        let moveDown = (e) => {

            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft;

            const disY = e.clientY - dialogHeaderEl.offsetTop;

            // 获取到的值带px 正则匹配替换
            let styL, styT;

            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (sty.left.includes('%')) {
                styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
                styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
            } else {
                styL = +sty.left.replace(/\px/g, '');
                styT = +sty.top.replace(/\px/g, '');
            };

            document.onmousemove = function (e) {
                toggleTransition(dragDom, false);

                // 通过事件委托，计算移动的距离
                const l = e.clientX - disX;
                const t = e.clientY - disY;

                // 移动当前元素 
                dragDom.style.left = `${l + styL}px`;
                dragDom.style.top = `${t + styT}px`;

                //将此时的位置传出去
                //binding.value({x:e.pageX,y:e.pageY})
            };

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };

        }

        //点击对话框头部,移动对话框
        dialogHeaderEl.onmousedown = moveDown;

        //双击头部全屏效果
        dialogHeaderEl.ondblclick = (e) => {

            //添加缓动
            toggleTransition(dragDom, true);

            //切换成全屏
            if (isFullScreen == false) {

                const { width, height, left, top } = getStyle(dragDom);
                nowTop = top;
                nowLeft = left;
                nowHight = height;
                nowWidth = width;

                dragDom.style.left = 0;

                dragDom.style.top = 0;

                dragDom.style.height = "100VH";

                dragDom.style.width = "100VW";

                dragDom.style.marginTop = 0;

                isFullScreen = true;

                dialogHeaderEl.style.cursor = 'initial';

                //全屏时,禁用点击头部移动对话框事件
                dialogHeaderEl.onmousedown = null;
            }
            //取消全屏
            else {

                dragDom.style.height = nowHight;

                dragDom.style.width = nowWidth;

                dragDom.style.left = nowLeft;

                dragDom.style.top = nowTop;

                // dragDom.style.marginTop = nowMarginTop;

                isFullScreen = false;

                dialogHeaderEl.style.cursor = 'move';

                //取消全屏时,启用点击头部移动对话框
                dialogHeaderEl.onmousedown = moveDown;
            }
        }

        //处理对话框缩放事件移动事件
        dragDom.onmousemove = function (e) {
            toggleTransition(dragDom, false);

            // let moveE = e;

            if (e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 || dragDom.offsetLeft + 10 > e.clientX) {

                dragDom.style.cursor = 'w-resize';

            } else if (el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight - 10) {

                dragDom.style.cursor = 's-resize';

            } else {
                dragDom.style.cursor = 'default';
                dragDom.onmousedown = null;
            }

            dragDom.onmousedown = (e) => {

                const clientX = e.clientX;

                const clientY = e.clientY;

                let elW = dragDom.clientWidth;

                let elH = dragDom.clientHeight;

                let EloffsetLeft = dragDom.offsetLeft;

                let EloffsetTop = dragDom.offsetTop;

                // dragDom.style.userSelect = 'none';

                let ELscrollTop = el.scrollTop;

                //判断点击的位置是不是为头部

                if (clientX > EloffsetLeft && clientX < EloffsetLeft + elW && clientY > EloffsetTop && clientY < EloffsetTop + 100) {

                    //如果是头部在此就不做任何动作，以上有绑定dialogHeaderEl.onmousedown = moveDown;

                } else {

                    document.onmousemove = function (e) {

                        e.preventDefault(); // 移动时禁用默认事件

                        //左侧鼠标拖拽位置

                        if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {

                            //往左拖拽

                            if (clientX > e.clientX) {

                                dragDom.style.width = elW + (clientX - e.clientX) + 'px';

                            }

                            //往右拖拽

                            if (clientX < e.clientX) {

                                if (dragDom.clientWidth < minWidth) {

                                } else {

                                    dragDom.style.width = elW - (e.clientX - clientX) + 'px';

                                }

                            }

                        }

                        //右侧鼠标拖拽位置

                        if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {

                            //往左拖拽

                            if (clientX > e.clientX) {

                                if (dragDom.clientWidth < minWidth) {

                                } else {

                                    dragDom.style.width = elW - (clientX - e.clientX) + 'px';

                                }

                            }

                            //往右拖拽

                            if (clientX < e.clientX) {

                                dragDom.style.width = elW + (e.clientX - clientX) + 'px';

                            }

                        }

                        //底部鼠标拖拽位置

                        if (ELscrollTop + clientY > EloffsetTop + elH - 20 && ELscrollTop + clientY < EloffsetTop + elH) {

                            //往上拖拽

                            if (clientY > e.clientY) {

                                if (dragDom.clientHeight < minHeight) {

                                } else {

                                    dragDom.style.height = elH - (clientY - e.clientY) + 'px';

                                }

                            }

                            //往下拖拽

                            if (clientY < e.clientY) {

                                dragDom.style.height = elH + (e.clientY - clientY) + 'px';

                            }

                        }

                    };

                    //拉伸结束

                    document.onmouseup = function (e) {

                        document.onmousemove = null;

                        document.onmouseup = null;

                    };

                }

            }

        }

    }
}