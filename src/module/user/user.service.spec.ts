import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllUsers', () => {
        it('should return all users from the array', () => {
            const result = service.getAllUsers();

            expect(result).toHaveLength(3);
            expect(result).toEqual([
                { name: "a'laa", age: 24 },
                { name: 'nada', age: 30 },
                { name: 'mohammed', age: 15 },
            ]);
        });
    });

    describe('createUser', () => {
        it('should add a new user and return success message with the updated list', () => {
            const newUser = { name: 'ali', age: 28 };

            const result = service.createUser(newUser);


            expect(result).toEqual({
                message: 'user created',
                users: [
                    { name: "a'laa", age: 24 },
                    { name: 'nada', age: 30 },
                    { name: 'mohammed', age: 15 },
                    { name: 'ali', age: 28 },
                ],
            });


            expect(service.users).toHaveLength(4);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user by name and return the remaining users', () => {

            const result = service.deleteUser('nada');


            expect(result).toEqual({
                message: 'user deleted successfully',
                users: [
                    { name: "a'laa", age: 24 },
                    { name: 'mohammed', age: 15 },
                ],
            });
        });

        it('should not break if the user name does not exist', () => {
            const result = service.deleteUser('unknown_user');

            expect(result).toEqual({
                message: 'user deleted successfully',
                users: [
                    { name: "a'laa", age: 24 },
                    { name: 'nada', age: 30 },
                    { name: 'mohammed', age: 15 },
                ],
            });
        });
    });


});

