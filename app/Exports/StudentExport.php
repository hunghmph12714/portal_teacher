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
    public function collection()
    {
        // return Student::all();
        $students = Student::join('parents', 'students.parent_id', 'parents.id')
            // ->where(activeClasses(), true)
            ->join('student_class', 'students.id', 'student_class.student_id')
            ->join('classes', 'student_class.class_id', 'classes.id')
            ->where('status', 'active')->where('classes.type', 'class')->where('classes.year', '2021')
            ->join('courses', 'classes.course_id', 'courses.id')
            ->select('students.sgd_id as sgd_id','students.id as id', 'students.fullname as student_name','students.school','parents.fullname as parent_name', 'parents.email as email', 'parents.phone as phone' ,  'classes.code')
            ->groupBy('students.id')
            ->get();
        // dd(1);
        $result = $students->toArray();
        foreach($students as $s){
            $classes = $s->activeClasses()->select('classes.code')->get();
            $code = implode(',', array_column($classes->toArray(), 'code'));
            $s->code = $code;
        }
        return $students;
    }




    public function headings(): array
    {
        return [
            "ID sở",
            "ID Vee",
            "Ho ten hoc sinh",
            "Trường",
            "Họ tên Phụ huynh",
            "Email",
            "Số điện thoại",
            "Lớp Vee"

        ];
    }


    // public function columnWidths(): array
    // {
    //     return [
    //         'Name 1' => 20,
    //         'Email 1' => 20,
    //         "Ho ten hoc sinh" => 20,
    //         "Khoi lop" => 20,
    //         "Nam hoc" => 20,
    //     ];
    // }
    public function map($students): array
    {
        return [
            $students->sgd_id,
            $students->id,
            $students->student_name,
            $students->school,
            $students->parent_name,
            $students->email,
            $students->phone,
            $students->code,

        ];
    }
}