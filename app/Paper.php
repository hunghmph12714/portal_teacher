<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Paper extends Model
{
    //
    public $table = "papers";
    protected $fillable = ['payment_number', 'receipt_number','type','name','description','amount','status','user_created_id','user_lock_id','note','address','center_id'];
    public function transactions(){
        return $this->hasMany('App\Transaction', 'paper_id', 'id');
    }
    public function scopeReceiptNumber($query, $filter){
        if(!empty($filter)){
            foreach($filter as $f){
                if($f['column']['field'] == 'receipt_number'){
                    $query->where('type', 'receipt')->where('receipt_number', $f['value']);
                }
            }
        }

        return $query->where('type', 'receipt');
    }
    public function scopeReceiptName($query, $filter){
        if(!empty($filter)){
            foreach($filter as $f){
                if($f['column']['field'] == 'name'){
                    $query->where('type', 'receipt')->where('papers.name','LIKE' ,'%'.$f['value'].'%');
                }
            }
        }

        return $query->where('type', 'receipt');
    }
    public function scopeReceiptDescription($query, $filter){
        if(!empty($filter)){
            foreach($filter as $f){
                if($f['column']['field'] == 'description'){
                    $query->where('type', 'receipt')->where('description','LIKE' ,'%'.$f['value'].'%');
                }
            }
        }

        return $query->where('type', 'receipt');
    }
    public function scopeReceiptAddress($query, $filter){
        if(!empty($filter)){
            foreach($filter as $f){
                if($f['column']['field'] == 'address'){
                    $query->where('type', 'receipt')->where('address','LIKE' ,'%'.$f['value'].'%');
                }
            }
        }

        return $query->where('type', 'receipt');
    }
}
