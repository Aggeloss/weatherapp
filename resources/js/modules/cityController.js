import Vue from 'vue';
import { getHeader } from './../config'

export const cityController = {
    namespaced: true,
    state: {
      triggered: false,
      cityList: [],
      chosenCityList: [],
    },
    getters: {
      triggered: state => state.triggered,
      cityList: state => state.cityList,
      chosenCityList: state => state.chosenCityList
    },
    mutations: {
      SET_TRIGGERED(state, bool) {
        state.triggered = bool;
      },
      SET_CITY_LIST(state, cityList) {
        state.cityList = cityList;
      },
      SET_CHOSEN_CITY_LIST(state, chosenCityList) {
        state.chosenCityList = chosenCityList;
      },
      SET_TEMPERATURES(state, payload) {
        payload.city.min_temp = Math.round(payload.data.body.main.temp-273);
        payload.city.max_temp = Math.round(payload.data.body.main.temp-273);
        payload.city.avg_temp = Math.round(payload.data.body.main.temp-273);
        payload.city.last_temp = Math.round(payload.data.body.main.temp-273);

        var index = state.chosenCityList.indexOf(_.find(state.chosenCityList, (c) => { return c.id == payload.city.id }));

        Vue.set(state.chosenCityList, index, payload.city);
      },
      SET_NOT_FOUND(state, city) {
        city.min_temp = null;
        city.max_temp = null;
        city.avg_temp = null;
        city.last_temp = null;

        axios.post("api/temp", {city}, {headers: getHeader()})
               .then(() => {
                 //
                })
               .catch((err) => {
                 console.log(err)
                 throw err;
               });
      },
      ADD_CHOSEN_CITY_LIST(state, payload) {
        payload.item['min_temp'] = null;
        payload.item['max_temp'] = null;
        payload.item['avg_temp'] = null;
        payload.item['last_temp'] = null;
        state.chosenCityList.push(payload.item);
      },
      REMOVE_CHOSEN_CITY_LIST(state, id) {
        state.chosenCityList.splice(state.chosenCityList.indexOf(_.find(state.chosenCityList, (c) => {
          return c.id == id;
        })), 1);
      }
    },
    actions: {
        temperatureInfo: ({commit, dispatch, state}, payload) => {
          commit('SET_TRIGGERED', true);
          _.forEach(payload.chosenCities, function(city) {
            payload.http.get('https://api.openweathermap.org/data/2.5/weather?q=' + city.capital + ',' + city.alpha2Code + '&APPID=6e70b86f745e5e3964cd165349029ec9', {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                  })
                  .then((data) => {
                    if(data.status !== 404) {
                        var payload = { city: city, data: data }
                        commit('SET_TEMPERATURES', payload);
                    }
                  })
                  .then(() => {
                    console.log(city);
                    axios.post("api/temp", {city}, {headers: getHeader()})
                           .then(() => {
                             //
                            })
                           .catch((err) => {
                             console.log(err)
                             throw err;
                           });
                  })
                  .then(() => {
                    if (state.chosenCityList[state.chosenCityList.length-1] === city) {
                      commit('SET_TRIGGERED', false);
                      dispatch('loadChosenCities');
                    }
                  })
                  .catch((err) => {
                     commit('SET_NOT_FOUND', city);
                     if (state.chosenCityList[state.chosenCityList.length-1] === city) {
                       commit('SET_TRIGGERED', false);
                       dispatch('loadChosenCities');
                     }
                     console.log(err)
                     throw err;
                 });
              });
        },
        loadCities: ({commit, state}, http) => {
          return http.get("https://restcountries.eu/rest/v2/all", {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
              })
              .then((data) => {
                 var counter = 1;
                 var temp_cities = [];
                 _.forEach(data.data, function(value) {
                   if (value['capital'] != "") {
                     value['timezone'] = value['timezones'][0];
                     value['id'] = counter;
                     temp_cities.push(value);
                     counter+=1;
                   }
                 });
                 commit('SET_CITY_LIST', temp_cities);
              })
              .catch((err) => {
                 console.log(err)
                 throw err;
             });
        },
        loadChosenCities: ({commit, state}) => {
          return axios.get("api/temp", {headers: getHeader()})
              .then((data) => {
                var temp_chosen_cities = [];
                var temp_temperatures = [];
                _.forEach(data.data, function(value) {
                    console.log(value)
                    value['id'] = value['index'];
                    delete value.index;
                    temp_chosen_cities.push(value);
                });
                commit('SET_CHOSEN_CITY_LIST', temp_chosen_cities);
              })
              .catch((err) => {
                console.log(err)
                throw err;
              })
        },
        sendCitiesToDB: ({commit, state}) => {
          var list = state.cityList;
          return axios.post("api/city", { list }, {headers: getHeader()})
              .then(() => {
                //
              })
              .catch((err) => {
                console.log(err)
                throw err;
              });
        },
        loadCitiesFromDB: ({commit, state}) => {
          return axios.get("api/city", {headers: getHeader()})
              .then((data) => {
                commit('SET_CITY_LIST', data.data);
              })
              .catch((err) => {
                console.log(err)
                throw err;
              })
        },
        addItem: ({commit, state}, id) => {
          var current_item = _.find(state.cityList, (c) => { return c.id == id; });
          if (!_.find(state.chosenCityList, (c) => { return c.id == current_item.id; })) {
            commit('ADD_CHOSEN_CITY_LIST', {
              chosenCityList: state.chosenCityList,
              item: current_item
            });
            return axios.post("api/temp", { current_item }, {headers: getHeader()})
               .then(() => {
                  //...
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
          var current_item = _.find(state.cityList, (c) => { return c.id == id; });
          console.log(_.find(state.cityList, (c) => { return c.id == id; }));
          return axios.delete("api/temp/" + id, {headers: getHeader()})
             .then((data) => {
                //...
              })
             .catch((err) => {
               if (!_.find(state.chosenCityList, (c) => { return c.id == current_item.id; })) {
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
