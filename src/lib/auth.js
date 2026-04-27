import { base44 } from '@/api/base44Client';

export const auth = {
  getCurrentUser: () => base44.auth.me(),
  signOut: (returnUrl) => (returnUrl ? base44.auth.logout(returnUrl) : base44.auth.logout()),
  signIn: (returnUrl) => base44.auth.redirectToLogin(returnUrl),
  updateCurrentUser: (data) => base44.auth.updateMe(data),
  inviteUser: (email, role) => base44.users.inviteUser(email, role),
};
