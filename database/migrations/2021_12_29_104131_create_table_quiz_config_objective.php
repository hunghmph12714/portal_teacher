<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableQuizConfigObjective extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lms_quiz_config_objective', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('objective_id');
            $table->integer('quiz_config_id');
            $table->smallInteger('weight')->default(1);
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
        Schema::dropIfExists('lms_quiz_config_objective');
    }
}
