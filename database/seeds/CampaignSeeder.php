<?php

use Illuminate\Database\Seeder;
use App\Campaign;
use App\Source;
use App\Medium;
class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('sources')->truncate();
        DB::table('mediums')->truncate();
        DB::table('campaigns')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $campaings = [
            'Kiểm tra đầu vào' => [
                'sources' => [
                    'Website' => ['banner1', 'blog1', 'banner2', 'blog2'],
                    'Facebook' => ['ads', 'post', 'inbox'],
                    'Email' => ['cta', 'banner1', 'banner2', 'cta2'],
                    'Direct' => ['peer', 'banner', 'poster', 'telesale','other'],
                     // 'Direct' => ['peer', 'banner', 'poster', 'other'],
                ],
                'from' => '2020-01-01',
                'to' => '2030-01-01',
                'user_id' => 107,
            ],
            'Thi thử đợt 2' => [
                'sources' => [
                    'Website' => ['banner1', 'blog1', 'banner2', 'blog2'],
                    'Facebook' => ['ads', 'post', 'inbox'],
                    'Email' => ['cta', 'banner1', 'banner2', 'cta2', 'attachments'],
                    'Direct' => ['peer', 'banner', 'poster', 'telesale','other'],
                    // 'Direct' => ['peer', 'banner', 'poster', 'other'],
                ],
                'from' => '2020-01-01',
                'to' => '2030-01-01',
                'user_id' => 107,
            ]

        ];
        foreach($campaings as $name => $cam){
            $camp['from'] = $cam['from'];
            $camp['to'] = $cam['to'];
            $camp['user_id'] = $cam['user_id'];
            $camp['name'] = $name;

            $c = Campaign::create($camp);
            foreach($cam['sources'] as $source_name => $mediums){
                $sc['name'] = $source_name;
                $sc['campaign_id'] = $c->id;
                $source = Source::create($sc);

                foreach($mediums as $medium){
                    $md['source_id'] = $source->id;
                    $md['name'] = $medium;
                    Medium::create($md);
                }
            }
        }

    }
}
