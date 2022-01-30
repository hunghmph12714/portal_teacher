<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLmsAttemptDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lms_attempt_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('attempt_id');
            $table->integer('question_id');
            $table->json('fib');
            $table->longText('essay');
            $table->json('options');
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
        Schema::dropIfExists('lms_attempt_details');
    }
}
