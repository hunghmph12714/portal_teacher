<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateAttemptDetail extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lms_attempt_details', function (Blueprint $table) {
            $table->float('score')->nullable();
            $table->longText('comment')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lms_attempt_details', function (Blueprint $table) {
            $table->dropColumn('score');
            $table->dropColumn('comment');
        });
    }
}