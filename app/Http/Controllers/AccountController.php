<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Account;
use App\Transaction;
class AccountController extends Controller
{
    //
    protected function getEquity(){
        $accounts = Account::where('type','equity')->orderBy('level_1')->get();
        return response()->json($accounts);
    }
    protected function getAccount(Request $request){
        $accounts = Account::orderBy('level_1')->get();
        $result = [];
        foreach($accounts as $key => $account){
            $result[$key] = $account;
            $debit = Transaction::where('debit', $account->id)->sum('amount');
            $credit = Transaction::where('credit', $account->id)->sum('amount');
            $result[$key]['debit'] = $debit;
            $result[$key]['credit'] = $credit;
        }
        return response()->json($result);
    }
    protected function addAccount(Request $request){
        $rules = ['level_1' => 'required',
                'level_2' => 'required|unique:accounts,level_2',
                'name'=>'required'];
        $this->validate($request, $rules);

        $account['level_1'] = $request->level_1;
        $account['level_2'] = $request->level_2;
        $account['name'] = $request->name;
        $account['description'] = $request->description;
        $account['type'] = ($request->type)?$request->type:'default';
        $result = Account::create($account);

        return response()->json($result);        
    }
    protected function deleteAccount(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $account = Account::find($request->id);
        if($account){
            $account->delete();
        }
    }
    protected function editAccount(Request $request){
        $rules = ['id' => 'required', 'level_1' => 'required' , 'level_2'=>'required|unique:accounts,level_2,'.$request->id];
        $this->validate($request, $rules);
        
        $account = Account::find($request->id);
        if($account){
            $account->level_1 = $request->level_1;
            $account->level_2 = $request->level_2;
            $account->name = $request->name;
            $account->description = $request->description;
            $account->type = $request->type;
            $account->save();
            return response()->json($account);
        }
        else{
            return response()->json('Lỗi', 422);
        }
    }
    public function importDb(){
       
        if (($handle = fopen(public_path()."/css/accounts.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $input = ['level_1'=>$data[0], 'level_2'=>$data[1], 'name' => $data[2], 'balance'=>$data[3]];
                Account::Create($input);
            }
            fclose($handle);
        }
    }
    protected function findAccount(Request $request){
        $rules = ['key' => 'required'];
        $this->validate($request, $rules);

        $accs = Account::where('level_2', 'LIKE', $request->key.'%')->orWhere('name', 'LIKE', '%'.$request->key.'%')->get();
        return response()->json($accs);
    }
}
