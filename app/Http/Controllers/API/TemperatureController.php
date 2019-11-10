<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Temperature;
use App\ChosenCity;

class TemperatureController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
     public function __construct()
     {
       $this->middleware('auth:api');
     }

    public function index()
    {
        $chosen_city = DB::table('chosen_cities')->get();
        $temp_chosen_cities = [];
        $chosen_cities = [];

        $temperature_list = [];

        $min_temp = 0;
        $max_temp = 0;
        $avg_temp = 0;
        $last_temp = 0;

        $min_temp_numbers = [];
        $max_temp_numbers = [];
        $avg_temp_numbers = [];

        foreach ($chosen_city as $ct) {
          // $current_city = ChosenCity::find($ct->id);
          // $current_temp = Temperature::find($cct->temperature_id);

          $data_list = DB::table('chosen_city_temperature')->where('chosen_city_id', $ct->id)->get();

          foreach ($data_list as $item) {
            array_push($temperature_list, Temperature::find($item->temperature_id));
          }

          $min_temp_numbers = array_column($temperature_list, 'last_temp');
          if (!empty($min_temp_numbers))
            $min_temp = min($min_temp_numbers);
          $max_temp_numbers = array_column($temperature_list, 'last_temp');
          if (!empty($max_temp_numbers))
            $max_temp = max($max_temp_numbers);
          if (!empty($temperature_list)) {
            $avg_temp_numbers = array_column($temperature_list, 'last_temp');
            $avg_temp = round(array_sum($avg_temp_numbers) / count($avg_temp_numbers));
            $last_temp = $temperature_list[sizeof($temperature_list)-1]['last_temp'];
          }

          if ($ct->user_id==Auth::id()) {
            $temp_chosen_cities['user_id'] = $ct->user_id;
            $temp_chosen_cities['index'] = $ct->index;
            $temp_chosen_cities['name'] = $ct->name;
            $temp_chosen_cities['alpha2Code'] = $ct->alpha2Code;
            $temp_chosen_cities['capital'] = $ct->capital;
            $temp_chosen_cities['timezone'] = $ct->timezone;
            $temp_chosen_cities['min_temp'] = $min_temp;
            $temp_chosen_cities['max_temp'] = $max_temp;
            $temp_chosen_cities['avg_temp'] = $avg_temp;
            $temp_chosen_cities['last_temp'] = $last_temp;
          }

          array_push($chosen_cities, $temp_chosen_cities);
          $temperature_list = [];
        }
        return $chosen_cities;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (empty($request['city'])) {
          // $temperature = Temperature::create([]);

          $chosenCity = ChosenCity::create([
                      'user_id'    => Auth::user()->id,
                      'index'      => $request['current_item']['id'],
                      'name'       => $request['current_item']['name'],
                      'alpha2Code' => $request['current_item']['alpha2Code'],
                      'capital'    => $request['current_item']['capital'],
                      'timezone'   => $request['current_item']['timezone']
                   ]);
           $chosenCity->save();
          // $chosenCity->temperature()->attach($temperature->id);
        } else {
          $temperature = Temperature::create([
                          'min_temp'  => $request['city']['min_temp'],
                          'max_temp'  => $request['city']['max_temp'],
                          'avg_temp'  => $request['city']['avg_temp'],
                          'last_temp' => $request['city']['last_temp'],
                        ]);

          $chosenCity = DB::table('chosen_cities')->where('index', $request['city']['id'])->get();

          $temp_city = ChosenCity::where('index', $request['city']['id'])->get();
          $city = ChosenCity::find($temp_city[0]->id);
          $city->temperature()->attach($temperature->id);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        DB::table('chosen_cities')->where('index', $id)->delete();

        return ['message' => 'City Deleted: ' . $id];
    }
}
