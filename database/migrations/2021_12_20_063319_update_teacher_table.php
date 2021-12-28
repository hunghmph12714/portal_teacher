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
        Schema::table('teacher', function (Blueprint $table) {
            $table->string('first_password')->nullable();
            $table->dateTime('sent_otp_at')->nullable();
            $table->string('referral_code')->nullable();
            $table->decimal('percent')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('teacher', function (Blueprint $table) {
            //
        });
    }
}