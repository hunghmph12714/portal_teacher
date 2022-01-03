<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateQuizConfigTableAddGradeSubject extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lms_quiz_configs', function (Blueprint $table) {
            //
            $table->string('grade');
            // $table->string('subj')
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lms_quiz_configs', function (Blueprint $table) {
            //
        });
    }
}
