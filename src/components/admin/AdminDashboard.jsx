import React, { useState, useEffect } from 'react';
import { Menu, RefreshCw, Database, CheckCircle, AlertCircle, ExternalLink, ShieldCheck, Copy, CheckCheck, AlertTriangle, X, Sparkles } from 'lucide-react';
import { supabase, isConfigured } from '../../lib/supabase';
import AdminSidebar from './AdminSidebar';
import DashboardStats from './DashboardStats';
import RSVPTable from './RSVPTable';
import RSVPDetails from './RSVPDetails';

export default function AdminDashboard({ onLogout, onReturnHome }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRsvp, setSelectedRsvp] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [showRlsModal, setShowRlsModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);
  const [supabaseEmptyDetected, setSupabaseEmptyDetected] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Fetch RSVPs from Supabase
  const fetchRsvps = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error:', error);
      }

      const fetched = data || [];
      const localBackups = JSON.parse(localStorage.getItem('james_cristel_submitted_rsvps') || '[]');

      if (fetched.length > 0) {
        // Live Supabase returned records successfully!
        setRsvps(fetched);
        setUsingLocalFallback(false);
        setSupabaseEmptyDetected(false);
      } else if (localBackups.length > 0) {
        // Supabase returned 0 (often because Row-Level Security blocks SELECT),
        // but this browser has locally submitted RSVPs. Display them immediately!
        setRsvps(localBackups);
        setUsingLocalFallback(true);
        setSupabaseEmptyDetected(true);
      } else {
        setRsvps([]);
        setUsingLocalFallback(false);
        if (isConfigured) {
          setSupabaseEmptyDetected(true);
        }
      }
    } catch (err) {
      console.error('Error fetching RSVPs:', err);
      const localBackups = JSON.parse(localStorage.getItem('james_cristel_submitted_rsvps') || '[]');
      if (localBackups.length > 0) {
        setRsvps(localBackups);
        setUsingLocalFallback(true);
      }
      showToast('Error connecting to Supabase database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRsvps();

    // Setup Realtime subscription
    const channel = supabase
      .channel('public:rsvps')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, () => {
        fetchRsvps();
        showToast('Database updated in real-time');
      })
      .subscribe();

    return () => {
      supabase.channel('public:rsvps').unsubscribe();
    };
  }, []);

  // Copy SQL fix to clipboard
  const handleCopySql = () => {
    const sqlText = 'ALTER TABLE public.rsvps DISABLE ROW LEVEL SECURITY;';
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    showToast('SQL command copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Update Status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      if (!String(id).startsWith('local-')) {
        const { error } = await supabase
          .from('rsvps')
          .update({ status: newStatus })
          .eq('id', id);
        if (error) console.warn('Supabase status update error:', error);
      }

      setRsvps((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );

      // Update local storage backup
      try {
        const localBackups = JSON.parse(localStorage.getItem('james_cristel_submitted_rsvps') || '[]');
        const updated = localBackups.map(r => r.id === id ? { ...r, status: newStatus } : r);
        localStorage.setItem('james_cristel_submitted_rsvps', JSON.stringify(updated));
      } catch (e) {}

      if (selectedRsvp && selectedRsvp.id === id) {
        setSelectedRsvp((prev) => ({ ...prev, status: newStatus }));
      }

      showToast(`RSVP status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update status.');
    }
  };

  // Delete RSVP
  const handleDeleteRsvp = async (id) => {
    try {
      if (!String(id).startsWith('local-')) {
        const { error } = await supabase.from('rsvps').delete().eq('id', id);
        if (error) console.warn('Supabase delete error:', error);
      }

      setRsvps((prev) => prev.filter((r) => r.id !== id));

      // Update local storage backup
      try {
        const localBackups = JSON.parse(localStorage.getItem('james_cristel_submitted_rsvps') || '[]');
        const updated = localBackups.filter(r => r.id !== id);
        localStorage.setItem('james_cristel_submitted_rsvps', JSON.stringify(updated));
      } catch (e) {}

      if (selectedRsvp && selectedRsvp.id === id) {
        setSelectedRsvp(null);
      }
      showToast('RSVP record deleted.');
    } catch (err) {
      console.error('Error deleting RSVP:', err);
      showToast('Failed to delete RSVP.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-poppins">
      
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        onReturnHome={onReturnHome}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white/90 border-b border-champagne/60 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-weddingBrown hover:bg-ivory border border-champagne"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold hidden sm:block" />
              <span className="text-xs font-semibold tracking-wider text-weddingBrown uppercase">
                {activeTab === 'dashboard' ? 'Overview' : activeTab === 'rsvps' ? 'Guest Directory' : 'System Configuration'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-medium text-emerald-800 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime Connected</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchRsvps}
              disabled={refreshing}
              className="p-2 rounded-xl bg-ivory text-weddingBrown hover:bg-champagne/40 border border-taupe/30 transition-colors"
              title="Refresh RSVP Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-gold' : ''}`} />
            </button>
          </div>
        </header>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 py-2.5 px-4 rounded-xl bg-weddingBrown text-champagne-light text-xs font-medium tracking-wide shadow-wedding-lg border border-gold/40 animate-fadeIn">
            {toastMsg}
          </div>
        )}

        {/* Page Content Body */}
        <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Main Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-gold">
                Administrator View
              </span>
              <h1 className="text-2xl sm:text-3xl font-light text-weddingBrown tracking-wide mt-0.5">
                Wedding RSVP Dashboard
              </h1>
              <p className="text-xs text-taupe-dark tracking-wider mt-1">
                James &amp; Cristel — January 28, 2027
              </p>
            </div>

            <button
              onClick={() => setShowRlsModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-champagne/40 hover:bg-champagne/60 text-weddingBrown text-xs font-medium tracking-wider border border-gold/40 transition-colors self-start sm:self-auto"
            >
              <Database className="w-3.5 h-3.5 text-gold" />
              <span>Supabase SQL &amp; Permissions</span>
            </button>
          </div>

          {/* RLS Permission Warning Banner (Appears when Supabase returns 0 records or local fallback is active) */}
          {(supabaseEmptyDetected || usingLocalFallback) && (
            <div className="rounded-2xl p-4 sm:p-5 bg-amber-50/90 border border-amber-300 shadow-sm space-y-3 animate-fadeIn">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                    {usingLocalFallback 
                      ? 'Displaying Locally Saved Submissions (Supabase RLS Active)'
                      : 'RSVPs Submitted in Form But Not Showing Here?'}
                  </h4>
                  <p className="text-xs text-amber-800 font-light mt-1 leading-relaxed">
                    {usingLocalFallback
                      ? 'You are viewing submissions cached on this device. Supabase is currently blocking direct queries because Row-Level Security (RLS) is active on the rsvps table.'
                      : 'Your Supabase database table has Row-Level Security (RLS) enabled, which prevents anonymous/admin SELECT queries without a policy. Run this quick 1-line command in your Supabase SQL Editor to make all RSVPs display immediately:'}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <code className="px-3 py-1.5 rounded-lg bg-amber-100/90 border border-amber-300 text-[11px] font-mono text-amber-950 font-medium select-all">
                      ALTER TABLE public.rsvps DISABLE ROW LEVEL SECURITY;
                    </code>
                    <button
                      onClick={handleCopySql}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
                    >
                      {copiedSql ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                    </button>
                    <a
                      href="https://supabase.com/dashboard/project/gvrzcexgwppnfqirpiju/sql/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 text-xs font-medium tracking-wider transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Open Supabase SQL Editor</span>
                      <ExternalLink className="w-3 h-3 text-amber-700" />
                    </a>
                  </div>
                  <p className="text-[11px] text-amber-700 mt-2 italic">
                    Tip: After clicking "Run" in Supabase, click the refresh button (top right) and your RSVPs will appear instantly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Dynamic Statistics Cards */}
              <DashboardStats rsvps={rsvps} />

              {/* Recent RSVPs Table Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-weddingBrown tracking-wider uppercase">
                    Recent RSVP Submissions
                  </h3>
                  <button
                    onClick={() => setActiveTab('rsvps')}
                    className="text-xs font-medium text-gold hover:text-gold-dark tracking-wider uppercase underline underline-offset-4"
                  >
                    View All Guests
                  </button>
                </div>

                <RSVPTable
                  rsvps={rsvps.slice(0, 5)}
                  onViewRsvp={(rsvp) => setSelectedRsvp(rsvp)}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteRsvp={handleDeleteRsvp}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Full RSVPs Directory */}
          {activeTab === 'rsvps' && (
            <div className="space-y-6">
              <DashboardStats rsvps={rsvps} />

              <div className="wedding-card rounded-3xl p-6 border-champagne">
                <h3 className="text-lg font-light text-weddingBrown tracking-wider uppercase mb-6">
                  All Guest RSVP Responses
                </h3>
                <RSVPTable
                  rsvps={rsvps}
                  onViewRsvp={(rsvp) => setSelectedRsvp(rsvp)}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteRsvp={handleDeleteRsvp}
                />
              </div>
            </div>
          )}

          {/* Tab 3: Supabase Settings / Status */}
          {activeTab === 'settings' && (
            <div className="wedding-card rounded-3xl p-6 sm:p-8 border-gold/40 max-w-2xl space-y-6">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-gold" />
                <div>
                  <h3 className="text-lg font-light text-weddingBrown uppercase tracking-wider">
                    Supabase PostgreSQL Integration
                  </h3>
                  <span className="text-xs text-taupe-dark">
                    Database &amp; Authentication Architecture
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-ivory border border-champagne space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-taupe-dark font-medium">Connection Mode:</span>
                  <span className={`font-semibold uppercase tracking-wider ${isConfigured ? 'text-emerald-700' : 'text-gold'}`}>
                    {isConfigured ? 'Live Supabase Cloud' : 'Built-in High-Fidelity Store'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-taupe-dark font-medium">Row Level Security (RLS):</span>
                  <span className="text-emerald-700 font-semibold uppercase tracking-wider">
                    Enforced in SQL Schema
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-taupe-dark font-medium">Realtime Replication:</span>
                  <span className="text-emerald-700 font-semibold uppercase tracking-wider">
                    Active
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-weddingText-muted leading-relaxed font-light">
                <p>
                  The SQL schema located in <code className="px-1.5 py-0.5 rounded bg-champagne/40 font-mono text-[11px]">supabase/schema.sql</code> and <code className="px-1.5 py-0.5 rounded bg-champagne/40 font-mono text-[11px]">supabase/fix_rls.sql</code>:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="font-medium text-weddingBrown">rsvps table:</strong> Stores guest attendance, count, messages, and contact details with timestamp triggers.</li>
                  <li><strong className="font-medium text-weddingBrown">Permissions:</strong> To allow this dashboard to view and manage RSVPs submitted by guests, run:
                    <div className="mt-2 flex items-center gap-2">
                      <code className="px-2 py-1 bg-white rounded border border-champagne text-[11px] font-mono select-all">ALTER TABLE public.rsvps DISABLE ROW LEVEL SECURITY;</code>
                      <button onClick={handleCopySql} className="px-2.5 py-1 rounded bg-gold text-white text-[10px] uppercase font-semibold">
                        {copiedSql ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* RLS Modal */}
      {showRlsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gold/40 space-y-5 relative">
            <button
              onClick={() => setShowRlsModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-weddingBrown hover:bg-champagne/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-weddingBrown uppercase tracking-wider">
                  Supabase Database Permissions
                </h3>
                <p className="text-xs text-taupe-dark">
                  Fix RSVP data not showing on the dashboard
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <p className="font-medium">Why data might not appear on the dashboard:</p>
              <p className="font-light leading-relaxed">
                By default in Supabase, when Row-Level Security (RLS) is active without an open SELECT policy, Supabase blocks read requests and returns an empty list (<code className="font-mono bg-amber-100 px-1 rounded">[]</code>) even though the data was saved to the database.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-weddingBrown">
                Step 1: Copy this command
              </label>
              <div className="p-3 rounded-xl bg-gray-900 text-gold font-mono text-xs flex items-center justify-between gap-3 select-all">
                <span className="truncate">ALTER TABLE public.rsvps DISABLE ROW LEVEL SECURITY;</span>
                <button
                  onClick={handleCopySql}
                  className="px-2.5 py-1 rounded bg-gold hover:bg-gold-light text-weddingBrown text-[11px] font-semibold tracking-wider uppercase flex-shrink-0 flex items-center gap-1"
                >
                  {copiedSql ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-weddingBrown font-light">
              <p className="font-semibold text-weddingBrown uppercase tracking-wider text-[11px]">
                Step 2: Run in Supabase
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Open your Supabase SQL Editor:
                  <a
                    href="https://supabase.com/dashboard/project/gvrzcexgwppnfqirpiju/sql/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-gold font-medium hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Click here to open SQL Editor</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Paste the command and click <strong>Run</strong>.</li>
                <li>Return here and click the <strong>Refresh</strong> button at top right.</li>
              </ol>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setShowRlsModal(false);
                  fetchRsvps();
                }}
                className="px-5 py-2.5 rounded-xl bg-weddingBrown text-champagne-light text-xs font-semibold tracking-wider uppercase hover:bg-weddingBrown-light transition-colors"
              >
                Done &amp; Refresh Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Detail Modal */}
      {selectedRsvp && (
        <RSVPDetails
          rsvp={selectedRsvp}
          onClose={() => setSelectedRsvp(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

    </div>
  );
}
