<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMathDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('maths', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->enum('major',['Toán', 'Văn', 'Anh', 'Lý', 'Hoá', 'Tiếng việt', 'Khác'])->nullable();
            $table->string('topic')->nullable();
            $table->smallInteger('level')->default(10);
            $table->smallInteger('grade')->default(1);
            $table->enum('type', ['Trắc nghiệm', 'Tự luận', 'Vấn đáp', 'Khác'])->default('Tự luận');
            $table->text('question');
            $table->json('mc')->nullable;
            $table->text('answer')->nullable;
            $table->json('custom_field')->nullable;
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
        Schema::dropIfExists('maths');
    }
}
