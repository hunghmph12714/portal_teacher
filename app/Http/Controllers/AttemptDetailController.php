<?php

namespace App\Http\Controllers;

use App\AttemptDetail;
use Illuminate\Http\Request;

class AttemptDetailController extends Controller
{
    public function craete(Request $request)
    {
        $data = [
            'score' => $request->score,
            'comment' => $request->comment,
        ];
        $Attempt = AttemptDetail::find($request->id);
        $Attempt->fill($data);
    }
}