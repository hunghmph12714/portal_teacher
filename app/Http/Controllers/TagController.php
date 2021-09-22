<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tag;
class TagController extends Controller
{
    //
    public function getTag(){
        $tags = Tag::all();
        return response()->json($tags);
    }
}
