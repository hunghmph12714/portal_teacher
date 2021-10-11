<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTopicQuestionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lms_topic_question', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger('question_id');
            $table->smallInteger('topic_id');
            $table->enum('type', ['main', 'sub']);
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
        Schema::dropIfExists('lms_topic_question');
    }
}
