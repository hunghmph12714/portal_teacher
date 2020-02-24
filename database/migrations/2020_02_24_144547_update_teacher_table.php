<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTeacherTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('teacher', function (Blueprint $table) {
            $table->string('contract')->nullable();
            $table->integer('percent_salary')->nullable();
            $table->integer('salary_per_hour')->nullable();
            $table->integer('basic_salary_id')->nullable();
            $table->integer('insurance')->nullable();
            $table->integer('personal_tax')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
