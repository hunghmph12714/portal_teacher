<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTicketsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('student_id');
            $table->integer('class_id')->nullable();
            $table->integer('parent_id');
            $table->integer('department_id')->default(0);
            $table->string('content');
            $table->string('title')->nullable();
            $table->integer('status_id')->default(4);
            $table->integer('priority_id')->default(0);
            $table->integer('user_id');
            $table->integer('agent_id')->nullable();
            $table->date('deadline')->nullable();
            $table->date('completed_at')->nullable();
            $table->smallInteger('published')->default(0);
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
        Schema::dropIfExists('tickets');
    }
}
