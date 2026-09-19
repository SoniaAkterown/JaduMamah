import React, { useState, useEffect } from 'react';
import { X, Database, Table, Code2, RefreshCw, Layers, Check, Copy } from 'lucide-react';

interface DatabaseInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
}

export const DatabaseInspectorModal: React.FC<DatabaseInspectorModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isBn = language === 'bn';
  const [activeTab, setActiveTab] = useState<'tables' | 'ddl'>('tables');
  const [selectedTable, setSelectedTable] = useState<string>('POSTS');
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSchema();
    }
  }, [isOpen]);

  const fetchSchema = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/database/schema-viewer');
      const data = await res.json();
      setDbData(data);
    } catch (err) {
      console.error('Failed to load DB schema:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleCopyDDL = () => {
    if (dbData?.ddl) {
      navigator.clipboard.writeText(dbData.ddl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentTableData = dbData?.tables?.[selectedTable];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-amber-50/60 dark:bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isBn ? 'Oracle Database (19c/21c) স্কিমা ভিউয়ার' : 'Oracle Database (19c/21c) Architecture'}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold">
                  cx_Oracle / oracledb
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn
                  ? 'ডকুমেন্ট অনুযায়ী ৪টি মূল টেবিল: USERS, POSTS, TEMPLATES ও AI_REQUESTS'
                  : 'Live relational view of USERS, POSTS, TEMPLATES, and AI_REQUESTS tables'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchSchema}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh tables"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tables')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'tables'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{isBn ? 'লাইভ টেবিল ও রেকর্ডস' : 'Live Tables & Rows'}</span>
            </button>
            <button
              onClick={() => setActiveTab('ddl')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'ddl'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'Oracle SQL DDL স্ক্রিপ্ট' : 'Oracle SQL DDL'}</span>
            </button>
          </div>

          {activeTab === 'tables' && dbData?.tables && (
            <div className="flex items-center gap-1">
              {Object.keys(dbData.tables).map((tableName) => {
                const count = dbData.tables[tableName].count;
                return (
                  <button
                    key={tableName}
                    onClick={() => setSelectedTable(tableName)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      selectedTable === tableName
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tableName} <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content View */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-950">
          {activeTab === 'tables' && currentTableData && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  TABLE: <span className="text-amber-700 dark:text-amber-400 font-mono">{selectedTable}</span> ({currentTableData.count} records)
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  Columns: {currentTableData.columns.join(', ')}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/75 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                      {currentTableData.columns.map((col: string) => (
                        <th key={col} className="p-2.5 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentTableData.rows.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-colors">
                        {currentTableData.columns.map((col: string) => (
                          <td key={col} className="p-2.5 text-slate-800 dark:text-slate-200 font-mono text-[11px] max-w-[280px] truncate">
                            {row[col] !== undefined ? String(row[col]) : '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ddl' && dbData?.ddl && (
            <div className="relative">
              <button
                onClick={handleCopyDDL}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied SQL' : 'Copy DDL'}</span>
              </button>
              <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
                {dbData.ddl}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
