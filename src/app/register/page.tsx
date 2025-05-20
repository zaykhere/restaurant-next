'use client';

import { API } from '@/utils/axios';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = RegisterSchema.safeParse(form);
    if (!validation.success) {
      toast.error('Please enter a valid email and password (min 6 chars)');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);

      const data = res.data

      if (!data) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Registration successful');
      // Redirect user to dashboard, etc.
    } catch (err: any) {
      console.log({err})
      toast.error(err?.response?.data?.error || err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-400 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-red-500">Register</h1>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          disabled={loading}
        >
          Register
        </button>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-red-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
