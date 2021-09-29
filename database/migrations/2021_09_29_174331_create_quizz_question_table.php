<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuizzQuestionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lms_quizz_question', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger('question_id');
            $table->smallInteger('quizz_id');
            $table->json('option_config');
            $table->smallInteger('max_score');
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
        Schema::dropIfExists('lms_quizz_question');
    }
}
