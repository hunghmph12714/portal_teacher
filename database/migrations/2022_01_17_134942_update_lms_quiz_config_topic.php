<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateLmsQuizConfigTopic extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lms_quiz_config_topic', function (Blueprint $table) {
            $table->enum('question_type', ['mc', 'fib', 'matrix', 'essay', 'complex'])->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lms_quiz_config_topic', function (Blueprint $table) {
            //
        });
    }
}