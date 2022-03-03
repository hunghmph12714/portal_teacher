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
            ->where('status', 'active')->where('classes.type', 'class')
            ->join('courses', 'classes.course_id', 'courses.id')
            ->select('students.id as id',  'courses.grade', 'parents.email as email', 'students.fullname as student_name', 'parents.fullname as parent_name', 'year')
            ->groupBy('students.id')
            ->get();
        // dd(1);

        return $students;
    }




    public function headings(): array
    {
        return [
            "Name 1",
            "Email 1",
            "Ho ten hoc sinh",
            "Khoi lop",
            "Nam hoc"

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
            $students->parent_name,
            $students->email,
            $students->student_name,
            $students->grade,
            $students->year
        ];
    }
}