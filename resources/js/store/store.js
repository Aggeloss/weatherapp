import Vue from 'vue';
import Vuex from 'vuex';
import { cityController } from './../modules/cityController';
import { tempController } from './../modules/tempController';

Vue.use(Vuex);

export const store = new Vuex.Store({
    strict: true, //process.env.NODE_ENV !== 'production',
    modules: {
      cityController,
    }
})
