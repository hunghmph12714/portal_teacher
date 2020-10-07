<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Center;
use DB;
class Paper extends Model
{
    //
    public $table = "papers";
    protected $fillable = ['payment_number', 'receipt_number','type','name','description','amount','status','user_created_id','user_lock_id','note','address','center_id','method'];
    public function transactions(){
        return $this->hasMany('App\Transaction', 'paper_id', 'id');
    }
    public function scopeReceiptNumber($query, $filter){
        if(!empty($filter)){
            foreach($filter as $f){
                if($f['column']['field'] == 'receipt_number'){
                    $query->where('type', 'receipt')->where(DB::raw('CAST(receipt_number AS CHAR)'), 'LIKE' ,'%'.$f['value'].'%');
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
    public function scopeReceiptMethod($query, $filter){
        if(!empty($filter)){
            foreach($filter as $f){
                if($f['column']['field'] == 'method'){
                    $query->where('type', 'receipt')->where('method', $f['value']);
                }
            }
        }

        return $query->where('type', 'receipt');
    }
    public function scopeReceiptCenter($query, $filter){
        if(!empty($filter)){
            foreach($filter as $f){
                if($f['column']['field'] == 'code'){
                    $center = Center::where('code', $f['value'])->first();
                    if($center){
                        $query->where('type', 'receipt')->where('center_id', $center->id);
                    }
                }
            }
        }
        
        return $query->where('type', 'receipt');
    }
    public function scopeReceiptDate($query, $filter){
        if(!empty($filter)){
            foreach($filter as $f){
                if($f['column']['field'] == 'time_formated'){
                    $date = explode('T', $f['value'])[0];
                    // echo $date;
                    $query->where('type', 'receipt')->whereDate('papers.created_at', $date);
                }
            }
        }

        return $query->where('type', 'receipt');
    }
}
