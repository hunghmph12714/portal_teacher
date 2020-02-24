<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        //
        Schema::table('users', function(Blueprint $table){
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('phone')->nullable();
            $table->enum('gender',['Nam', 'Nữ'])->default('Nam');
            $table->date('dob')->nullable();
            $table->mediumInteger('city')->nullable();
            $table->mediumInteger('quarter')->nullable();
            $table->mediumInteger('ward')->nullable();
            $table->string('address')->nullable();
            $table->string('avatar')->nullable();
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
