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
            ['name' => 'view_roles', 'name_vn' => 'Xem', 'subject' => 'Phân Quyền'],
            ['name' => 'create_roles', 'name_vn' => 'Tạo mới', 'subject' => 'Phân Quyền'],
            ['name' => 'delete_roles', 'name_vn' => 'Xoá', 'subject' => 'Phân Quyền'],
            ['name' => 'assign_roles', 'name_vn' => 'Thay đổi phân quyền', 'subject' => 'Phân Quyền'],

            ['name' => 'view_users', 'name_vn' => 'Xem', 'subject' => 'Người dùng'],
            ['name' => 'create_users', 'name_vn' => 'Tạo mới', 'subject' => 'Người dùng'],
            ['name' => 'delete_users', 'name_vn' => 'Xoá', 'subject' => 'Người dùng'],
            ['name' => 'assign_permission', 'name_vn' => 'Thay đổi phân quyền', 'subject' => 'Người dùng'],

            ['name' => 'view_teachers', 'name_vn' => 'Xem', 'subject' => 'Giáo viên'],
            ['name' => 'edit_teachers', 'name_vn' => 'Sửa', 'subject' => 'Giáo viên'],
            ['name' => 'delete_teachers', 'name_vn' => 'Xoá', 'subject' => 'Giáo viên'],
        ];
        $tpdt_permission = [
        ];
        $this->createRoleAndPermissions('admin', $admin_permission);
        $this->createRoleAndPermissions('Trưởng phòng Nhân sự', $tpdt_permission);
    }

    private function createRoleAndPermissions($role_name, $permissions = []) {
        $role = Role::create(['name' => $role_name]);
        $guard = Guard::getDefaultName(static::class);
        $pers = [];
        foreach ($permissions as &$permission) {
            $permission['guard_name'] = $guard;
        }
        // print_r($permissions);
        Permission::insert($permissions);
        $role->syncPermissions(array_column( $permissions, 'name'));

//        $admin = User::first();
//        $admin->assignRole($role_name);
    }
}
