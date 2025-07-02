<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auth_id')->constrained('authentications')->onDelete('cascade')->index();
            $table->string('first_name',16)->nullable();
            $table->string('last_name',16)->nullable();
            $table->date('dob')->nullable();
            $table->string('timezone_preferred',40)->nullable();
            $table->string('timezone_last_known',40);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
