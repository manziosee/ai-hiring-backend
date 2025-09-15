export interface MockPrismaService {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    findMany: jest.Mock;
  };
  job: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    findMany: jest.Mock;
    delete: jest.Mock;
  };
  candidate: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    findMany: jest.Mock;
  };
  application: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    findMany: jest.Mock;
  };
  screeningResult: {
    findUnique: jest.Mock;
    create: jest.Mock;
    findMany: jest.Mock;
  };
  interview: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    findMany: jest.Mock;
  };
}

export function createMockPrismaService(): MockPrismaService {
  return {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    job: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    candidate: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    application: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    screeningResult: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    interview: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };
}
