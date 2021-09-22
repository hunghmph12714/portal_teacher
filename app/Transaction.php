<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
class Transaction extends Model
{
    //
    public $table = 'transactions';
    protected $fillable = ['id','debit','credit','amount','time','content',
    'student_id','class_id','session_id','paper_id','status','user','center_id','refer_transaction','discount_id'
    ,'budget_id','created_at', 'updated_at', 'misa_upload', 'misa_upload_at', 'misa_id'];

    public function tags(){
        return $this->morphToMany('App\Tag', 'taggable');
    }
    public function students(){
        return $this->belongsTo('App\Student', 'student_id');
    }
    public function sessions(){
        return $this->belongsToMany('App\Session', 'transaction_session', 'transaction_id', 'session_id')
            ->withPivot('id','amount');
    }
    
    public function scopeTransactionStudent($query, $filter){
        if(!empty($filter)){
            if( $filter['student'] && $filter['student'] != ''){
                $query->where('student_id', $filter['student']['value']);
            }
        }
        return $query;
    }
    public function scopeTransactionTime($query, $filter){

        $from = ($filter['from'] ? date('Y-m-d', strtotime($filter['from'])) : date('Y-m-d', strtotime('1999-01-01')));
        $to = ($filter['to'] ? date('Y-m-d', strtotime($filter['to'])) : date('Y-m-d', strtotime('2222-01-01')));
       
        return $query->whereBetween('time', [$from, $to]);
    }
    public function scopeTransactionDebit($query, $filter){
        if($filter['debit'] && $filter['debit'] != ''){
            $query->where('debit', $filter['debit']['id']);
        }
        return $query;
    }
    public function scopeTransactionCredit($query, $filter){
        if($filter['credit'] && $filter['credit'] != ''){
            $query->where('credit', $filter['credit']['id']);
        }
        return $query;
    }
    public function scopeTransactionClass($query, $filter){
        if($filter['selected_class']){
            $query->where('transactions.class_id', $filter['selected_class']['value']);
        }
        return $query;
    }
    public function scopeTransactionTag($query, $filter){
        if($filter['tags']){
            $tags = array_column($filter['tags'], 'value');
            $query->whereHas('tags', function($query) use($tags) {
                $query->whereIn('tags.id', $tags);
            });
        }
        return $query;
    }
}
