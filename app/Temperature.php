<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Temperature extends Model
{
  protected $fillable = [
      'min_temp', 'max_temp', 'avg_temp', 'last_temp'
  ];

  //relationships..
  public function city()
  {
      return $this->belongsToMany('App\City');
  }
}
