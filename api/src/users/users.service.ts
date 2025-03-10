import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';

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

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        existingUser.email === createUserDto.email
          ? 'Email already in use'
          : 'Username already in use',
      );
    }

    // Hash password using our modern implementation
    const passwordHash = await hashPassword(createUserDto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        displayName: createUserDto.displayName,
        passwordHash,
      },
    });

    // Return user without password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        memberships: {
          include: {
            group: true,
          },
        },
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email or username is already taken by another user
    if (updateUserDto.email || updateUserDto.username) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            updateUserDto.email ? { email: updateUserDto.email } : {},
            updateUserDto.username ? { username: updateUserDto.username } : {},
          ],
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new ConflictException(
          existingUser.email === updateUserDto.email
            ? 'Email already in use'
            : 'Username already in use',
        );
      }
    }

    // Prepare update data - explicitly define the data structure to match Prisma's expectations
    const updateData: Prisma.UserUpdateInput = {};

    // Copy allowed fields from DTO to updateData
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.username) updateData.username = updateUserDto.username;
    if (updateUserDto.displayName)
      updateData.displayName = updateUserDto.displayName;

    // Hash password if provided using our modern implementation
    if (updateUserDto.password) {
      updateData.passwordHash = await hashPassword(updateUserDto.password);
      // No need to delete password as we're not spreading the DTO anymore
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string) {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Delete user
      await this.prisma.user.delete({
        where: { id },
      });

      return { id };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Safely handle the error by ensuring it's an Error object
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to remove user: ${errorMessage}`);
    }
  }
}
