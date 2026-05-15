// Where a signed-in user should land by role: admins → admin portal,
// coaches → coach portal, everyone else → client dashboard.
export function homePathForRole(user) {
  const role = user?.role;
  if (role === 'admin' || role === 'super_admin') return '/admin';
  if (role === 'coach') return '/coach';
  return '/dashboard';
}
