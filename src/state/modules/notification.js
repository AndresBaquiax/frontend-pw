// notification.module.js

export const state = {
    type: null,
    message: null
  };
  
  export const mutations = {
    success(state, message) {
      state.type = 'success';
      state.message = message;
    },
    error(state, message) {
      state.type = 'danger';
      state.message = message;
    },
    clear(state) {
      state.type = null;
      state.message = null;
    }
  };
  
  export const actions = {
    success({ commit }, message) {
      commit('success', message);
    },
    error({ commit }, message) {
      commit('error', message);
    },
    clear({ commit }) {
      commit('clear');
    }
  };
  