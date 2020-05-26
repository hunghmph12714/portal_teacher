<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Account;
use App\Transaction;
class TransactionController extends Controller
{
    //
    protected function addTransaction(Request $request){
        $rules = [
            'credit'=>'required',
            'debit'=>'required',
            'amount'=>'required',
            'time'=>'required',
        ];
        $this->validate($request, $rules);

        $input['credit'] = $request->credit['id'];
        $input['debit'] = $request->debit['id'];
        $input['amount'] = $request->amount;
        $input['time'] = date('Y-m-d H:i:m', $request->time);
        $input['content'] = ($request->content)?$request->content:NULL;
        $input['student_id'] = ($request->student)?$request->student['value']:NULL;
        $input['class_id'] = ($request->selected_class) ? $request->selected_class['value']:NULL;
        $input['session_id'] = ($request->selected_session) ? $request->selected_session['value']:NULL;
        $input['user'] = auth()->user()->id;
        $transaction = Transaction::create($input);
        return response()->json($transaction);

    }
}
