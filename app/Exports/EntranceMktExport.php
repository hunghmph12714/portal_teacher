<?php

namespace App\Exports;
use App\Entrance;
use Exportable;


use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class EntranceMktExport implements FromCollection ,WithHeadings, WithMapping
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
            ->join('status', 'entrances.status_id', 'status.id')
            ->groupBy('entrances.id')
            ->select('entrances.id','entrances.created_at as ngay_dang_ky',
           'parents.fullname as parent_name','students.fullname as student_name','parents.phone','parents.email','status.name as status_name')
            ->get();
              
            $entrances->load('medium');           
dd($entrances);

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
          'Email',
          'Số điện thoại',
          'Ngày đăng ký',
          'Nguồn'   ,
          'Trạng thái'

              ];
    }
    public function map($entrances):array
    {
         if($entrances->medium!=null){
        $e_m_name=  $entrances->medium->name  ;
        }else{
             $e_m_name='';
        }

    return[
  
        $entrances->student_name,
        $entrances->parent_name,
        $entrances->email,
        $entrances->phone,
        $entrances->ngay_dang_ky,
        $e_m_name,
        $entrances->status_name,
      

         ]   ;
     }
}