<?php

namespace App\Http\Middleware;

use App\Models\Session;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return redirect(route('login.form'));
        }
        // dd($request->class_id);
        if (isset($request->class_id)) {


            $classes =   Session::where('teacher_id', Auth::user()->id)->get();
            //  dd('class', $request->class_id);
            //    dd($classes[0]->class_id);
            foreach ($classes as $item) {
                if ($request->class_id == $item->class_id) {
                    return $next($request);
                }
            }
            return redirect(route('error.403'));
        }
        if (isset($request->id)) {
            // dd('id', $request->id);
            if (Auth::user()->id != $request->id) {
                return redirect(route('error.403'));
            }
        }
        // return redirect(route('error.403'));

        return $next($request);
    }
}
