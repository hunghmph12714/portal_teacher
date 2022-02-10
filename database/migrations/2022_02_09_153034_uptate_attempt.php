<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UptateAttempt extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lms_attempts', function (Blueprint $table) {
            $table->float('score_domain_1')->nullable();
            $table->float('score_domain_2')->nullable();
            $table->float('score_domain_3')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lms_attempts', function (Blueprint $table) {
            $table->dropColumn('score_domain_1');
            $table->dropColumn('score_domain_2');
            $table->dropColumn('score_domain_3');
        });
    }
}