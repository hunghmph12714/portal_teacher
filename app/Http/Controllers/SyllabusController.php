<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Syllabus;
use App\Chapter;
use App\Subject;
use App\Topic;
class SyllabusController extends Controller
{
    //
    public function genSyllabus(){
        // title' => 'required',
        //     'grade' => 'required',
        //     'subject' => 'required',
        //     'public' => 'required',
        $s = [];
        $s['title'] = 'Bộ đề Đoàn Thị Điểm, Marie Curie, Lương Thế Vinh';
        $s['grade'] = 5;
        $s['subject'] = 'Tiếng Anh';
        $s['public'] = 1;
        $s['user_id'] = 1;
        $s = Syllabus::create($s);
        for ($i=1; $i < 41; $i++) { 

        $c = [];
        $sj = [];
        $t = [];
            # code...
            $c['syllabus_id'] = $s->id;
            $c['title'] = 'Câu '.$i;
            $c = Chapter::create($c);
            $sj['chapter_id'] = $c->id;
            $sj['title'] = 'Câu '.$i;
            $sj = Subject::create($sj);
            $t['subject_id'] = $sj->id;
            $t['title'] = 'Câu '.$i;
            $t = Topic::create($t);

        }
    }
    public function fetchSyllabus(Request $request){
        $rules = ['domain' => 'required', 'grade' => 'required'];
        $this->validate($request, $rules);
        
        $s = Syllabus::where('subject', $request->domain['value'])->where('grade', $request->grade['value'])->where('public', '1')->get();
        return response()->json($s->toArray());
    }
    public function fetchTopic(Request $request){
        $rules = ['syllabus' => 'required'];
        $this->validate($request, $rules);

        $result = [];
        $chapters = Chapter::where('syllabus_id', $request->syllabus['value'])->get();
        foreach($chapters as $k => $c){
            $subjects = Subject::where('chapter_id', $c->id)->get();
            $r = [];
            foreach($subjects as $key => $s){
                $result[$k + $key]['label'] = $s->title;
                $topics = Topic::where('subject_id', $s->id)->get();
                foreach($topics as $j => $t){
                    $result[$k + $key]['options'][$j] = ['label' => $s->title." - ".$t->title, 'value'=> $t->id ];
                }
            }
        }
        return response()->json($result);
    }
    public function createChapter($syllabus_id, $chapter){
        $c['title'] = ($chapter['title'] != '') ? $chapter['title']: 'Chưa có tên';
        $c['syllabus_id'] = $syllabus_id;
        $new_chapter = Chapter::create($c);
        return $new_chapter;
    }
    public function createSubject($chapter_id, $subject){
        $sj['title'] = ($subject['title'] != '') ? $subject['title'] : 'Chưa có tên';
        $sj['chapter_id'] = $chapter_id;
        $new_subject = Subject::create($sj);
        return $new_subject;
    }
    public function createTopic($subject_id, $topic){
        $tp['title'] = ($topic['title'] != '') ? $topic['title'] : 'Chưa có tên';
        $tp['content'] = ($topic['content'] != '')? $topic['content'] : '';
        $tp['subject_id'] = $subject_id;
        $new_topic = Topic::create($tp);
        return $new_topic;
    }
    public function createFullChapter($syllabus_id, $data){
        $new_chapter = $this->createChapter($syllabus_id, $data);
        $data['id'] = 'ct_'.$new_chapter->id;
        $data['title'] =  $new_chapter->title;
        foreach($data['subjects'] as $s_key => $subject){
            $new_subject = $this->createFullSubject($new_chapter->id, $subject);
            $data['subjects'][$s_key]=$new_subject;
            
        }
        return $data;
    }
    public function createFullSubject($chapter_id, $data){
        $new_subject = $this->createSubject($chapter_id, $data);
        $data['title'] = $new_subject->title;
        $data['id'] = 'sj_'.$new_subject->id;
        foreach($data['topics'] as $t_key => $topic){
            $new_topic = $this->createTopic($new_subject->id, $topic);
            $data['topics'][$t_key]['id'] = 'tp_'.$new_topic->id;
            $data['topics'][$t_key]['title'] = $new_topic->title;
            $data['topics'][$t_key]['content'] = ($new_topic->content)?$new_topic->content: '';
        }
        return $data;

    }
    protected function createSyllabus(Request $request){
        $rules = [
            'title' => 'required',
            'grade' => 'required',
            'subject' => 'required',
            'public' => 'required',
        ];
        $this->validate($request, $rules);
        $data = $request->toArray();
        $s = Syllabus::create($request->toArray());
        $data['id'] = $s->id;
        $user_id = auth()->user()->id;
        $s->user_id = $user_id;
        $s->save();
        foreach($request['chapters'] as $key => $chapter){
            $new_chapter = $this->createFullChapter($s->id, $chapter);
            $data['chapters'][$key] = $new_chapter;
        }
        return response()->json($data);
    }   
    protected function editSyllabus(Request $request){
        $rules = [
            'id' => 'required',
            'title' => 'required',
            'grade' => 'required',
            'subject' => 'required',
            'public' => 'required',
        ];
        $this->validate($request, $rules);
        $data = $request->toArray();
        $syllabus = Syllabus::find($request->id);
        $syllabus->update($data);
        
        foreach($request['chapters'] as $key => $chapter){
            //Check id of chapter
            if(array_key_exists('id', $chapter)){
                //existed chapter
                $cid = explode('_', $chapter['id'])[1];
                $ex_chapter = Chapter::find($cid);
                if($ex_chapter){
                    $ex_chapter->update($chapter);
                    foreach($chapter['subjects'] as $s_key => $subject){
                        //Check id of chapter
                        if(array_key_exists('id', $subject)){
                            //existed subject
                            $sid = explode('_', $subject['id'])[1];
                            $ex_subject = Subject::find($sid);
                            if($ex_subject){
                                $ex_subject->update($subject);
                                foreach($subject['topics'] as $t_key => $topic){
                                    //Check id topic exist
                                    if(array_key_exists('id', $topic)){
                                        $tid = explode('_', $topic['id'])[1];
                                        $ex_topic = Topic::find($tid);
                                        $ex_topic->title = $topic['title'];
                                        $ex_topic->content = $topic['content'];
                                        $ex_topic->save();
                                    }else{
                                        //create new topic
                                        $new_topic = $this->createTopic($ex_subject->id, $topic);
                                        $data[$key]['subjects'][$s_key]['topics'][$t_key] = $new_topic;
                                    }
                                }
                            }
                        }else{
                            //create new subject
                            $new_subject = $this->createFullSubject($ex_chapter->id, $subject);
                            $data[$key]['subjects'][$s_key] = $new_subject;
                        }
                    }
                }
            }else{
                //create new chapter
                $new_chapter = $this->createFullChapter($syllabus->id, $chapter);
                $data['chapters'][$key] = $new_chapter;
            }
        }
        return response()->json($data);
    }
    protected function listSyllabus(Request $request){
        $data = Syllabus::where('public', true)
            ->select('title', 'description', 'public', 'users.name',
                'lms_syllabus.created_at', 'subject', 'grade', 'lms_syllabus.id')
            ->join('users', 'user_id', 'users.id')
            ->get();
        return response()->json($data->toArray());
    }
    protected function getSyllabus(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $syllabus = Syllabus::find($request->id);
        $data = $syllabus->toArray();
        $chapters = Chapter::where('syllabus_id', $syllabus->id)->get();
        $data['chapters'] = $chapters->toArray();
        $data['syllabus'] = $syllabus->toArray();
        foreach($chapters as $key => $chapter){
            $subjects = $chapter->subjects;
            $data['chapters'][$key]['id'] = 'ct_'.$chapter->id;
            $data['chapters'][$key]['subjects'] = $subjects->toArray();
            foreach($subjects as $s_key => $subject){
                $topics = $subject->topics;
                $data['chapters'][$key]['subjects'][$s_key]['id'] = 'sj_'.$subject->id;
                $data['chapters'][$key]['subjects'][$s_key]['topics'] = $topics->toArray();
                foreach($topics as $t_key => $topic){
                    $data['chapters'][$key]['subjects'][$s_key]['topics'][$t_key]['id'] = 'tp_'.$topic->id;
                } 
            }
        }
        return response()->json($data);
    }
    protected function deleteChapter(Request $request){
        $rules = ['chapter_id' => 'required'];
        $this->validate($request, $rules);

        $id = explode('_', $request->chapter_id)[1];
        $chapter = Chapter::find($id);
        if($chapter){
            $chapter->syllabus_id = null;
            $chapter->save();
        }
    }
    protected function deleteSubject(Request $request){
        $rules = ['subject_id' => 'required'];
        $this->validate($request, $rules);

        $id = explode('_', $request->subject_id)[1];
        $subject = Subject::find($id);
        if($subject){
            $subject->chapter_id = null;
            $subject->save();
        }
    }
    protected function deleteTopic(Request $request){
        $rules = ['topic_id' => 'required'];
        $this->validate($request, $rules);

        $id = explode('_', $request->topic_id)[1];
        $topic = Topic::find($id);
        if($topic){
            $topic->subject_id = null;
            $topic->save();
        }
    }
}
