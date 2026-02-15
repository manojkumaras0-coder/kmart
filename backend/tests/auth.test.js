import { jest } from '@jest/globals';

// Mock Supabase using ESM-compatible method
jest.unstable_mockModule('../config/database.js', () => ({
    supabase: {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
    }
}));

// Dynamic imports are required for mocked modules in ESM
const { supabase } = await import('../config/database.js');
const { default: app } = await import('../app.js');
const { default: request } = await import('supertest');

describe('Auth API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/health', () => {
        it('should return 200 and OK status', async () => {
            const res = await request(app).get('/api/health');
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('OK');
        });
    });

    describe('POST /api/auth/register', () => {
        it('should fail if email already exists', async () => {
            // Mock supabase to return an existing user
            supabase.single.mockResolvedValueOnce({
                data: { id: 'test-uuid', email: 'test@example.com' },
                error: null
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@example.com',
                    password: 'Password123!'
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('User already exists with this email');
        });

        it('should successfully register a new user', async () => {
            // Mock supabase: no existing user (for the check)
            supabase.single.mockResolvedValueOnce({
                data: null,
                error: null
            });

            // Mock supabase: successful insertion
            supabase.single.mockResolvedValueOnce({
                data: { id: 'new-uuid', email: 'new@example.com' },
                error: null
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'New',
                    lastName: 'User',
                    email: 'new@example.com',
                    password: 'Password123!'
                });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User registered successfully');
            expect(res.body).toHaveProperty('token');
        });
    });
});
