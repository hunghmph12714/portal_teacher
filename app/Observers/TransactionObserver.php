<?php

namespace App\Observers;

use App\Transaction;
use App\Account;
use App\TransactionSession;
use App\Budget;
use App\BudgetAccount;
use App\Paper;
use App\Classes;
class TransactionObserver
{
    /**
     * Handle the transaction "created" event.
     *
     * @param  \App\Transaction  $transaction
     * @return void
     */
    public function created(Transaction $transaction)
    {
        //
        $debit = Account::find($transaction->debit);
        $credit = Account::find($transaction->credit);
        $amount = $transaction->amount;
        $debit->balance -= $amount;
        $credit->balance += $amount;
        $credit->save();
        $debit->save();

        if($transaction->budget_id){
            $ba = BudgetAccount::where('budget_id', $transaction->budget_id)->where('account_id', $transaction->debit)->first();
            if($ba){
                $ba->actual += $transaction->amount;
                $ba->save();
            }else{
                $input['budget_id'] = $transaction->budget_id;
                $input['account_id'] = $transaction->debit;
                $input['limit'] = 0;
                $input['actual'] = $transaction->amount;
                BudgetAccount::create($input);
            } 
        }

        if($transaction->paper_id){
            $paper = Paper::find($transaction->paper_id);
            $transaction->center_id = $paper->center_id;
            $transaction->save();
        }
        if($transaction->class_id){
            $class = Classes::find($transaction->class_id);
            $transaction->center_id = $class->center_id;
            $transaction->save();
        }
        $credit = Account::where('level_2', '131')->first();
        if($transaction->paper_id && $transaction->credit == $credit->id && $transaction->class_id){
            
        }
    }

    /**
     * Handle the transaction "updated" event.
     *
     * @param  \App\Transaction  $transaction
     * @return void
     */
    public function updated(Transaction $transaction)
    {
        //
        $old_debit = $transaction->getOriginal('debit');
        $old_credit = $transaction->getOriginal('credit');
        $old_amount = $transaction->getOriginal('amount');
        
        if(!$old_debit && !$old_credit){
            $debit = Account::find($old_debit);
            $credit = Account::find($old_credit);
            if($old_debit != $transaction->debit){            
                $debit->balance += $old_amount;
                $debit->save();
                $new_debit = Account::find($transaction->debit);
                $new_debit->balance -= $transaction->amount;
                $new_debit->save();
                
                if($old_credit != $transaction->credit){                
                    $credit->balance -= $old_amount;                
                    $credit->save();
                    
                    $new_credit = Account::find($transaction->credit);
                    $new_credit->balance += $transaction->amount;
                    $new_credit->save();
                }
                else{
                    $credit = Account::find($transaction->credit);
                    $credit->balance = $credit->balance - $old_amount + $transaction->amount;
                }
            }
            if($old_debit == $transaction->debit && $old_credit != $transaction->credit){
                $credit->balance -= $old_amount;                
                $credit->save();
                
                $new_credit = Account::find($transaction->credit);
                $new_credit->balance += $transaction->amount;
                $new_credit->save();
            }
            if($old_debit == $transaction->debit && $old_credit == $transaction->credit && $old_amount != $transaction->amount){
                $debit->balance = $debit->balance + $old_amount - $transaction->amount;
                $credit->balance = $credit->balance - $old_amount + $transaction->amount;
                $debit->save(); $credit->save();
            }
            if($transaction->budget_id){
                $old_budget = $transaction->getOriginal('budget_id');
                if($old_budget){
                    $old_ba = BudgetAccount::where('budget_id', $old_budget)->where('account_id', $transaction->getOriginal('debit'))->first();
                    if($old_ba){
                        $old_ba->actual -= $transaction->getOriginal('amount');
                        $old_ba->save();
                    }
                }
                //update new budget 
                $ba = BudgetAccount::where('budget_id', $transaction->budget_id)->where('account_id', $transaction->debit)->first();
                if($ba){
                    $ba->actual += $transaction->amount;
                    $ba->save();
                }else{
                    $input['budget_id'] = $transaction->budget_id;
                    $input['account_id'] = $transaction->debit;
                    $input['limit'] = 0;
                    $input['actual'] = $transaction->amount;
                    BudgetAccount::create($input);
                } 
            }
        }
        
    }

    /**
     * Handle the transaction "deleted" event.
     *
     * @param  \App\Transaction  $transaction
     * @return void
     */
    public function deleted(Transaction $transaction)
    {
        //
        $debit = Account::find($transaction->debit);
        $credit = Account::find($transaction->credit);
        $amount = $transaction->amount;
        $debit->balance += $amount;
        $credit->balance -= $amount;
        $credit->save();
        $debit->save();
        $ts = TransactionSession::where('transaction_id', $transaction->id)->forceDelete();
    }

    /**
     * Handle the transaction "restored" event.
     *
     * @param  \App\Transaction  $transaction
     * @return void
     */
    public function restored(Transaction $transaction)
    {
        //
    }

    /**
     * Handle the transaction "force deleted" event.
     *
     * @param  \App\Transaction  $transaction
     * @return void
     */
    public function forceDeleted(Transaction $transaction)
    {
        //
        $debit = Account::find($transaction->debit);
        $credit = Account::find($transaction->credit);
        $amount = $transaction->amount;
        $debit->balance += $amount;
        $credit->balance -= $amount;
        $credit->save();
        $debit->save();

        $ts = TransactionSession::where('transaction_id', $transaction->id)->forceDelete();
        //
    }
}
