<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntrancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entrances', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('student_id');
            $table->integer('course_id')->nullable();
            $table->integer('center_id');

            $table->datetime('test_time')->nullable();
            $table->string('test_answers')->nullable();
            $table->string('test_score')->nullable();
            $table->string('test_note')->nullable();

            $table->string('note')->nullable();
            $table->smallInteger('priority')->default(0);
            $table->smallInteger('step_id')->nullable();
            $table->datetime('step_updated_at')->nullable();

            $table->smallInteger('status_id')->nullable();

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
        Schema::dropIfExists('entrances');
    }
}
