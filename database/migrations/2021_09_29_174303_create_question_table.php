<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lms_questions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->enum('question_level', ['NB', 'TH', 'VDT', 'VDC']);
            $table->enum('question_type', ['mc', 'fib', 'matrix', 'essay']);
            $table->text('statement')->nullable();
            $table->text('content')->nullable();
            $table->enum('complex', ['main', 'sub'])->nullable();
            $table->smallInteger('ref_question_id')->nullable();
            $table->boolean('public')->default(true);
            $table->text('hint');
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
        Schema::dropIfExists('lms_questions');
    }
}
