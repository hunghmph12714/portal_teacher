<?php

namespace App\Exports;

use App\Entrance;
use Exportable;
use DB;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class EntranceExport implements FromCollection, WithHeadings, WithMapping
{


    protected $data;

    function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        $data = $this->data;
        // dd($data);
        // $center = array_column($data['center_id'], 'value');
        // dd($center);
        // dd($data['start_time']->format('Y-m-d H:i:s')  );
//
//             
$centers_id=array_column($data['centers'],'value');

        $entrances = Entrance:: whereBetween('entrances.created_at', [$data['start_time'], $data['finish_time']])
        ->join('students', 'entrances.student_id', 'students.id')
            ->join('parents', 'students.parent_id', 'parents.id')
            ->join('steps', 'entrances.step_id', 'steps.id')
            ->join('status', 'entrances.status_id', 'status.id')->groupBy('entrances.id')
            ->join('center', 'entrances.center_id', 'center.id')
            ->join('courses', 'entrances.course_id', 'courses.id')
            // ->join('status', 'entrances.status_id', 'status.id')
            ->select(
                'entrances.id as id',
                'entrances.created_at',
                'parents.phone as phone',
                'parents.email as email',
                'entrances.created_at as ngay_dang_ky',
                'parents.fullname as parent_name',
                'students.fullname as student_name',
                'center.name as center_name',
                'step_id', 
                  'status_id',
                  'status.name as status_name',
                  'steps.name as step_name','center_id',
                  DB::raw("CONCAT(courses.name,' ',courses.grade) AS course_name")
                )
                

            
            // ->whereIn('step_id',[3,4])
            // ->whereIn('status_id',[2,3,4,5,6,7,8,9,10,11])
            ->get();

            if(in_array(-1,$centers_id)==true){
                return $entrances;

            }

        //    dd( $entrances);
        return $entrances->whereIn('center_id',$centers_id);
    }

    public function headings(): array
    {
        return [
            //   'id',     
            'Cơ sở',
            'Tên học sinh',
            'Phụ huynh',
            'SDT',
            'Email',
            'Ngày đăng ký',
            'Môn đăng ký',
            'Đang ở bước',
            'Trạng thái',
            


        ];
    }
    public function map($entrances): array
    {
        return [
            $entrances->center_name,
            $entrances->student_name,
            $entrances->parent_name,
            $entrances->phone,

            $entrances->email,
            $entrances->created_at,
            $entrances->course_name,
            $entrances->step_name,
            $entrances->status_name,
            // $entrances->student_name,





        ];
    }
}