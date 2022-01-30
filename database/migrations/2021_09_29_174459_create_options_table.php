<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lms_options', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger('question_id');
            $table->text('content');
            $table->float('weight');
            $table->smallInteger('order')->nullable();
            $table->smallInteger('set')->nullable();
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
        Schema::dropIfExists('lms_options');
    }
}
