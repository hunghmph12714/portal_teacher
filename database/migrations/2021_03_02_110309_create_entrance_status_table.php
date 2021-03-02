<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntranceStatusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entrance_status', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('entrance_id');
            $table->integer('status_id');
            $table->integer('user_id');
            $table->string('comment')->nullable();
            $table->string('reason')->nullable();
            $table->enum('active', [0,1])->default(0);
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
        Schema::dropIfExists('entrance_status');
    }
}
