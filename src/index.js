import FxModal from './FxModal.vue';

function getModalByIndex(index, state) {
    return state.modal_list[index] || null;
}

function getIndexById(id, state) {
    return state.modal_list.findIndex(m => m.id === id);
}

function getIndexByModal(modal, state) {
    return state.modal_list.findIndex(m => modal === m);
}

FxModal.install = (Vue, opt = {}) => {
    Vue.component(FxModal.name || 'FxModal', FxModal);

    let { store } = opt,
        startModalId = 0;

    try {
        store.registerModule('fxModal', {
            namespaced: true,
            state: {
                modal_list: []
            },
            mutations: {
                ADD_MODAL(state, modal) {
                    state.modal_list.push(modal);
                },

                UPDATE_MODAL(state, { modal, index }) {

                    const oldModal = state.modal_list[index];

                    for (const key in oldModal) {
                        oldModal[key] = modal[key];
                    }
                },

                DELETE_MODAL(state, index) {
                    state.modal_list.splice(index, 1);
                },

                DELETE_ALL_MODAL(state) {
                    state.modal_list = [];
                },

                SET_COMPONENT(state, { index, component }) {
                    const modal = getModalByIndex(index, state);

                    if (modal) {
                        modal.component = component;
                    }
                },

                SET_DATA(state, { index, data }) {
                    const modal = getModalByIndex(index, state);

                    if (modal) {
                        modal.data = data;
                    }
                },

                SET_TITLE(state, { index, title }) {
                    const modal = getModalByIndex(index, state);

                    if (modal) {
                        modal.title = title;
                    }
                },

                SET_VISIBLE(state, { index, visible }) {
                    const modal = getModalByIndex(index, state);

                    if (modal) {
                        modal.visible = visible;
                    }
                },

                SET_ACTIONS(state, { index, actions }) {
                    const modal = getModalByIndex(index, state);

                    if (modal) {
                        modal.actions = actions;
                    }
                }
            },
            actions: {
                add({
                    commit,
                    state
                }, modal) {
                    //id相同的modal的索引
                    const sameIndex = state.modal_list.findIndex(i => i.id === modal.id);

                    //如果存在相同，则更新
                    if (sameIndex < 0) {
                        commit('ADD_MODAL', modal);
                    }
                    //否则，添加modal
                    else {
                        if (modal.openImmediately === true) {
                            modal.visible = true;
                        }

                        commit('UPDATE_MODAL', { modal, index: sameIndex });
                    }
                },

                open({
                    commit,
                    state
                }, modal) {
                    const index = getIndexByModal(modal, state);
                    commit('SET_VISIBLE', {
                        index,
                        visible: true
                    });
                },

                close({
                    commit,
                    state
                }, modalId) {
                    const index = getIndexById(modalId, state);

                    if (index >= 0) {
                        commit('SET_VISIBLE', {
                            index,
                            visible: false
                        });
                    }
                },

                remove({
                    commit,
                    state
                }, modalId) {
                    const index = getIndexById(modalId, state);

                    if (index >= 0) {
                        commit('SET_COMPONENT', {
                            index,
                            component: null
                        });
                        commit('SET_TITLE', {
                            index,
                            title: null
                        });
                        commit('SET_ACTIONS', {
                            index,
                            actions: []
                        });
                        commit('SET_DATA', {
                            index,
                            data: null
                        });
                        commit('DELETE_MODAL', index);
                    }
                },

                removeAll({ commit }) {
                    commit('DELETE_ALL_MODAL');
                }
            }
        })
    } catch (error) {
        throw new Error('store不是[Vuex.Store]的实例', error);
    }

    if (!store) {
        throw new Error('必须提供store才能初始化FxModal')
    }

    /**
     * 打开一个modal
     * @param {object} options --弹窗配置项
     * @param {object} thisArg --回调函数this指向对象
     * @returns {object} 可操作对象
     */
    Vue.prototype.$modal = (options, thisArg) => {

        let { component, data, title, id, width, placement, actions, btns, beforeClose, open = true } = options;

        //将回调函数的this指向绑定至调用方指定的对象上
        if (thisArg) {
            if (beforeClose) {
                beforeClose = beforeClose.bind(thisArg);
            }

            if (actions) {
                let newActions = {};

                for (let fnName in actions) {
                    let fn = actions[fnName];
                    newActions[fnName] = fn.bind(thisArg);
                }

                actions = newActions;
            }
        }

        //store:fxModal/modal_list中存放的modal实体对象
        const modal = {
            id: id || startModalId++,
            component,
            data,
            title,
            width,
            placement,
            visible: false,
            openImmediately: open,
            actions,
            btns,
            beforeClose,
        }

        //添加modal到store
        store.dispatch('fxModal/add', modal);

        //打开modal(直接将modal的visible赋值为true的话,无法触发el-dialog的打开动画,体验稍差,因此在nextTick中open)
        if (open === true) {
            Vue.nextTick(() => {
                store.dispatch('fxModal/open', modal);
            });
        }

        //返回可操作对象
        return {
            instance: modal,

            close() {
                store.dispatch('fxModal/close', modal.id);
            },

            open() {
                store.dispatch('fxModal/open', modal);
            }
        };
    }

    /**
      * 关闭modal
      * @param modal 弹窗对象实例或者弹窗id
      */
    Vue.prototype.$modal.close = (modal) => {
        modal = (typeof modal === 'object' && modal.instance) ? modal.instance.id : modal;

        store.dispatch('fxModal/close', modal);
    }

    /**
     * 关闭所有modal
     */
    Vue.prototype.$modal.closeAll = () => {
        store.dispatch('fxModal/removeAll')
    }

    /**
     * 根据id获取modal对象
     * @param {any} id 
     */
    Vue.prototype.$modal.get = (id) => {

        const modal = store.state.modal.modal_list.find(m => m.id === id);

        return modal ? {
            instance: modal,
            close: function () {
                store.dispatch('fxModal/close', modal.id)
            }
        } : null;
    }
}

export default FxModal;