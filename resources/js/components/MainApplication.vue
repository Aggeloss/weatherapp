<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">My Chosen Cities</div>

                    <div class="card-body table-responsive p-0">
                      <table class="table table-hover" style="margin: 0px !important">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Alpha-2 Code</th>
                            <th>Capital</th>
                            <th>Timezone</th>
                            <th>Min Temperature</th>
                            <th>Max Temperature</th>
                            <th>Avg Temperature</th>
                            <th>Last Temperature</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="city in chosenCityList">
                            <td>{{ city.index || city.id }}</td>
                            <td>{{ city.name }}</td>
                            <td>{{ city.alpha2Code }}</td>
                            <td>{{ city.capital }}</td>
                            <td>{{ city.timezone || city.timezones[0] }}</td>
                            <td style="text-align:center" v-if="city.min_temp === null || city.min_temp === undefined">-</td>
                            <td style="text-align:center" v-else>{{ city.min_temp }}°C</td>
                            <td style="text-align:center" v-if="city.max_temp === null || city.max_temp === undefined">-</td>
                            <td style="text-align:center" v-else>{{ city.max_temp }}°C</td>
                            <td style="text-align:center" v-if="city.avg_temp === null || city.avg_temp === undefined">-</td>
                            <td style="text-align:center" v-else>{{ city.avg_temp }}°C</td>
                            <td style="text-align:center" v-if="city.last_temp === null || city.last_temp === undefined">-</td>
                            <td style="text-align:center" v-else>{{ city.last_temp }}°C</td>
                            <td>
                              <a href="" v-on:click.stop.prevent="removeItem(city.id)" style="padding: 0px 15px; color: red;">
                                <i class="fas fa-times"></i>
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div class="card-footer" style="padding: 7px 10px;">
                      <button type="submit" class="btn btn-primary" :disabled="!!triggered" style="float:right; padding: 5px 7px;" @click.prevent="tempInfo({http: http, chosenCities: chosenCityList})">Temperature Check</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="padding-top:50px">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header" style="background-color: #fff">
                <h3 class="card-title">Cities List</h3>

                <!-- <div class="card-tools">
                  <button class="btn btn-default" @click=""><i class="fas fa-user-plus"></i></button>
                </div> -->
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Alpha-2 Code</th>
                      <th>Capital</th>
                      <th>Timezone</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="city in cityList">
                      <td>{{ city.id || city.index }}</td>
                      <td>{{ city.name }}</td>
                      <td>{{ city.alpha2Code }}</td>
                      <td>{{ city.capital }}</td>
                      <td>{{ city.timezone || city.timezones[0] }}</td>
                      <td>
                         <button type="submit" class="btn btn-success" style="padding: 5px 7px;" @click="addItem(city.id)">Add</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
              <div class="card-footer" style="background-color: #fff">
                <pagination :data="allCities" @pagination-change-page=""></pagination>
              </div>
            </div>
            <!-- /.card -->
          </div>
        </div>
      </div>
</template>

<script>
    import { mapActions } from 'vuex';
    //import { mapGetters } from 'vuex';
    import { mapState } from 'vuex';
    import store from './../store/store'

    export default {
        data() {
          return {
            auth_user_id: window.user.id,
            allCities: {},
            chosenCities: {},
            http: this.$http
          }
        },
        computed: {
          ...mapState({
            triggered: state => state.cityController.triggered,
            cityList: state => state.cityController.cityList,
            chosenCityList: state => state.cityController.chosenCityList,
            temperatureList: state => state.cityController.temperatureList
          })
        },
        methods: {
          ...mapActions('cityController', [
            'loadCities',
            'loadChosenCities',
            'loadCitiesFromDB',
            'sendTemperatureStatsToDB',
            'sendCitiesToDB',
            'temperatureInfo',
            'addItem',
            'removeItem'
          ]),
          tempInfo: function(payload) {
            this.temperatureInfo(payload)
                .then(() => {
                   // this.loadChosenCities();
                })
                .catch((err) => {
                   console.log(err)
                   throw err;
               });
          }
        },
        mounted() {
            console.log('Component mounted.')
        },
        created() {
            console.log("Created")
            this.loadCitiesFromDB()
              .then((data) => {
                if(this.cityList.length === 0) {
                  this.loadCities(this.$http)
                    .then(() => {
                      this.allCities = Object.assign({}, this.cityList);
                      this.sendCitiesToDB()
                    });
                }
              })
            this.loadChosenCities();
        }
  }
</script>
