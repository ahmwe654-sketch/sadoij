import React, { useState } from 'react';
import {
  FolderTree,
  Folder,
  FileCode,
  Download,
  Trash2,
  Edit3,
  Save,
  X,
  Lock,
  Sparkles,
  Check
} from 'lucide-react';
import { ServerFileItem, UserRole } from '../types';

interface FileManagerViewProps {
  files: ServerFileItem[];
  userRole: UserRole;
  onSaveFile: (file: ServerFileItem, newContent: string) => void;
  onDeleteFile: (file: ServerFileItem) => void;
}

export const FileManagerView: React.FC<FileManagerViewProps> = ({
  files,
  userRole,
  onSaveFile,
  onDeleteFile,
}) => {
  const [editingFile, setEditingFile] = useState<ServerFileItem | null>(null);
  const [fileEditorContent, setFileEditorContent] = useState('');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const handleOpenEditor = (file: ServerFileItem) => {
    if (file.isDirectory) return;
    setEditingFile(file);
    setFileEditorContent(file.content || `# ${file.name}\n# Configuration content empty.`);
    setIsSavedRecently(false);
  };

  const handleSave = () => {
    if (!editingFile) return;
    onSaveFile(editingFile, fileEditorContent);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  const handleDownload = (file: ServerFileItem) => {
    const text = file.content || '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Root Filesystem Browser</h3>
            <p className="text-xs text-slate-400 font-mono">Current working directory: /home/minecraft/server</p>
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="divide-y divide-white/5">
          {files.map((file) => (
            <div
              key={file.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
            >
              <div
                onClick={() => !file.isDirectory && handleOpenEditor(file)}
                className={`flex items-center gap-3.5 min-w-0 ${!file.isDirectory ? 'cursor-pointer group' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                  {file.isDirectory ? (
                    <Folder className="w-5 h-5 text-amber-400" />
                  ) : (
                    <FileCode className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-white text-sm font-mono truncate group-hover:text-emerald-300 transition-colors">
                      {file.name}
                    </h5>
                    {file.isProtected && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                        <Lock className="w-3 h-3" /> Core File
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {file.isDirectory ? 'Directory' : `${file.sizeKB.toLocaleString()} KB`} • Modified: {file.lastModified}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {!file.isDirectory && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEditor(file)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(file)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => onDeleteFile(file)}
                  disabled={userRole === 'Moderator'}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-40 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Editor Modal */}
      {editingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setEditingFile(null)}
          />

          <div className="relative w-full max-w-4xl bg-[#0d0f12]/95 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl z-10 flex flex-col h-[80vh] shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white font-mono tracking-tight">{editingFile.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Direct server file editor</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={userRole === 'Moderator'}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  {isSavedRecently ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{isSavedRecently ? 'Changes Saved!' : 'Save File'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingFile(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Code / Text Area */}
            <div className="flex-1 my-4 rounded-xl bg-black/60 border border-white/10 overflow-hidden flex flex-col">
              <textarea
                value={fileEditorContent}
                onChange={(e) => setFileEditorContent(e.target.value)}
                disabled={userRole === 'Moderator'}
                className="w-full h-full p-4 bg-transparent font-mono text-xs text-emerald-300 outline-none resize-none leading-relaxed custom-scrollbar disabled:opacity-50 select-text"
                spellCheck={false}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Encoding: UTF-8 • UNIX (LF)</span>
              <span>Lines: {fileEditorContent.split('\n').length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
