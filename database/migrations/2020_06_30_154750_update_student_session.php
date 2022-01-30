<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateStudentSession extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('student_session', function (Blueprint $table) {
            //
            $table->integer('max_score')->default(0);
            $table->integer('btvn_max')->default(0);
            $table->integer('btvn_score')->default(0);
            $table->integer('btvn_complete')->default(0);
            $table->string('comment')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('student_session', function (Blueprint $table) {
            //
        });
    }
}
