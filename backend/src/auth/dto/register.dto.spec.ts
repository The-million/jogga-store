import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should reject empty email', async () => {
    const dto = new RegisterDto();
    dto.email = '';
    dto.password = 'Secret123';
    dto.fullName = 'John Doe';
    dto.phone = '+2421234567890';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should reject short password', async () => {
    const dto = new RegisterDto();
    dto.email = 'john@test.com';
    dto.password = '123';
    dto.fullName = 'John Doe';
    dto.phone = '+2421234567890';
    const errors = await validate(dto);
    const passwordError = errors.find((e) => e.property === 'password');
    expect(passwordError).toBeDefined();
  });

  it('should accept valid dto', async () => {
    const dto = new RegisterDto();
    dto.email = 'john@test.com';
    dto.password = 'Secret123';
    dto.fullName = 'John Doe';
    dto.phone = '+2421234567890';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
