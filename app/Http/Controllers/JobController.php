<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\SendEventNotify;
class JobController extends Controller
{
    //
    public function processQueue()
    {
        $emailJob = new SendEventNotify();
        dispatch($emailJob);
    }
}
