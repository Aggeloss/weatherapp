<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChosenCitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chosen_cities', function (Blueprint $table) {
            $table->increments('id');
            //foreign keys
            $table->integer('user_id')->unsigned();

            $table->integer('index');
            $table->string('name');
            $table->string('alpha2Code');
            $table->string('capital')->nullable();
            $table->string('timezone');

            $table->timestamps();

            //Constraints
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
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
        Schema::dropIfExists('chosen_cities');
    }
}
