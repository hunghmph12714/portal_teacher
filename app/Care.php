<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Care extends Model
{
  protected $table='cares';
  public $fillable= ['student_id','class_id','method','user_id'];

  /**
   * Get all of the service_care for the Care
   *
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
  public function care_service()
  {
      return $this->hasMany(CareServive::class, 'care_id', 'id');
  }
  /**
   * Get the student that owns the Care
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function student()
  {
      return $this->belongsTo(Student::class);
  }






  
}
