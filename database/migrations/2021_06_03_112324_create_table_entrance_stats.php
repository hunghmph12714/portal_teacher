<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableEntranceStats extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entrance_stats', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger('center_id');
            $table->date('date');
            $table->smallInteger('init_remain')->default(0);
            $table->smallInteger('init_today')->default(0);
            $table->smallInteger('init_completed')->default(0);
            $table->smallInteger('init_total')->default(0);
            $table->smallInteger('init_1')->default(0);
            $table->smallInteger('init_2')->default(0);
            $table->smallInteger('init_3')->default(0);

            $table->smallInteger('appointment_remain')->default(0);
            $table->smallInteger('appointment_today')->default(0);
            $table->smallInteger('appointment_completed')->default(0);
            $table->smallInteger('appointment_total')->default(0);
            $table->smallInteger('appointment_1')->default(0);
            $table->smallInteger('appointment_2')->default(0);
            $table->smallInteger('appointment_3')->default(0);
            
            $table->smallInteger('result_remain')->default(0);
            $table->smallInteger('result_today')->default(0);
            $table->smallInteger('result_completed')->default(0);
            $table->smallInteger('result_total')->default(0);
            $table->smallInteger('result_1')->default(0);
            $table->smallInteger('result_2')->default(0);
            $table->smallInteger('result_3')->default(0);

            $table->smallInteger('inform_remain')->default(0);
            $table->smallInteger('inform_today')->default(0);
            $table->smallInteger('inform_completed')->default(0);
            $table->smallInteger('inform_total')->default(0);
            $table->smallInteger('inform_1')->default(0);
            $table->smallInteger('inform_2')->default(0);
            $table->smallInteger('inform_3')->default(0);
            $table->smallInteger('inform_4')->default(0);

            $table->smallInteger('final_remain')->default(0);
            $table->smallInteger('final_today')->default(0);
            $table->smallInteger('final_completed')->default(0);
            $table->smallInteger('final_total')->default(0);
            $table->smallInteger('final_1')->default(0);
            $table->smallInteger('final_2')->default(0);
            $table->smallInteger('final_3')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('entrance_stats');
    }
}
