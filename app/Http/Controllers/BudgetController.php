<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Budget;
use App\Account;
use App\Transaction;
use App\Paper;
use App\BudgetAccount;
use DB;
class BudgetController extends Controller
{
    //']
    protected function getBudget(){
        $budget = Budget::select('budgets.id as id','budgets.name','center_id','from' , 'to',DB::raw('DATE_FORMAT(budgets.from, "%d/%m/%Y") AS from_formated'),DB::raw('DATE_FORMAT(budgets.to, "%d/%m/%Y") AS to_formated'),
         'limit', 'budgets.status', 'budgets.created_at', 'center.name as cname', 'center.code')->join('center','budgets.center_id', 'center.id')->get();
        $result = [];
        foreach($budget as $b){
            $result = $b;
            $result['actual'] = BudgetAccount::where('budget_id', $b->id)->sum('actual');
        }
        return response()->json($budget);
    }  
    protected function createBudget(Request $request){
        $rules = ['name' => 'required', 'center_id' => 'required', 'from_formated' => 'required', 'to_formated'=>'required'];
        $this->validate($request, $rules);

        $data = $request->toArray();
        $data['from'] = date('Y-m-d', strtotime($request->from_formated));
        $data['to'] = date('Y-m-d', strtotime($request->to_formated));

        $budget = Budget::create($data);
        $budget->from_formated = date('d/m/Y', strtotime($budget->from));
        $budget->to_formated = date('d/m/Y', strtotime($budget->to));
        return response()->json($budget);
    }  
    protected function editBudget(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $budget = Budget::find($request->id);
        if($budget){
            $data = $request->toArray()['newData'];
            $data['from'] = date('Y-m-d', strtotime($data['from_formated']));
            $data['to'] = date('Y-m-d', strtotime($data['to_formated']));
            // print_r($data);
            $budget->update($data);
            
            return response()->json($budget);
            
        }
    }  
    protected function deleteBudget(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $budget = Budget::find($request->id);
        if($budget){
            $budget->forceDelete();
        }
    }

    protected function addAccount(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $budget = Budget::find($request->id);
        if($budget){
            $detail = [];
            foreach($request->accounts as $acc){
                $amount = floatval($acc['amount']);
                $acc_id = $acc['account']['value'];
                if(!array_key_exists($acc_id, $detail)){
                    $detail[$acc_id]['limit'] = $amount;
                }else{
                    $detail[$acc_id]['limit'] += $amount;
                }
            }
            $budget->accounts()->sync($detail);
        }
    }
    protected function getDetail(Request $request){
        $rules =['id' => 'required'];
        $this->validate($request, $rules);

        $budget = Budget::find($request->id);
        if($budget){
            $result = [];
            $accounts = $budget->accounts;
            foreach($accounts as $key => $account){
                $result[] = [
                    'account' => ['label' =>$account['level_2']." - ".$account['name'], 'value' => $account['id']],
                    'amount' => $account['pivot']['limit'],
                    'actual' => $account['pivot']['actual'],
                    'id' => $key,
                ];
            }
            return response()->json($result);
        }
    }
    protected function statBudget($id){
        return view('welcome');
    }
    protected function getStats(Request $request){
        $rules =['id' => 'required'];
        $this->validate($request, $rules);

        $budget = Budget::find($request->id);
        if($budget){
            $result = [];
            $accounts = $budget->accounts;
            foreach($accounts as $account){
                $acc = $account['pivot'];
                $amount = $budget->limit/100*floatval($acc['limit']);
                $dif = $amount - $acc['actual']  ;
                $result[] = [
                    'account' => $account['name'],
                    'amount' => $amount,
                    'limit' => $acc['limit'],
                    'actual' => $acc['actual'],
                    'dif' => $dif,
                ];
            }
            return response()->json($result);
        }
    }
}
