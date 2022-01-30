<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateLmsQuizzes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lms_quizzes', function (Blueprint $table) {
            $table->dateTime('available_date')->nullable()->change();
            $table->string('subject_1')->nullable();
            $table->smallInteger('duration_1')->nullable();
            $table->string('subject_2')->nullable();
            $table->smallInteger('duration_2')->nullable();
            $table->string('subject_3')->nullable();
            $table->smallInteger('duration_3')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lms_quizzes', function (Blueprint $table) {
            $table->dropColumn('subject_1');
            $table->dropColumn('duration_1');
            $table->dropColumn('subject_2');
            $table->dropColumn('duration_2');
            $table->dropColumn('subject_3');
            $table->dropColumn('duration_3');
        });
    }
}
