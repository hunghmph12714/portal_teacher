<?php

namespace App\Http\Controllers;

use App\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function create(Request $request)
    {
        // if (!Auth::check()) {
        //     return redirect('/login');
        // }
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'phone' => 'required',
            'upload[]' => 'mimes:png,jpg,jpeg',
            'type' => 'required',
        ]);


        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'user_id' => Auth::id(),
            'status' => 1,
            'type' => $request->type,
            'phone' => $request->phone

        ];
        // dd($request->upload);
        $feedback =    Feedback::create($data);
        if ($request->has('upload')) {
            $arr_upload = [];

            foreach ($request->upload as $u) {
                $file = $u;
                $ext = $u->extension();
                // dd($ext);
                // dd(public_path('lms'));
                $rand = random_int(10000, 99999);
                $file->move(public_path('feedbacks'), $rand . '_' . $feedback->id . '.' . $ext);
                $url = 'public/feedbacks/' . $rand . '_' . $feedback->id . '.' . $ext;
                array_push($arr_upload, $url);
            }
            $feedback->upload = $arr_upload;
            $feedback->save();
        }
        return back();
    }





    public function list()
    {

        $feedbacks = Feedback::query()->orderBy('status', 'asc')->orderBy('created_at', 'desc')->paginate(10);
        // dd($feedbacks);
        return view('feedbacks.list', compact('feedbacks'));
    }

    public function check(Request $request)
    {
        $feedbacks_id = $request->feedbacks_id;
        if (sizeof($feedbacks_id) > 1) {
            $feedback_id = $request->feedbacks_id[0];
            foreach ($feedbacks_id as $f) {

                $feedback = Feedback::find($f);
                if ($feedback) {
                    $feedback->feedback_id = $feedback_id;
                    $feedback->save();
                }
            }
        }
    }
    public function editStatus(Request $request)
    {
        $feedbacks_id = $request->feedbacks_id;
        foreach ($feedbacks_id as $f) {

            $feedback = Feedback::find($f);
            if ($feedback) {
                $feedback->status = 2;
                $feedback->save();
            }
        }
        return back();
    }
    public function detail($id)
    {
        $feedback = Feedback::find($id);
        if ($feedback) {
            return view('feedbacks.detail', compact('feedback'));
        }
    }
    public function result($id, Request $request)
    {
        $feedback = Feedback::find($id);
        if ($feedback) {
            $feedback->result = $request->result;
            $feedback->status = 2;
            $feedback->save();
            return redirect(route('feedback.list'));
        }
    }
}