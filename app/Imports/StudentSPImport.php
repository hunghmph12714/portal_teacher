<?php

namespace App\Imports;

use App\Exports\StudentExport;
use App\Student;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Facades\Excel;

class StudentSPImport implements
    ToCollection

{
    /**
     * @param Collection $collection
     */
    // public function collection(Collection $collection)
    // {
    //     //
    //     dd($collection);
    // }
    public function collection(Collection $rows)
    {
        // dd($rows);
        $students = Student::join('parents', 'students.parent_id', 'parents.id')
            // ->where(activeClasses(), true)
            ->join('student_class', 'students.id', 'student_class.student_id')
            ->join('classes', 'student_class.class_id', 'classes.id')
            ->where('status', 'active')->where('classes.type', 'class')->where('classes.year', '2021')
            ->join('courses', 'classes.course_id', 'courses.id')
            ->select('students.id as id', 'students.fullname as student_name', 'students.school', 'parents.fullname as parent_name', 'parents.email as email', 'parents.phone as phone',  'classes.code', 'dob')
            ->groupBy('students.id')
            ->get();

        $result = $students->toArray();
        $student_filter = [];
        foreach ($students as $s) {
            $classes = $s->activeClasses()->select('classes.code')->get();
            $code = implode(',', array_column($classes->toArray(), 'code'));
            $s->code = $code;
        }
        // dd($students->all());

        foreach ($rows as $row) {
            $dob1 = date('Y-m-d', strtotime(str_replace('/', '-', $row[2])));
            // dd($students);
            foreach ($students as $st) {
                // dd($dob1, $st->dob);
                // print_r($st->dob, '<br>');
                if ($row[1] == $st->student_name && $dob1 == $st->dob) {
                    // dd(1);
                    array_push($student_filter, $st);
                }
            }
            // break;
        }
        // dd($student_filter);
        $data = [];
        $data['students'] = (object) $student_filter;
        return Excel::download(new StudentExport($data), 'entrances.xlsx');
    }
}
