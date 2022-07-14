 <?php

    namespace App\Http\Controllers;

    use Illuminate\Http\Request;
    use App\MathDoc;
    use Goutte\Client;
    use DB;

    class DocumentController extends Controller
    {
        //
        protected function create(Request $request)
        {

            $dom = new \DOMDocument();
            libxml_use_internal_errors(true);

            $question = $request->state['question'];
            if ($question != "") {
                $dom->loadHTML($request->state['question']);
                $imgs = $dom->getElementsByTagName('img');
                foreach ($imgs as $img) {
                    $data = $img->getAttribute('src');
                    if (strpos($data, 'base64') !== false) {
                        $old_data =  $img->getAttribute('src');
                        list($type, $data) = explode(';', $data);
                        list(, $data)      = explode(',', $data);
                        $d = base64_decode($data);
                        $dir = 'public/images/documents/' . time() . '.png';
                        file_put_contents($dir, $d);
                        // echo $old_data;
                        $question = str_replace($old_data, $dir, $question);
                    }
                }
            } else {
                return response()->json('Câu hỏi không thể bỏ trống.', 402);
            }
            $answer = $request->state['answer'];
            if ($answer != "") {
                $dom->loadHTML($answer);
                $imgs = $dom->getElementsByTagName('img');
                foreach ($imgs as $img) {
                    $data = $img->getAttribute('src');
                    if (strpos($data, 'base64') !== false) {
                        $old_data =  $img->getAttribute('src');
                        list($type, $data) = explode(';', $data);
                        list(, $data)      = explode(',', $data);
                        $d = base64_decode($data);
                        $dir = 'public/images/documents/' . time() . '.png';
                        file_put_contents($dir, $d);
                        // echo $old_data;
                        $answer = str_replace($old_data, $dir, $answer);
                    }
                }
            } else {
                $input['status'] = 'Thiếu đáp án';
            }

            $input['major'] = $request->state['major'];
            $input['grade'] = $request->state['grade'];
            $input['topic'] = $request->state['topic']['label'];
            $input['tag'] = implode(';', array_column($request->state['related'], 'label'));
            $input['type'] = $request->state['type'];
            $input['level'] = $request->state['level'];
            $input['question'] = $question;
            $input['answer'] = $answer;
            $input['user_id'] = auth()->user()->id;
            if ($request->state['edit']) {
                MathDoc::where('id', $request->state['selected_id'])->update($input);
            } else {
                MathDoc::create($input);
            }
            // return response()->json($request->state['question']);
        }
        protected function bulkCreate(Request $request)
        {
            // print_r($request->toArray());

            $rules = ['major' => 'required', 'grade' => 'required', 'topic' => 'required', 'type' => 'required', 'level' => 'required'];
            $this->validate($request, $rules);


            $topic = json_decode($request->topic)->label;
            $tag = implode(';', array_column(json_decode($request->related, true), 'label'));
            $new_dir = public_path() . '/images/documents/' . $request->major . '/' . $request->grade . '/' . $topic . '/' . $request->level;
            if (!is_dir($new_dir)) {
                mkdir($new_dir, 0775, true);
                // mkdir($new_dir.'/exercices', 0775, true);
            }
            $question_count = explode(',', $request->count);

            foreach ($question_count as $key => $count) {
                $input['major'] = $request->major;
                $input['grade'] = $request->grade;
                $input['topic'] = $topic;
                $input['tag'] = $tag;
                $input['type'] = $request->type;
                $input['level'] = $request->level;
                $input['question'] = '<>';
                $input['answer'] = '<>';
                $input['user_id'] = auth()->user()->id;
                $doc = MathDoc::create($input);
                if ($request->has('document' . $key)) {
                    $ans = $request->file('document' . $key);

                    $name = $doc->id . "_doc." . $ans->getClientOriginalExtension();
                    $ans->move($new_dir, $name);
                    $path = 'public/images/documents/' . $request->major . '/' . $request->grade . '/' . str_replace(' ', '%20', $topic) . '/' . $request->level . '/' . $name;
                    $question = '<figure class="image"><img src=' . $path . '></figure>';
                    $doc->question = $question;
                    $answer = '';
                    for ($j = 0; $j < $count; $j++) {
                        $ans = $request->file('answer' . $key . '_' . $j);

                        $name = $doc->id . "_ans_" . $j . "." . $ans->getClientOriginalExtension();
                        $ans->move($new_dir, $name);
                        $path = 'public/images/documents/' . $request->major . '/' . $request->grade . '/' . str_replace(' ', '%20', $topic) . '/' . $request->level . '/' . $name;
                        $answer = $answer . '<figure class="image"><img src=' . $path . '></figure>';
                    }
                    $doc->answer = $answer;
                    if ($answer == "") {
                        $doc->status = "Thiếu đáp án";
                    }
                    $doc->save();
                }
            }
        }
        protected function edit()
        {
        }
        protected function delete(Request $request)
        {
            $rules = ['id' => 'required'];
            $this->validate($request, $rules);

            MathDoc::find($request->id)->forceDelete();
            return response()->json(200);
        }
        protected function get()
        {
            $allDoc = MathDoc::Select('maths.id as id', 'major', 'topic', 'maths.level', 'type', 'question', 'mc', 'tag', 'answer', 'custom_field', 'maths.created_at', DB::raw('DATE_FORMAT(maths.created_at, "%d-%m-%Y") AS created_at_formated'), 'grade', 'users.name', 'maths.status')
                ->leftJoin('users', 'maths.user_id', 'users.id')->orderBy('created_at')->get();

            $topic = Mathdoc::select('topic')->distinct('topic')->get();
            $relateds = Mathdoc::select('tag')->get();

            $tags = implode(';', array_column($relateds->toArray(), 'tag'));
            $relateds = array_values(array_unique(explode(';', $tags)));
            return response()->json(['all' => $allDoc, 'topic' => array_column($topic->toArray(), 'topic'), 'relateds' => $relateds]);
        }
        protected function confirm(Request $request)
        {
            $rules = ['id' => 'required'];
            $this->validate($request, $rules);

            $d = Mathdoc::find($request->id);
            $d->status = 'Đã duyệt';
            $d->save();
        }
        protected function report(Request $request)
        {
            $rules = ['id' => 'required'];
            $this->validate($request, $rules);

            $d = Mathdoc::find($request->id);
            $d->status = 'Sai đáp án';
            $d->save();
        }
    }
