import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
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

  console.log('Created permissions');

  // Create roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrator with full access',
      permissions: {
        create: [
          { permissionId: readUsersPermission.id },
          { permissionId: writeUsersPermission.id },
          { permissionId: readGroupsPermission.id },
          { permissionId: writeGroupsPermission.id },
        ],
      },
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'user',
      description: 'Regular user with limited access',
      permissions: {
        create: [
          { permissionId: readUsersPermission.id },
          { permissionId: readGroupsPermission.id },
        ],
      },
    },
  });

  console.log('Created roles');

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      displayName: 'System Administrator',
      passwordHash: await bcrypt.hash('admin123', 10),
      roles: {
        create: [{ roleId: adminRole.id }],
      },
    },
  });

  // Create regular user
  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      username: 'user',
      displayName: 'Regular User',
      passwordHash: await bcrypt.hash('user123', 10),
      roles: {
        create: [{ roleId: userRole.id }],
      },
    },
  });

  console.log('Created users');

  // Create groups
  const engineeringGroup = await prisma.group.create({
    data: {
      name: 'Engineering',
      description: 'Engineering department',
    },
  });

  const marketingGroup = await prisma.group.create({
    data: {
      name: 'Marketing',
      description: 'Marketing department',
    },
  });

  // Create subgroups
  const frontendGroup = await prisma.group.create({
    data: {
      name: 'Frontend',
      description: 'Frontend development team',
      parentGroupId: engineeringGroup.id,
    },
  });

  const backendGroup = await prisma.group.create({
    data: {
      name: 'Backend',
      description: 'Backend development team',
      parentGroupId: engineeringGroup.id,
    },
  });

  console.log('Created groups');

  // Assign users to groups
  await prisma.groupMembership.createMany({
    data: [
      { userId: adminUser.id, groupId: engineeringGroup.id },
      { userId: adminUser.id, groupId: backendGroup.id },
      { userId: regularUser.id, groupId: marketingGroup.id },
    ],
  });

  console.log('Assigned users to groups');
  console.log('Database seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
