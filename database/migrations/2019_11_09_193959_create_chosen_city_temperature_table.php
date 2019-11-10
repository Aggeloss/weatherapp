<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChosenCityTemperatureTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chosen_city_temperature', function (Blueprint $table) {
          //primary key
          $table->increments('id');
          //foreign keys
          $table->integer('chosen_city_id')->unsigned();
          $table->integer('temperature_id')->unsigned();

          $table->timestamps();

          //Constraints
          $table->foreign('chosen_city_id')
                ->references('id')
                ->on('chosen_cities')
                ->onDelete('cascade');
          $table->foreign('temperature_id')
                ->references('id')
                ->on('temperatures')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chosen_city_temperature');
    }
}
