import jwt from 'jsonwebtoken';
import { prisma } from './connect';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {id: string, email: string, role: boolean};
  } catch {
    return null;
  }
}

export async function getCurrentUser(token: string) {
  const decoded = verifyJwt(token);

  if(!decoded) return null;

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.id
    }
  });

  if(!user) return null;

  return user;
}

export async function requireAuth(req: NextRequest): Promise<{
  user: Awaited<ReturnType<typeof getCurrentUser>> | null;
  response?: NextResponse;
}> {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      user: null,
      response: new NextResponse(
        JSON.stringify({ message: 'No token provided' }),
        { status: 401 }
      ),
    };
  }

  const token = authHeader.split(' ')[1];
  const user = await getCurrentUser(token);

  if (!user) {
    return {
      user: null,
      response: new NextResponse(
        JSON.stringify({ message: 'You are not authenticated!' }),
        { status: 401 }
      ),
    };
  }

  return { user };
}