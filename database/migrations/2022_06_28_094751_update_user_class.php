<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUserClass extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_class', function (Blueprint $table) {
            //
            $table->smallInteger('role')->comment('0: Xem; 1: Trợ giảng; 2: QLLH')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_class', function (Blueprint $table) {
            //
            $table->dropColumn('role');
        });
    }
}