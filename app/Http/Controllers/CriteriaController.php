<?php

namespace App\Http\Controllers;

use App\Criteria;
use Illuminate\Http\Request;

class CriteriaController extends Controller
{
    public function getAllCriteria()
    {
        $criterias = Criteria::all();
        return response()->json($criterias);
    }
    public function getCriteriaByAttemptId($attempt_id)
    {
        $criterias = Criteria::where('attempt_id', $attempt_id)->get();
        return response()->json($criterias);
    }
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
    public function getCriteriaById($criteria_id)
    {
        $criteria = Criteria::find($criteria_id);
        return response()->json($criteria);
    }
    public function saveCriteria($criteria_id, Request $request)
    {
        $request->validate([
            'attempt_id' => 'required',
            'content' => 'required',
            'domain' => 'required',
            'title' => 'required',
        ]);
        $criteria = Criteria::find($criteria_id);
        $criteria->fill($request->all());
        return response()->json($criteria);
    }
    public function removeCriteria($criteria_id)
    {
        Criteria::destroy($criteria_id);
    }
}
