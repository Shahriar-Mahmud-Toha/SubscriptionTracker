<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupExpiredTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cleanup:password_resets';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete expired password reset tokens';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::table('password_resets')->where('expires_at', '<', now())->delete();
        $this->info('Expired password reset tokens deleted.');
    }
}
