<?php

class demo extends Controller
{
    public function saveEdit($id, Request $request)
    {
        $request->validate(
            [
                "title" => "required",
            ],
            [
                "title.required" => "bạn phải nhập tiêu đề"
            ]
        );
        // dd($request);
        $model = Post::find($id);
        $model->fill($request->all());
        $model->save();
        if ($request->has('file')) {
            $file =   FileDocumentPost::where('post_id', $id)->get();
            // dd($file);
            foreach ($file as $key => $value) {
                Storage::delete($value->filename);
                echo ($value);
                $value->delete();
            }


            foreach ($request->file as $item) {
                $filename = $item->storeAs('file_document_post', date('d_m_Y') . '_' . random_int(0, 9999999) . '_' . $item->getClientOriginalName());
                FileDocumentPost::create([
                    'post_id' => $id,
                    'filename' => $filename
                ]);
            }
            // echo ($item->getClientOriginalName());
        }
        return redirect(route('post.index'));
    }
    public function deletePost($id)
    {
        $listfile = FileDocumentPost::where('post_id', $id)->get();
        foreach ($listfile as  $value) {
            // echo ($value);
            Storage::delete($value->filename);
        }
        $listfile->load('file_document_post')->delete();
        // $listlink = LinkDocumentPost::where('post_id', $id)->delete();

        Post::find($id)->delete();
        return redirect(route('post.index'));
    }
    public function downloadFile($id)
    {
        $file = FileDocumentPost::find($id);
        $filePath = storage_path("app/" . $file->filename);
        // dd($filePath);
        return  response()->download($filePath);
    }
    protected function configuration($objective_id, $student_session_id)
    {

        // $objective_id = $request->objective_id;

        // $student_session_id = $request->student_session_id;

        // $objective_id = 1;
        // $student_session_id = 36020;

        //hàm dùng chung
        function select(array $array, $column)
        {
            $a = [];
            foreach ($array as $ss) {
                array_push($a, $ss[$column]);
            }
            return $a;
        }
        // Tìm ra cấu hình
        $config = QuizConfigObjective::where('objective_id', $objective_id)
            ->join('lms_quiz_configs', 'lms_quiz_config_objective.quiz_config_id', 'lms_quiz_configs.id')->first();
        $config_topic = QuizConfigTopic::query()
            ->where(
                'quiz_config_id',
                $config->id
            )->get();
        $list_domain = [];
        foreach ($config_topic as $d) {
            array_push($list_domain, $d->subject);
        }
        $domain =  array_flip(array_flip($list_domain));
        $questions = array_flip($list_domain);
        // dd($questions);
        $tp_qt = TopicQuestion::query()
            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id');
        foreach ($questions as $key => $item) {
            $questions[$key] = [];
        }
        $student_session = StudentSession::find($student_session_id)
            ->join('sessions', 'student_session.session_id', 'sessions.id')->first();
        // dd($student_session->from);
        $quizzes = [
            'title' => $config->title,
            'duration' => $config->duration,
            'quizz_code' => random_int(1000, 9999),
            'quiz_config_id' => $config->id,
            'student_session_id' => $student_session_id,
            // 'available_date' => $student_session->from
        ];

        $quiz =   Quiz::create($quizzes);

        // dd($quiz);
        //tìm ra học sinh và các câu hỏi đã thi
        {
            $student_id = StudentSession::find($student_session_id)->student_id;
            $student_session = StudentSession::where('student_id', $student_id)->get()->toArray();
            $arr_student_session_id = select($student_session, 'id');
            $attempts = Attempt::whereIn('student_session', $arr_student_session_id)->get()->toArray();
            $arr_attempt_id = select($attempts, 'id');
            // các câu hỏi mà học sinh đó đã thi
            $attempt_detail = AttemptDetail::whereIn('attempt_id', $arr_attempt_id)
                ->join('lms_questions', 'lms_attempt_details.question_id', 'lms_questions.id')->distinct()->get();

            $attempt_question = select($attempt_detail->toArray(), 'question_id');
            // $a = select($attempt_detail->whereNotNull('ref_question_id')->toArray(), 'ref_question_id');
            // dd($a);
            // dd(array_unique($a));
            // dd($attempt_question);
        }
        foreach ($domain as $do) {
            // dd($do);
            $tp_cf = [];
            $tp_cf = $config_topic->where('subject', $do);

            $arr_q = [];
            $main_id = null;
            $sub_id = [];
            $rqi   = [];
            if ($tp_cf->toArray() != null) {
                foreach ($tp_cf as $key => $qt) {
                    // dd($tp_cf);
                    // echo $qt->subject, '<br/>';
                    if ($qt->question_type == 'complex') {
                        // echo $qt->topic_id;
                        // echo "<br/>";
                        $q =  TopicQuestion::where('topic_id', $qt->topic_id)
                            ->join('lms_question_objective', 'lms_topic_question.question_id', 'lms_question_objective.question_id')
                            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')
                            ->where('complex', 'sub')->where('objective_id', $objective_id)->where('active', 1)->where('lms_questions.created_at', '>', '2022-02-10 10:25:10')
                            ->get();
                        $r =  array_unique(array_column($q->toArray(), 'ref_question_id'));
                        array_push($rqi, $r);

                        if ($main_id == null || in_array($main_id, $rqi) == false) {

                            //Mảng chưa id các câu hỏi main  có câu sub thi
                            $attempt_detail_main = $attempt_detail->whereNotNull('ref_question_id')->toArray();
                            $main_exam_id = array_unique(select($attempt_detail_main, 'ref_question_id'));
                            // echo '<pre>';
                            // print_r($q->whereNotIn('ref_question_id', $main_exam_id)->toArray());
                            $rand = array_rand($q->whereNotIn('ref_question_id', $main_exam_id)->toArray(), 1);
                            $main_id = $q[$rand]->ref_question_id;
                            array_push($sub_id, $q[$rand]->id);
                            $o = Option::where('question_id', $q[$rand]->id)->get();
                            $option_config = [];
                            foreach ($o as $k => $op) {
                                $option_config[$k] = $op->id;
                            }
                            // $model->option_config  =  $option_config;
                            $q_q = [
                                'question_id' => $q[$rand]->id,
                                'quizz_id' => $quiz->id,
                                'option_config' => $option_config,
                                'max_score' =>  $qt->score,
                            ];

                            $model = QuizQuestion::create($q_q);
                            $option_config = $model->option_config;

                            array_push($arr_q, $q[$rand]);
                        } else {

                            $q_s = Question::where('ref_question_id', $main_id)->whereNotIn('id', $sub_id)->where('created_at', '>', '2022-02-10 10:25:10')->get();
                            $rand = array_rand($q_s->toArray(), 1);
                            array_push($sub_id, $q_s[$rand]->id);
                            // echo "<pre>";
                            print_r($sub_id);
                            // dd(1);
                            $o = Option::where('question_id', $q_s[$rand]->id)->get();
                            foreach ($o as $k => $op) {
                                $option_config[$k] = $op->id;
                            }
                            $q_q = [
                                'question_id' => $q_s[$rand]->id,
                                'quizz_id' => $quiz->id,
                                'max_score' =>  $qt->score,
                                'option_config' => $option_config,

                            ];
                            $model = QuizQuestion::create($q_q);
                            $option_config = $model->option_config;

                            $model->option_config  =  $option_config;
                            $model->save();
                            array_push($arr_q, $q_s[$rand]);
                        }
                    } else {
                        $main_id = null;
                        // $sub_id = [];
                        $q =  TopicQuestion::where('topic_id', $qt->topic_id)
                            ->join('lms_question_objective', 'lms_topic_question.question_id', 'lms_question_objective.question_id')
                            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')->where('active', 1)
                            ->whereNull('complex')->where('objective_id', $objective_id)->where('lms_questions.created_at', '>', '2022-02-10 10:25:10')
                            ->get();
                        $q_id = select($q->toArray(), 'id');

                        $at_n_questtion = array_diff($q_id, $attempt_question);
                        if ($at_n_questtion == null) {
                            continue;
                        }
                        // echo "<pre>";

                        // print_r($at_n_questtion);
                        // dd(1);
                        $rand = array_rand($at_n_questtion, 1);
                        // dd($at_n_questtion, 1);
                        // dd
                        // print_r($qt->topic_id);



                        $o = Option::where('question_id', $at_n_questtion[$rand])->get();
                        $option_config = [];
                        foreach ($o as $k => $op) {
                            $option_config[$k] = $op->id;
                        }
                        $q_q = [
                            'question_id' =>
                            $at_n_questtion[$rand],
                            'quizz_id' => $quiz->id,
                            'option_config' => $option_config,
                            'max_score' =>  $qt->score,
                        ];
                        $model = QuizQuestion::create($q_q);


                        // dd($model);
                        // $model->option_config  =  $option_config;

                        // $model->save();
                        array_push($arr_q, $q[$rand]);
                    }
                }
            }
            $questions[$do] = $arr_q;
        }
        return $quiz->quizz_code;

        // dd($questions, $quiz);
        // dd($quiz);
    }
}