<?php

namespace App\Exports;

use App\Center;
use App\Entrance;
use Exportable;


use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class EntranceSlExport implements FromCollection, WithHeadings, WithMapping
{


    protected $data;

    function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        $centers = Center::all();
        $centers->load('entrances');
        // dd($centers);
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
        // dd(
        //     $centers->entrances->whereIn('step_id', 4)->count()
        // );
        $data = $this->data;
        // dd(
        //     // $centers->entrances->whereBetween('created_at', [$data['start_time'], $data['finish_time']])->whereIn('status_id', [1, 2, 11])->count()
        // );
        return [

            $centers->name,
            $centers->entrances->whereBetween('created_at', [$data['start_time'], $data['finish_time']])->count(),
            $centers->entrances->whereBetween('created_at', [$data['start_time'], $data['finish_time']])->where('step_id', '!=', 4)->whereIn('status_id', [1, 2, 11])->count(),
            $centers->entrances->whereBetween('created_at', [$data['start_time'], $data['finish_time']])->whereNotIn('status_id',  [1, 2, 11])->count(),
            $centers->entrances->whereBetween('created_at', [$data['start_time'], $data['finish_time']])->where('step_id', 4)->count(),







        ];
    }
}