import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, ArrowLeft, X, Shield } from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onLogout,
  onReturnHome,
  mobileOpen,
  onCloseMobile,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rsvps', label: 'RSVPs & Guests', icon: Users },
    { id: 'settings', label: 'Supabase Status', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-weddingBrown/50 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-champagne flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div>
          <div className="p-6 border-b border-champagne/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-gold mb-1">
                <Shield className="w-4 h-4 text-gold" />
                <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-weddingBrown">
                  Admin Panel
                </span>
              </div>
              <h2 className="text-xl font-light tracking-[0.15em] text-weddingBrown uppercase">
                James &amp; Cristel
              </h2>
              <span className="text-[10px] text-taupe-dark tracking-wider">
                January 28, 2027
              </span>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-taupe-dark hover:text-weddingBrown"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-champagne/30 text-weddingBrown border border-gold/40 shadow-sm'
                      : 'text-taupe-dark hover:bg-ivory hover:text-weddingBrown'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-taupe'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-champagne/60 space-y-2">
          
          <button
            onClick={onReturnHome}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-taupe-dark hover:text-weddingBrown hover:bg-ivory transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-taupe" />
            <span>Public Invitation</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-red-700 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </button>

        </div>
      </aside>
    </>
  );
}
