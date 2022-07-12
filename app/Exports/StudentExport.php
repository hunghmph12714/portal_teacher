<?php

namespace App\Exports;

use App\Imports\ExcelImport;
use App\Exports\ExcelExport;
use Excel;
use App\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentExport implements FromCollection, WithHeadings, WithMapping
{
    /**
     * @return \Illuminate\Support\Collection
     */
    // protected $data;

    // function __construct($data)
    // {
    //     $this->data = $data;
    // }
    public function collection()
    {
        // return Student::all();
        $students = Student::join('parents', 'students.parent_id', 'parents.id')
            // ->where(activeClasses(), true)
            ->join('student_class', 'students.id', 'student_class.student_id')
            ->join('classes', 'student_class.class_id', 'classes.id')
            ->where('status', 'active')->where('classes.type', 'class')->where('classes.year', '2021')
            ->join('courses', 'classes.course_id', 'courses.id')
            ->select('students.sgd_id as sgd_id', 'students.id as id', 'students.fullname as student_name', 'students.school', 'parents.fullname as parent_name', 'parents.email as email', 'parents.phone as phone',  'classes.code')
            ->groupBy('students.id')
            ->get();
        // dd(1);

        // $students=Student::join('student_class','students.id','student_class.student_id')
        // ->where('class_id',425) 
        // ->select('students.id as id','student_class.id as sbd','students.fullname as student_name','dob')
        // ->groupBy('id')
        // ->get();
        // dd($students);

        $result = $students->toArray();
        foreach($students as $s){
            $classes = $s->activeClasses()->select('classes.code')->get();
            $code = implode(',', array_column($classes->toArray(), 'code'));
            $s->code = $code;
        } 
        return $students;    
        // $data = $this->data;
        // typeOf($data['students']);
        // return $data['students'];
    }




    public function headings(): array
    {
        return [

            // "ID (sbd)",
            "Ho ten hoc sinh",
            "Ngày sinh",
            // "Lớp Vee",

        ];
    }



    public function map($students): array
    {
        // echo('<pre>');
        // print_r($students->dob);
        // dd($students[1]);
        return [

            // $students->sbd,
            $students->student_name,
            $students->dob,

        ];
    }
}