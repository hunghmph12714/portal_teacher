<?php

namespace App\Http\Controllers;

use App\AttemptDetail;
use Illuminate\Http\Request;

class AttemptDetailController extends Controller
{
    public function craeteComment(Request $request)
    {
        $data = [
            'score' => $request->score,
            'comment' => $request->comment,
        ];
        $Attempt = AttemptDetail::find($request->id);
        $Attempt->fill($data);
        $Attempt->save();
    }
    public function getCommentById($id)
    {
        $attempt = AttemptDetail::find($id);
        return response()->json($attempt);
    }
    public function editComment($id, Request $request)
    {
        $data = [
            'score' => $request->score,
            'comment' => $request->comment,
        ];
        $Attempt = AttemptDetail::find($request->id);
        $Attempt->fill($data);
        $Attempt->save();
    }
}