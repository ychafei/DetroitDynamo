import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { auth } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';
import { LIMITS, isValidEmail, normalizeEmail } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Signup() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    try {
      setSubmitting(true);
      // Drop any stale session before the new account's session is created.
      await auth.signOut();
      await auth.signUp(normalizeEmail(email), password);
      await refetchUser();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const code = err?.code;
      const type = err?.type;
      if (code === 409 || type === 'user_already_exists') {
        setError('An account with that email already exists. Sign in instead.');
      } else {
        setError(err?.message || 'Could not create your account.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-[rgba(98,216,255,0.22)] bg-[#061225] text-white shadow-2xl shadow-black/40 p-8 sm:p-10 space-y-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-[#AEBBD0] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>

        <div>
          <h1 className="font-oswald text-2xl sm:text-3xl font-bold tracking-wide text-center">
            Create your account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-[#D7DEEA]">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8390A6] pointer-events-none" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                required
                maxLength={LIMITS.email}
                className="pl-9 bg-white text-[#0B0B0B] placeholder:text-[#8390A6] border-neutral-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-[#D7DEEA]">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8390A6] pointer-events-none" />
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                required
                minLength={8}
                className="pl-9 bg-white text-[#0B0B0B] placeholder:text-[#8390A6] border-neutral-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-sm font-medium text-[#D7DEEA]">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8390A6] pointer-events-none" />
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={submitting}
                required
                className="pl-9 bg-white text-[#0B0B0B] placeholder:text-[#8390A6] border-neutral-300"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[var(--dynamo-blue)] text-[#020714] hover:bg-[var(--dynamo-blue-bright)] py-2.5 rounded-md"
          >
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
}
