<?php

namespace App\Http\Controllers;

use App\Criteria;
use Illuminate\Http\Request;

class CriteriaController extends Controller
{
    public function create(Request $request)
    {

        $request->validate([
            'attempt_id' => 'required',
            'content' => 'required',
            'domain' => 'required',
            'title' => 'required',
        ]);
        $data = [
            'attempt_id' => $request->attempt_id,
            'domain' => $request->domain,
            'content' => $request->content,
            'title' => $request->title,
        ];

        Criteria::create($data);
    }
}
