'use client';

import React, { useState } from 'react';
import { AuditRecord } from '../types';

interface HistoryViewProps {
  records: AuditRecord[];
  onSelectRecord: (record: AuditRecord) => void;
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
}

export default function HistoryView({
  records,
  onSelectRecord,
  onClearHistory,
  onDeleteRecord,
}: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeModalRecord, setActiveModalRecord] = useState<AuditRecord | null>(null);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.repo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Audit History & Saved Reports
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Browse, inspect, and export previous code vulnerability runs.
          </p>
        </div>

        {records.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>🗑️</span> Clear All History
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-3 text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by repository name or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-semibold"
        >
          <option value="ALL">All Statuses</option>
          <option value="PATCHED">Patched</option>
          <option value="PUSHED_TO_GITHUB">Pushed to GitHub</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-800/60 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
            📂
          </div>
          <h3 className="text-slate-300 font-bold text-base">No Audit History Found</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">
            {records.length === 0
              ? 'You have not run any audits yet. Start an audit from the Home tab!'
              : 'No records matched your search query or status filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                      record.status === 'PUSHED_TO_GITHUB'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : record.status === 'PATCHED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : record.status === 'FAILED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {record.status}
                  </span>
                  <span className="text-slate-500 text-xs">• {record.timestamp}</span>
                </div>

                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <a
                    href={record.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-400 underline decoration-slate-700 transition-colors"
                  >
                    {record.owner}/{record.repo}
                  </a>
                </h3>

                <p className="text-xs text-slate-400">
                  Fixed <strong className="text-emerald-400">{record.bugsCount} vulnerabilities</strong> across {record.diffs.length} files.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => onSelectRecord(record)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-blue-500/20"
                >
                  Load & View Diff
                </button>

                {record.prUrl && (
                  <a
                    href={record.prUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    PR Link
                  </a>
                )}

                <button
                  onClick={() => onDeleteRecord(record.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                  title="Delete Record"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
