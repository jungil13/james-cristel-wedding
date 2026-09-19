import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, Eye, Check, XCircle, Trash2, Download, AlertTriangle } from 'lucide-react';

export default function RSVPTable({
  rsvps = [],
  onViewRsvp,
  onUpdateStatus,
  onDeleteRsvp,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'accepted' | 'declined' | 'pending'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'guests'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter & Search Logic
  const filteredRsvps = rsvps
    .filter((rsvp) => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchName = rsvp.full_name?.toLowerCase().includes(search);
      const matchEmail = rsvp.email?.toLowerCase().includes(search);
      const matchPhone = rsvp.phone?.toLowerCase().includes(search);
      if (search && !matchName && !matchEmail && !matchPhone) return false;

      // Filter
      if (filterStatus === 'accepted') {
        return rsvp.attendance === 'accepted' || rsvp.status === 'confirmed';
      }
      if (filterStatus === 'declined') {
        return rsvp.attendance === 'declined' || rsvp.status === 'declined';
      }
      if (filterStatus === 'pending') {
        return rsvp.status === 'pending';
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'guests') {
        return (b.guest_count || 1) - (a.guest_count || 1);
      }
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortBy === 'oldest' ? timeA - timeB : timeB - timeA;
    });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'Guests', 'Attendance', 'Status', 'Dietary Restrictions', 'Message', 'Submitted'];
    const rows = filteredRsvps.map(r => [
      `"${r.full_name || ''}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      r.guest_count || 1,
      `"${r.attendance || ''}"`,
      `"${r.status || ''}"`,
      `"${(r.dietary_restrictions || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${new Date(r.created_at).toLocaleDateString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `james_cristel_rsvps_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar: Search, Filters, Sort, CSV Export */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-taupe/40 focus:outline-none focus:border-gold text-xs sm:text-sm text-weddingBrown placeholder:text-taupe/60"
          />
          <Search className="w-4 h-4 text-taupe absolute left-3.5 top-3" />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-taupe/40">
            <Filter className="w-3.5 h-3.5 text-gold" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-xs text-weddingBrown font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-taupe/40">
            <ArrowUpDown className="w-3.5 h-3.5 text-gold" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-weddingBrown font-medium focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="guests">Most Guests</option>
            </select>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-champagne/40 hover:bg-champagne/60 text-weddingBrown text-xs font-medium tracking-wider uppercase border border-gold/40 transition-colors"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-weddingBrown" />
            <span>Export CSV</span>
          </button>

        </div>

      </div>

      {/* Confirmation Dialog for Delete */}
      {deleteConfirmId && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Are you sure you want to delete this RSVP? This action cannot be undone.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDeleteRsvp(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium uppercase"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 text-xs font-medium uppercase"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block wedding-card rounded-2xl border-champagne overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-weddingBrown">
            <thead className="bg-ivory/90 border-b border-champagne/60 text-[10px] tracking-[0.2em] uppercase text-taupe-dark">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Guest Name</th>
                <th className="py-3.5 px-4 font-semibold">Contact</th>
                <th className="py-3.5 px-4 font-semibold text-center">Guests</th>
                <th className="py-3.5 px-4 font-semibold">Attendance</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Submitted</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne/40">
              {filteredRsvps.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-taupe-dark">
                    No RSVP records match your current criteria.
                  </td>
                </tr>
              ) : (
                filteredRsvps.map((r) => (
                  <tr key={r.id} className="hover:bg-champagne/15 transition-colors">
                    
                    {/* Guest Name */}
                    <td className="py-3.5 px-4 font-medium text-weddingBrown">
                      {r.full_name}
                      {r.message && (
                        <span className="block text-[11px] text-taupe-dark font-light truncate max-w-xs italic">
                          "{r.message}"
                        </span>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-weddingText-muted">
                      <div>{r.email || '—'}</div>
                      <div className="text-[11px] text-taupe-dark">{r.phone || ''}</div>
                    </td>

                    {/* Guests */}
                    <td className="py-3.5 px-4 text-center font-medium">
                      {r.guest_count}
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase ${
                          r.attendance === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.attendance === 'accepted' ? 'Accepted' : 'Declined'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase ${
                          r.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : r.status === 'declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    {/* Submitted */}
                    <td className="py-3.5 px-4 text-taupe-dark text-[11px]">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onViewRsvp(r)}
                          className="p-1.5 rounded-lg bg-ivory hover:bg-champagne/40 text-weddingBrown transition-colors border border-taupe/30"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onUpdateStatus(r.id, 'confirmed')}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors border border-emerald-200"
                          title="Mark Confirmed"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onUpdateStatus(r.id, 'declined')}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors border border-amber-200"
                          title="Mark Declined"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(r.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-200"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {filteredRsvps.length === 0 ? (
          <div className="wedding-card rounded-2xl p-6 text-center text-taupe-dark text-xs">
            No RSVP records match your current criteria.
          </div>
        ) : (
          filteredRsvps.map((r) => (
            <div key={r.id} className="wedding-card rounded-2xl p-5 border-champagne space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-medium text-weddingBrown">{r.full_name}</h4>
                  <p className="text-xs text-weddingText-muted mt-0.5">{r.email || 'No email'}</p>
                  {r.phone && <p className="text-xs text-taupe-dark">{r.phone}</p>}
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase ${
                      r.attendance === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {r.attendance === 'accepted' ? 'Accepted' : 'Declined'}
                  </span>
                  <span className="block text-[11px] text-taupe-dark mt-1">
                    {r.guest_count} {r.guest_count === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>
              </div>

              {r.message && (
                <div className="p-2.5 rounded-xl bg-ivory/80 text-xs italic text-weddingText-muted font-light">
                  "{r.message}"
                </div>
              )}

              <div className="pt-3 border-t border-champagne/40 flex items-center justify-between">
                <span className="text-[10px] text-taupe-dark">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewRsvp(r)}
                    className="px-2.5 py-1 rounded-lg bg-ivory text-weddingBrown text-xs font-medium border border-taupe/30"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onUpdateStatus(r.id, 'confirmed')}
                    className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(r.id)}
                    className="p-1 rounded-lg bg-red-50 text-red-600 border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
