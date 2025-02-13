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
        Schema::create('api_sessions', function (Blueprint $table) {
            $table->id();
            // $table->foreign('auth_id', 'fk_api_sessions_auth_id')->references('id')->on('authentications')->onDelete('cascade')->index();
            $table->unsignedBigInteger('auth_id')->index();
            $table->text('access_token');
            $table->text('refresh_token');
            $table->string('ip_address', 45)->nullable();  // IP address of the device (IPv6 compatible)
            $table->text('user_agent')->nullable();
            $table->string('device_name')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->foreign('auth_id', 'fk_api_sessions_auth_id')->references('id')->on('authentications')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_sessions');
    }
};
