import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/utils/connect';
import { registerSchema } from '@/utils/validators/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return NextResponse.json({ message: 'User registered' });
  } catch (error) {
    console.log({error})
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
