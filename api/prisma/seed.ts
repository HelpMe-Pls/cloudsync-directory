import { PrismaClient } from '@prisma/client';

// Modern password hashing using Web Crypto API (fully supported in Bun)
async function hashPassword(password: string): Promise<string> {
  // Convert password string to Uint8Array
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);

  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Hash the password with the salt using SHA-256
  const passwordHash = await crypto.subtle.digest(
    'SHA-256',
    new Uint8Array([...salt, ...passwordData]),
  );

  // Convert the hash to a Base64 string with the salt prepended
  const hashArray = Array.from(new Uint8Array(passwordHash));
  const saltArray = Array.from(salt);
  const hashBase64 = btoa(String.fromCharCode(...saltArray, ...hashArray));

  return hashBase64;
}

const prisma = new PrismaClient();

async function main(): Promise<void> {
  try {
    // Clear existing data
    await prisma.rolePermission.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.groupMembership.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.user.deleteMany();
    await prisma.group.deleteMany();

    console.log('Seeding database...');

    // Create permissions
    const readUsersPermission = await prisma.permission.create({
      data: {
        name: 'users:read',
        description: 'Read users information',
      },
    });

    const writeUsersPermission = await prisma.permission.create({
      data: {
        name: 'users:write',
        description: 'Create and update users',
      },
    });

    const deleteUsersPermission = await prisma.permission.create({
      data: {
        name: 'users:delete',
        description: 'Delete users',
      },
    });

    const readGroupsPermission = await prisma.permission.create({
      data: {
        name: 'groups:read',
        description: 'Read groups information',
      },
    });

    const writeGroupsPermission = await prisma.permission.create({
      data: {
        name: 'groups:write',
        description: 'Create and update groups',
      },
    });

    const deleteGroupsPermission = await prisma.permission.create({
      data: {
        name: 'groups:delete',
        description: 'Delete groups',
      },
    });

    console.log('Created permissions');

    // Create roles
    const adminRole = await prisma.role.create({
      data: {
        name: 'admin',
        description: 'Administrator with full access',
      },
    });

    const userRole = await prisma.role.create({
      data: {
        name: 'user',
        description: 'Regular user with limited access',
      },
    });

    console.log('Created roles');

    // Assign permissions to roles
    await prisma.rolePermission.createMany({
      data: [
        { roleId: adminRole.id, permissionId: readUsersPermission.id },
        { roleId: adminRole.id, permissionId: writeUsersPermission.id },
        { roleId: adminRole.id, permissionId: deleteUsersPermission.id },
        { roleId: adminRole.id, permissionId: readGroupsPermission.id },
        { roleId: adminRole.id, permissionId: writeGroupsPermission.id },
        { roleId: adminRole.id, permissionId: deleteGroupsPermission.id },
        { roleId: userRole.id, permissionId: readUsersPermission.id },
        { roleId: userRole.id, permissionId: readGroupsPermission.id },
      ],
    });

    console.log('Assigned permissions to roles');

    // Create admin user
    const adminPasswordHash = await hashPassword('admin123');
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@cloudsync.com',
        username: 'admin',
        displayName: 'System Administrator',
        passwordHash: adminPasswordHash,
        isActive: true,
      },
    });

    // Create regular user
    const userPasswordHash = await hashPassword('user123');
    const regularUser = await prisma.user.create({
      data: {
        email: 'user@cloudsync.com',
        username: 'user',
        displayName: 'Regular User',
        passwordHash: userPasswordHash,
        isActive: true,
      },
    });

    console.log('Created users');

    // Assign roles to users
    await prisma.userRole.createMany({
      data: [
        { userId: adminUser.id, roleId: adminRole.id },
        { userId: regularUser.id, roleId: userRole.id },
      ],
    });

    console.log('Assigned roles to users');

    // Create groups
    const engineeringGroup = await prisma.group.create({
      data: {
        name: 'engineering',
        description: 'Software engineering team',
      },
    });

    const marketingGroup = await prisma.group.create({
      data: {
        name: 'marketing',
        description: 'Marketing and sales team',
      },
    });

    console.log('Created groups');

    // Assign users to groups
    await prisma.groupMembership.createMany({
      data: [
        { userId: adminUser.id, groupId: engineeringGroup.id },
        { userId: regularUser.id, groupId: marketingGroup.id },
      ],
    });

    console.log('Assigned users to groups');
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the main function with proper error handling
void main();
