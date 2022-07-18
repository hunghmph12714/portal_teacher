<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class CareExport implements FromArray, WithHeadings, WithMapping
{
    /**
     * @return \Illuminate\Support\Collection
     */

    protected $data;

    function __construct($data)
    {
        $this->data = $data;
    }

    public function array(): array
    {
        $data = $this->data;
        return $data['cares'];
    }
    public function headings(): array
    {
 
        $data = $this->data;
        $services = array_column($data['services'], 'name');
        $header = [
            'Học sinh', 'Mã lớp', 'Người chăm sóc', 'Thời gian', 'Phương thức',$services[0],$services[1],$services[2],$services[3],
        ];
     
        return ($header);
    }
    public function map($array): array
    {

        return [
            $array['student']['name'],
            $array['class']['code'],
            $array['user']['name'],
            $array['time']['created_at'],
            $array['method'],
            $array['care_services'][0]['content'],
            $array['care_services'][1]['content'],
            $array['care_services'][2]['content'],
            $array['care_services'][3]['content'],


        ];
    }
}
