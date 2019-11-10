import Vue from 'vue';
import { getHeader } from './../config'

export const tempController = {
    namespaced: true,
    state: {
      temperature: [],
      cityList: [],
      chosenCityList: [],
    },
    getters: {
      temperature: state => state.temperature,
      cityList: state => state.cityList,
      chosenCityList: state => state.chosenCityList
    },
    mutations: {
      SET_CITY_LIST(state) {
          state.cityList = this.state.cityList;
          console.log(state.cityList)
      },
      SET_CHOSEN_CITY_LIST(state) {
          state.chosenCityList = this.state.chosenCityList;
      },
      SET_TEMPERATURE(state, temperature) {
          state.temperature = temperature;
      },
      ADD_CHOSEN_CITY_LIST(state, payload) {
          state.chosenCityList.push(payload.item);
      },
      REMOVE_CHOSEN_CITY_LIST(state, id) {
        state.chosenCityList.splice(state.chosenCityList.indexOf(_.find(state.chosenCityList, (c) => {
          return c.index == id;
        })), 1);
      }
    },
    actions: {
        setUp:({commit, state}) => {
          commit('SET_CITY_LIST');
          commit('SET_CHOSEN_CITY_LIST');
        },
        temperatureInfo:({commit, state}) => {
          console.log('It works')
        },
        addItem: ({commit, state}, id) => {
          var current_item = _.find(state.cityList, (c) => { return c.index == id; });
          if (!_.find(state.chosenCityList, (c) => { return c.index == current_item.index; })) {
            commit('ADD_CHOSEN_CITY_LIST', {
              chosenCityList: state.chosenCityList,
              item: current_item
            });
            return axios.post("api/temp", { current_item }, {headers: getHeader()})
               .then((data) => {
                 console.log('Yeahh')
                  //return state.userList;
                })
               .catch((err) => {
                 commit('REMOVE_CHOSEN_CITY_LIST', id);
                 console.log(err)
                 throw err;
               });
            }
        },
        removeItem: ({commit, state}, id) => {
          commit('REMOVE_CHOSEN_CITY_LIST', id);
          var current_item = _.find(state.cityList, (c) => { return c.index == id; });
          return axios.delete("api/temp/" + id, {headers: getHeader()})
             .then((data) => {
               console.log('Yeahh')
                //return state.userList;
              })
             .catch((err) => {
               if (!_.find(state.chosenCityList, (c) => { return c.index == current_item.index; })) {
                 commit('ADD_CHOSEN_CITY_LIST', {
                   chosenCityList: state.chosenCityList,
                   item: current_item
                 });
               }
               console.log(err)
               throw err;
             });
        }
    }
}
