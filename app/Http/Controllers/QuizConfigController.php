<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\QuizConfig;
use App\Topic;
use App\Subject;
use App\Question;
use App\Syllabus;
use App\Objective;
use App\Chapter;
use App\QuizConfigObjective;
use App\QuizConfigTopic;

class QuizConfigController extends Controller
{
    //
    protected function edit(Request $request)
    {
        $config = QuizConfig::find($request->config['id']);
        if ($config) {
            $config->title = $request->config['title'];
            $config->grade = $request->config['grade']['value'];
            $config->duration = $request->config['duration'];
            $config->description = $request->config['description'];
            $objectives = array_column($request->config['objectives'], 'value');
            $config->objectives()->sync($objectives);
            $config->save();
            foreach ($request->quiz_config as $domain) {
                foreach ($domain['quiz_topic'] as $qt) {
                    $qtopic = QuizConfigTopic::find($qt['id']);
                    if ($qtopic) {
                        $qtopic->quantity = $qt['quantity'];
                        $qtopic->score = $qt['score'];

                        if (array_key_exists('value', $qt['question_type'])) {
                            $qtopic->question_type = $qt['question_type']['value'];
                        } else {
                            $qtopic->question_type = $qt['question_type'][0]['value'];
                        }

                        if (array_key_exists('value', $qt['level'])) {
                            $qtopic->question_level = $qt['level']['value'];
                        } else {
                            $qtopic->question_level = $qt['level'][0]['value'];
                        }
                        $qtopic->topic_id = $qt['topic']['value'];
                        $qtopic->save();
                    }
                }
            }
        }
    }
    protected function create(Request $request)
    {
        // dd($request->quiz_config);

        $rules = ['config' => 'required', 'quiz_config'];
        $this->validate($request, $rules);


        $qc['title'] = $request->config['title'];
        $qc['description'] = $request->config['description'];
        $qc['grade'] = $request->config['grade']['value'];
        $qc['duration'] = $request->config['duration'];
        $qc = QuizConfig::create($qc);

        //Add objectives;
        $objectives = array_column($request->config['objectives'], 'value');
        $qc->objectives()->sync($objectives);
        //Add topics 
        foreach ($request->quiz_config as $domain) {
            foreach ($domain['quiz_topic'] as $k => $qt) {
                $input['quiz_config_id'] = $qc->id;
                $input['topic_id'] =   $qt['topic']['value'];
                $input['quantity'] = $qt['quantity'];
                $input['question_level'] = $qt['level']['value'];
                $input['question_type'] = $qt['question_type']['value'];
                $input['score'] = $qt['score'];
                $input['subject'] = $domain['domain']['value'];
                QuizConfigTopic::create($input);
            }
        }
    }
    protected function get()
    {
        $qc = QuizConfig::with('topics')->with('objectives')->orderBy('id', 'DESC')->get();
        return response()->json($qc);
    }
    protected function getId(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $qc = QuizConfig::where('id', $request->id)->with('objectives')->first();

        $quiz_topics = QuizConfigTopic::where('quiz_config_id', $qc->id)->get();
        $quiz_configs = [];
        foreach ($quiz_topics as $qt) {
            $topic = Topic::find($qt->topic_id);
            $subject = Subject::find($topic->subject_id);
            $chapter = Chapter::find($subject->chapter_id);
            $syllabus = Syllabus::find($chapter->syllabus_id);

            if (array_key_exists($syllabus->title, $quiz_configs)) {
                $quiz_configs[$syllabus->title]['sum_q'] += $qt->quantity;
                $quiz_configs[$syllabus->title]['sum_score'] += $qt->score * $qt->quantity;

                $quiz_configs[$syllabus->title]['quiz_topic'][] = [
                    'topic' => ['label' => $topic->title, 'value' => $topic->id],
                    'level' => $qt->question_level, 'question_type' => $qt->question_type,
                    'score' => $qt->score, 'quantity' => $qt->quantity, 'id' => $qt->id
                ];
            } else {
                $quiz_configs[$syllabus->title] = [

                    'domain' => $syllabus->subject,
                    'syllabus' => ['label' => $syllabus->title, 'value' => $syllabus->id],
                    'sum_q' => $qt->quantity,
                    'sum_score' => $qt->quantity * $qt->score,
                    'quiz_topic' => [
                        [
                            'topic' => ['label' => $topic->title, 'value' => $topic->id],
                            'level' => $qt->question_level, 'question_type' => $qt->question_type,
                            'score' => $qt->score, 'quantity' => $qt->quantity, 'id' => $qt->id
                        ]

                    ]
                ];
            }
        }
        return response()->json(['qc' => $qc, 'qt' => array_values($quiz_configs)]);
    }


    public function autoConfig($objective_id, $toan, $van, $anh)
    {
        // $objective_id = $_GET['objective'];


        $objective = Objective::find($objective_id);
        $data = [
            'title' => 'Cấu hình bộ đề ' . $objective->content,
            'duration' => 180,
            'type' => 'exam',
            'description' => 'mt',
            'grade' => 5
        ];
        $config = QuizConfig::create($data);
        $config_objective = QuizConfigObjective::create([
            'objective_id' => $objective_id,
            'quiz_config_id' => $config->id,
            'weight' => 1,

        ]);

        //Toán
        if ($toan) {
            $syllabus_id = $toan;
            $syllabus = Syllabus::find($syllabus_id);
            // ->join('lms_chapters', 'lms_syllabus.id', 'lms_chapters.syllabus_id')
            // ->get();
            $chapter = Chapter::where('syllabus_id', $syllabus->id)->get();
            $ct = [];
            foreach ($chapter as $c) {
                array_push($ct, $c->id);
            }
            $subject = Subject::whereIn('chapter_id', $ct)->get();
            $sj = [];
            foreach ($subject as $s) {
                array_push($sj, $s->id);
            }
            $topic = Topic::whereIn('subject_id', $sj)->get();

            foreach ($topic as $t) {
                $data_t = [
                    'quiz_config_id' => $config->id,
                    'topic_id' => $t->id,
                    'question_level' => 'TH',
                    'question_type' => 'mc',
                    'quantity' => 1,
                    'score' => 1,
                    'subject' => 'Toán',

                ];


                $t_c = QuizConfigTopic::create($data_t);
            }
        }


        /// Văn
        if ($van) {
            $syllabus_id = $van;

            $syllabus = Syllabus::find($syllabus_id);
            // ->join('lms_chapters', 'lms_syllabus.id', 'lms_chapters.syllabus_id')
            // ->get();
            $chapter = Chapter::where('syllabus_id', $syllabus->id)->get();
            $ct = [];
            foreach ($chapter as $c) {
                array_push($ct, $c->id);
            }
            $subject = Subject::whereIn('chapter_id', $ct)->get();
            $sj = [];
            foreach ($subject as $s) {
                array_push($sj, $s->id);
            }
            $topic = Topic::whereIn('subject_id', $sj)->get();

            foreach ($topic as $t) {
                $data_t = [
                    'quiz_config_id' => $config->id,
                    'topic_id' => $t->id,
                    'question_level' => 'TH',
                    'question_type' => 'mc',
                    'quantity' => 1,
                    'score' => 0.5,
                    'subject' => 'Tiếng Việt',

                ];


                $t_c = QuizConfigTopic::create($data_t);
            }
        }


        //Anh
        if ($anh) {
            $syllabus_id = $anh;

            $syllabus = Syllabus::find($syllabus_id);
            // ->join('lms_chapters', 'lms_syllabus.id', 'lms_chapters.syllabus_id')
            // ->get();
            $chapter = Chapter::where('syllabus_id', $syllabus->id)->get();
            $ct = [];
            foreach ($chapter as $c) {
                array_push($ct, $c->id);
            }
            $subject = Subject::whereIn('chapter_id', $ct)->get();
            $sj = [];
            foreach ($subject as $s) {
                array_push($sj, $s->id);
            }
            $topic = Topic::whereIn('subject_id', $sj)->get();

            foreach ($topic as $t) {
                $data_t = [
                    'quiz_config_id' => $config->id,
                    'topic_id' => $t->id,
                    'question_level' => 'TH',
                    'question_type' => 'mc',
                    'quantity' => 1,
                    'score' => 1,
                    'subject' => 'Tiếng Anh',

                ];


                $t_c = QuizConfigTopic::create($data_t);
            }
        }

        dd('Thành công');
    }
}
