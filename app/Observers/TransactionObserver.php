<?php

namespace App\Observers;

use App\Transaction;
use App\Account;
use App\TransactionSession;
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
