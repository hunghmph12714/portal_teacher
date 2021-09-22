<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateEntranceStatDelayLostStep extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('entrance_stats', function (Blueprint $table) {
            //
            $table->integer('init_delay')->default(0);
            $table->integer('init_lost')->default(0);
            $table->integer('appointment_delay')->default(0);
            $table->integer('appointment_lost')->default(0);
            $table->integer('result_delay')->default(0);
            $table->integer('result_lost')->default(0);
            $table->integer('inform_delay')->default(0);
            $table->integer('inform_lost')->default(0);
            $table->integer('final_delay')->default(0);
            $table->integer('final_lost')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('entrance_stats', function (Blueprint $table) {
            //
        });
    }
}
