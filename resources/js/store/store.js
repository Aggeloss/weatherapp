import Vue from 'vue';
import Vuex from 'vuex';
import { cityController } from './../modules/cityController';

Vue.use(Vuex);

export const store = new Vuex.Store({
    strict: true, //process.env.NODE_ENV !== 'production',
    modules: {
      cityController,
    }
})
