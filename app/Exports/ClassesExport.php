<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use App\Classes;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ClassesExport implements FromArray, WithHeadings, WithMapping
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function array(): array
    {
        $year = auth()->user()->wp_year;
        $classes = Classes::where('year', $year)->join('center', 'classes.center_id', 'center.id')->where('type', 'class')->where('active', 1)
            ->select('classes.*', 'center.code as center_code')->get()->toArray();
        $result = [];
        foreach ($classes as &$class) {
            $config = json_decode($class['config']);
            $class['teacher'] = implode(' - ', array_column(array_column($config, 'teacher'), 'label'));
            $class['day'] = implode(' - ', array_column(array_column($config, 'date'), 'label'));
            // $class['teacher'] = implode(' - ', array_column(array_column($config, 'teacher'), 'label'));
            // $class['export_date'] = 
        }
        return $classes;
    }
    public function headings(): array
    {
        return [
            'Cơ sở', 'Tên lớp', 'Mã lớp', 'Ngày học', 'Giáo viên', 'Học phí', 'Sĩ số', 'Chờ', 'Nghỉ', 'Chuyển lớp',
        ];
    }

    public function map($array): array
    {
        return [
            $array['center_code'], $array['name'], $array['code'], $array['day'], $array['teacher'], $array['fee'], $array['student_number'], $array['waiting_number'], $array['droped_number'], $array['transfer_number']
        ];
    }
}