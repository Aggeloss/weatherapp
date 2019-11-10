<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChosenCity extends Model
{
  protected $fillable = [
      'user_id', 'index', 'name', 'alpha2Code', 'capital', 'timezone'
  ];

  //relationships..
  public function user()
  {
      return $this->belongsToMany('App\User');
  }

  public function temperature()
  {
      return $this->belongsToMany('App\Temperature');
  }
}
