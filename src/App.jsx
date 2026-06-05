import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { homePathForRole } from '@/lib/roleHome';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import {
  RequireAuth,
  RequireCoach,
  RequireLinkedCoach,
  RequireAdmin,
  RequireClient,
} from '@/components/guards/RouteGuards';
import CoachLayout from '@/components/coach-portal/CoachLayout';
import CoachOverview from '@/pages/coach/CoachOverview';
import CoachSessions from '@/pages/coach/CoachSessions';
import CoachClients from '@/pages/coach/CoachClients';
import CoachClientDetail from '@/pages/coach/CoachClientDetail';
import CoachEarnings from '@/pages/coach/CoachEarnings';
import CoachProfile from '@/pages/coach/CoachProfile';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import DetroitDynamoLayout from '@/components/detroit-dynamo/DetroitDynamoLayout';

// Public pages
import VerifyCoachLink from '@/pages/VerifyCoachLink';
import VerifyEmail from '@/pages/VerifyEmail';
import Book from '@/pages/Book';
import CoachDetail from '@/pages/CoachDetail';
import Apply from '@/pages/Apply';
import ApplyTeamPlayer from '@/pages/apply/ApplyTeamPlayer';
import ApplyTeamCoach from '@/pages/apply/ApplyTeamCoach';
import ApplyPrivateTrainingCoach from '@/pages/apply/ApplyPrivateTrainingCoach';
import DetroitDynamoHome from '@/pages/detroit-dynamo/DetroitDynamoHome';
import DetroitDynamoBrand from '@/pages/detroit-dynamo/DetroitDynamoBrand';
import {
  DetroitDynamoAcademy,
  DetroitDynamoAbout,
  DetroitDynamoBook,
  DetroitDynamoFC,
  DetroitDynamoResults,
  DetroitDynamoTraining,
} from '@/pages/detroit-dynamo/DetroitDynamoSecondaryPages';
import {
  DetroitDynamoAdminFoundation,
  DetroitDynamoCampsClinics,
  DetroitDynamoContact,
  DetroitDynamoScheduleResults,
  DetroitDynamoSeniorMen,
  DetroitDynamoSeniorWomen,
  DetroitDynamoSponsors,
  DetroitDynamoTeams,
  DetroitDynamoTryouts,
  DetroitDynamoYouthClub,
} from '@/pages/detroit-dynamo/DetroitDynamoClubPages';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Unsubscribe from '@/pages/Unsubscribe';
import Pay from '@/pages/Pay';
import ParentConsent from '@/pages/ParentConsent';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Authenticated pages
import Dashboard from '@/pages/Dashboard';
import Messages from '@/pages/Messages';
import Settings from '@/pages/Settings';
import Matching from '@/pages/Matching';
import CoachSchedule from '@/pages/CoachSchedule';

// Admin pages
import AdminPanel from '@/pages/admin/AdminPanel';
import AdminCoaches from '@/pages/admin/AdminCoaches';
import AdminTeam from '@/pages/admin/AdminTeam';
import AdminLcfc from '@/pages/admin/AdminLcfc';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminContent from '@/pages/admin/AdminContent';
import AdminPricing from '@/pages/admin/AdminPricing';
import AdminApplications from '@/pages/admin/AdminApplications';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminUnsubscribes from '@/pages/admin/AdminUnsubscribes';
import AdminCredits from '@/pages/admin/AdminCredits';
import AdminDetroitDynamo from '@/pages/admin/AdminDetroitDynamo';
import AdminDetroitDynamoModule from '@/pages/admin/AdminDetroitDynamoModule';

// Public root: guests see Detroit Dynamo; signed-in users are
// sent to their role home (admin → /admin, coach → /coach, client →
// /dashboard) so they don't get stranded on the public site after login.
const RootRoute = () => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) {
    return <Navigate to={homePathForRole(user)} replace />;
  }
  return <Navigate to="/detroit-dynamo" replace />;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-secondary border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      <Route path="/detroit-dynamo" element={<DetroitDynamoLayout />}>
        <Route index element={<DetroitDynamoHome />} />
        <Route path="training" element={<DetroitDynamoTraining />} />
        <Route path="fc" element={<DetroitDynamoFC />} />
        <Route path="club" element={<Navigate to="/detroit-dynamo/fc" replace />} />
        <Route path="academy" element={<DetroitDynamoAcademy />} />
        <Route path="youth-club" element={<DetroitDynamoYouthClub />} />
        <Route path="senior-men" element={<DetroitDynamoSeniorMen />} />
        <Route path="senior-women" element={<DetroitDynamoSeniorWomen />} />
        <Route path="tryouts" element={<DetroitDynamoTryouts />} />
        <Route path="teams" element={<DetroitDynamoTeams />} />
        <Route path="schedule-results" element={<DetroitDynamoScheduleResults />} />
        <Route path="schedule" element={<Navigate to="/detroit-dynamo/schedule-results" replace />} />
        <Route path="camps-clinics" element={<DetroitDynamoCampsClinics />} />
        <Route path="camps" element={<Navigate to="/detroit-dynamo/camps-clinics" replace />} />
        <Route path="sponsors" element={<DetroitDynamoSponsors />} />
        <Route path="book" element={<DetroitDynamoBook />} />
        <Route path="results" element={<DetroitDynamoResults />} />
        <Route path="contact" element={<DetroitDynamoContact />} />
        <Route path="about" element={<DetroitDynamoAbout />} />
        <Route path="brand" element={<DetroitDynamoBrand />} />
        <Route path="admin-foundation" element={<DetroitDynamoAdminFoundation />} />
      </Route>
      <Route path="/detroit-dynamo-preview" element={<Navigate to="/detroit-dynamo" replace />} />

      <Route element={<PublicLayout />}>
        {/* Public routes */}
        <Route path="/" element={<RootRoute />} />
        <Route path="/about" element={<Navigate to="/detroit-dynamo/about" replace />} />
        <Route path="/team" element={<Navigate to="/detroit-dynamo/teams" replace />} />
        <Route path="/lcfc" element={<Navigate to="/detroit-dynamo/senior-men" replace />} />
        <Route path="/verify-coach-link" element={<VerifyCoachLink />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/lcfc/roster" element={<Navigate to="/detroit-dynamo/teams" replace />} />
        <Route path="/lcfc/schedule" element={<Navigate to="/detroit-dynamo/schedule-results" replace />} />
        <Route path="/lcfc/tryouts" element={<Navigate to="/detroit-dynamo/tryouts" replace />} />
        <Route path="/lcfc/staff" element={<Navigate to="/detroit-dynamo/about" replace />} />
        <Route path="/lcfc/sponsors" element={<Navigate to="/detroit-dynamo/sponsors" replace />} />
        <Route path="/lcfc/news" element={<Navigate to="/detroit-dynamo" replace />} />
        <Route path="/lcfc/learn-more" element={<Navigate to="/detroit-dynamo/fc" replace />} />
        <Route path="/team/upsl" element={<Navigate to="/detroit-dynamo/senior-men" replace />} />
        <Route path="/team/roster" element={<Navigate to="/detroit-dynamo/teams" replace />} />
        <Route path="/team/schedule" element={<Navigate to="/detroit-dynamo/schedule-results" replace />} />
        <Route path="/team/tryouts" element={<Navigate to="/detroit-dynamo/tryouts" replace />} />
        <Route path="/team/coaches" element={<Navigate to="/detroit-dynamo/about" replace />} />
        <Route path="/team/gallery" element={<Navigate to="/detroit-dynamo/teams" replace />} />
        <Route path="/book" element={<Book />} />
        <Route path="/coaches/:coachId" element={<CoachDetail />} />
        <Route path="/blog" element={<Navigate to="/detroit-dynamo" replace />} />
        <Route path="/blog/:slug" element={<Navigate to="/detroit-dynamo" replace />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/team-player" element={<ApplyTeamPlayer />} />
        <Route path="/apply/team-coach" element={<ApplyTeamCoach />} />
        <Route path="/apply/private-training-coach" element={<ApplyPrivateTrainingCoach />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/parent-consent" element={<ParentConsent />} />

        {/* Authenticated — any signed-in user */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Client-only */}
        <Route element={<RequireClient />}>
          <Route path="/matching" element={<Matching />} />
        </Route>

        {/* Coach portal — shell + nested pages. RequireCoach (admins also pass).
            Individual pages handle the "no coach_id" state gracefully. */}
        <Route element={<RequireCoach />}>
          <Route element={<CoachLayout />}>
            <Route path="/coach" element={<CoachOverview />} />
            <Route path="/coach/sessions" element={<CoachSessions />} />
            <Route path="/coach/schedule" element={<CoachSchedule />} />
            <Route path="/coach/messages" element={<Messages />} />
            <Route path="/coach/clients" element={<CoachClients />} />
            <Route path="/coach/clients/:clientEmail" element={<CoachClientDetail />} />
            <Route path="/coach/earnings" element={<CoachEarnings />} />
            <Route path="/coach/profile" element={<CoachProfile />} />
          </Route>
        </Route>

        {/* Legacy route redirects → coach portal */}
        <Route path="/coach-schedule" element={<Navigate to="/coach/schedule" replace />} />
        <Route path="/coach-setup" element={<Navigate to="/coach" replace />} />

        {/* Admin-only */}
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/coaches" element={<AdminCoaches />} />
          <Route path="/admin/team" element={<AdminTeam />} />
          <Route path="/admin/lcfc" element={<AdminLcfc />} />
          <Route path="/admin/detroit-dynamo" element={<AdminDetroitDynamo />} />
          <Route path="/admin/detroit-dynamo/modules/:moduleSlug" element={<AdminDetroitDynamoModule />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/credits" element={<AdminCredits />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/pricing" element={<AdminPricing />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/unsubscribes" element={<AdminUnsubscribes />} />
        </Route>
      </Route>

      <Route path="/login"           element={<Login />} />
      <Route path="/signup"          element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password"  element={<ResetPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
