<?php

namespace App\Exports;
use App\Entrance;
use Exportable;


use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class EntranceExport implements FromCollection ,WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */

    
protected $data;

 function __construct($data) {
        $this->data = $data;
 }
    public function collection()
    {
$data=$this->data;
        $entrances = Entrance::whereBetween('entrances.created_at', [$data['start_time'], $data['finish_time']])
            ->join('students', 'entrances.student_id', 'students.id')
            ->join('parents', 'students.parent_id', 'parents.id')
            ->join('steps', 'entrances.step_id', 'steps.id')
            ->join('status', 'entrances.status_id', 'status.id')->groupBy('entrances.id')
            ->select('entrances.id','test_time','steps.name as step_name','entrances.created_at as ngay_dang_ky',
            'enroll_date as ngay_nhap_hoc','parents.fullname as parent_name','students.fullname as student_name')
            // ->whereIn('center_id',$data['center_id'])
            ->get();           
      
                        return $entrances;
        if (in_array(-1,$data['center_id'])==true) {
            return $entrances;
        } else {

            return $entrances->whereIn('center_id', $data['center_id']);
        }
           

 
    }
    
    public function headings(): array
    {
        return [
        //   'id',
          'Tên học sinh',
          'Phụ huynh',
          'Ngày đăng ký',
          'Đang ở bước',
          'Ngày hẹn lịch KTĐV',
          'Ngày nhập học'
              ];
    }
    public function map($entrances):array
    {
        // dd($entrances->id);
    return[
        // $entrances->id,
        $entrances->student_name,
        $entrances->parent_name,
        $entrances->ngay_dang_ky,
        $entrances->step_name,
        $entrances->test_time,
        $entrances->ngay_nhap_hoc,
    
    
    
    ]   ;
     }
}