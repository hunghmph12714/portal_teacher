<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Guard;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use \App\User;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('role_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('permissions')->truncate();
        DB::table('roles')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $admin_permission =[
            [ 'name' => 'create_school'],
            [ 'name' => 'view_school']
        ];
        $this->createRoleAndPermissions('admin', $admin_permission);
    }

    private function createRoleAndPermissions($role_name, $permissions = []) {
        $role = Role::create(['name' => $role_name]);
        $guard = Guard::getDefaultName(static::class);
        foreach ($permissions as &$permission) {
            $permission['guard_name'] = $guard;
        }
        $permissions = Permission::insert($permissions);
        $role->permissions()->sync($permissions);

//        $admin = User::first();
//        $admin->assignRole($role_name);
    }
}
