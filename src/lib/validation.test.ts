import { describe, it, expect } from 'vitest';
import { 
  ProjectSchema, 
  formatValidationErrors, 
  validateContent, 
  isValidExperience, 
  isValidSkill 
} from './validation';
import { z } from 'zod';

describe('ProjectSchema', () => {
  const validProject = {
    id: 'project-1',
    title: 'Test Project',
    description: 'A project with at least ten characters',
    tech: ['React', 'TypeScript'],
    github: 'https://github.com/user/repo',
    live: 'https://project.com',
    color: 'bg-blue-500',
    tags: ['web']
  };

  it('should validate a correct project', () => {
    const result = ProjectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('should fail if ID is missing', () => {
    const { id: _id, ...invalidProject } = validProject;
    const result = ProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });

  it('should fail if description is too short', () => {
    const result = ProjectSchema.safeParse({
      ...validProject,
      description: 'short'
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Description must be at least 10 characters');
    }
  });

  it('should fail with invalid URLs', () => {
    const result = ProjectSchema.safeParse({
      ...validProject,
      github: 'not-a-url'
    });
    expect(result.success).toBe(false);
  });
});

describe('formatValidationErrors', () => {
  it('should format Zod errors into an array of strings', () => {
    const schema = z.object({
      name: z.string().min(3, 'Too short'),
      age: z.number().min(18, 'Too young')
    });

    const result = schema.safeParse({ name: 'Jo', age: 17 });
    if (!result.success) {
      const formatted = formatValidationErrors(result.error);
      expect(Array.isArray(formatted)).toBe(true);
      expect(formatted).toContain('name: Too short');
      expect(formatted).toContain('age: Too young');
    }
  });
});

describe('validateContent', () => {
  it('should return isValid true for correct data', () => {
    const data = {
      id: 'skill-1',
      icon: () => null,
      title: 'Testing',
      description: 'A long enough description for skills',
      color: 'text-red-500',
      category: 'development'
    };

    const result = validateContent(data, (d) => z.any().safeParse(d));
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should return isValid false and errors for incorrect data', () => {
    const schema = z.object({ value: z.number() });
    const result = validateContent({ value: 'not-a-number' }, (d) => schema.safeParse(d));
    
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('value');
  });
});

describe('Type Guards', () => {
  it('isValidExperience should identify correct data', () => {
    const correctData = {
      id: 'exp-1',
      year: '2023',
      role: 'Developer',
      company: 'Tech Co',
      description: 'Worked on many projects with great success and impact',
      achievements: ['Won award'],
      type: 'full-time'
    };
    expect(isValidExperience(correctData)).toBe(true);
  });

  it('isValidSkill should identify correct data', () => {
    const correctData = {
      id: 'skill-1',
      icon: () => null,
      title: 'JS',
      description: 'JavaScript programming language',
      color: 'bg-yellow-400',
      category: 'development'
    };
    expect(isValidSkill(correctData)).toBe(true);
  });
});
