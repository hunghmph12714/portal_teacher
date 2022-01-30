<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableQuizConfigTopics extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lms_quiz_config_topic', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('quiz_config_id');
            $table->integer('topic_id');
            
            $table->enum('question_level', ['NB', 'TH', 'VDT', 'VDC']);
            $table->enum('question_type', ['mc', 'fib', 'matrix', 'essay']);
            $table->smallInteger('quantity')->default(0);
            $table->smallInteger('score')->default(0);
            $table->string('subject');
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
        Schema::dropIfExists('lms_quiz_config_topic');
    }
}
