<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateEntranceTableSourceMedium extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('entrances', function (Blueprint $table) {
            //
            $table->smallInteger('source_id')->nullable();
            $table->smallInteger('medium_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('entrances', function (Blueprint $table) {
            //
        });
    }
}
