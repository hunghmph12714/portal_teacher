<?php

namespace App\Exports;

use App\Center;
use App\Entrance;
use Exportable;


use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class EntranceExport implements FromCollection, WithHeadings, WithMapping
{


    // protected $data;

    // function __construct($data)
    // {
    //     $this->data = $data;
    // // }

    public function collection()
    {
        $centers = Center::all();
        $centers->load('entrances');
        return $centers;
    }

    public function headings(): array
    {
        return [

            'Cơ sở',
            'Tổng ghi danh',
            'Đang xử lý',
            'Thất bại',
            'Thành công',

        ];
    }
    public function map($centers): array
    {
        // dd($entrances)
        return [

            $centers->name,
            $centers->entrances->count(),
            $centers->entrances->whereIn('status_id', [1, 2, 11])->count(),
            $centers->entrances->whereIn('status_id', '!=', [1, 2, 11])->count(),
            $centers->entrances->whereIn('step_id', 4)->count(),
        ];
    }
}