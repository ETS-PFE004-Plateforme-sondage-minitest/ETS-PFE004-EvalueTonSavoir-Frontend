//UserTyper.test.tsx
import { UserType } from "../../Types/UserType";

const user : UserType = {
    name: 'Student',
    id: '123'
}

describe('UserType', () => {
    test('creates a user with name and id', () => {

        expect(user.name).toBe('Student');
        expect(user.id).toBe('123');
    });
});
