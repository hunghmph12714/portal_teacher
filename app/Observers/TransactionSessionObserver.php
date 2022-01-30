<?php

namespace App\Observers;

use App\TransactionSession;
use App\Transaction;
class TransactionSessionObserver
{
    /**
     * Handle the transaction session "created" event.
     *
     * @param  \App\TransactionSession  $transactionSession
     * @return void
     */
    public function created(TransactionSession $transactionSession)
    {
        //
        
    }

    /**
     * Handle the transaction session "updated" event.
     *
     * @param  \App\TransactionSession  $transactionSession
     * @return void
     */
    public function updated(TransactionSession $transactionSession)
    {        //
        $old_amount = $transactionSession->getOriginal('amount');
        if($transactionSession->amount != $old_amount){
            $transaction = Transaction::find($transactionSession->transaction_id);
            if($transaction){
                $transaction->amount = $transaction->amount - $old_amount + $transactionSession->amount;
                $transaction->save();
                if($transaction->amount == 0){
                    $transaction->forceDelete();
                }
            }
        }
    }

    /**
     * Handle the transaction session "deleted" event.
     *
     * @param  \App\TransactionSession  $transactionSession
     * @return void
     */
    public function deleted(TransactionSession $transactionSession)
    {
        //
        $transaction = Transaction::find($transactionSession->transaction_id);
        if($transaction){
            $transaction->amount = $transaction->amount - $transactionSession->amount;
            $transaction->save();
            if($transaction->amount <= 1){
                $transaction->forceDelete();
            }
        }
    }

    /**
     * Handle the transaction session "restored" event.
     *
     * @param  \App\TransactionSession  $transactionSession
     * @return void
     */
    public function restored(TransactionSession $transactionSession)
    {
        //
    }

    /**
     * Handle the transaction session "force deleted" event.
     *
     * @param  \App\TransactionSession  $transactionSession
     * @return void
     */
    public function forceDeleted(TransactionSession $transactionSession)
    {
        //
        echo "fired";
        $transaction = Transaction::find($transactionSession->transaction_id);
        if($transaction){
            
            $transaction->amount = $transaction->amount - $transactionSession->amount;
            $transaction->save();
            if($transaction->amount == 0){
                $transaction->forceDelete();
            }
        }
    }
}
