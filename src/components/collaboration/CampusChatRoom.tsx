import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERPData } from '../../context/ERPDataContext';
import { ChatMessage } from '../../types/erp';
import {
  MessageSquare,
  Hash,
  Send,
  Paperclip,
  Code,
  Smile,
  FileText,
  Download,
  Users,
  Video,
  Mic,
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const CampusChatRoom: React.FC = () => {
  const { currentUser } = useAuth();
  const { channels, messages, sendMessage, setToastMessage } = useERPData();

  const [activeChannelId, setActiveChannelId] = useState<string>('chn-cs301');
  const [inputText, setInputText] = useState<string>('');
  const [isCodeMode, setIsCodeMode] = useState<boolean>(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState<boolean>(false);
  const [attachedFileName, setAttachedFileName] = useState<string>('Graph_Algorithms_Assignment3_Starter.cpp');
  const [attachedFileType, setAttachedFileType] = useState<string>('code');
  const [attachedFileSize, setAttachedFileSize] = useState<string>('18.4 KB');

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const channelMessages = messages[activeChannelId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(
      activeChannelId,
      inputText,
      {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
      }
    );

    setInputText('');
    setIsCodeMode(false);
  };

  const handleSendAttachment = () => {
    sendMessage(
      activeChannelId,
      inputText || `Shared reference file: ${attachedFileName}`,
      {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
      },
      {
        name: attachedFileName,
        type: attachedFileType,
        size: attachedFileSize,
        url: '#',
      }
    );
    setShowAttachmentModal(false);
    setInputText('');
    setToastMessage(`📎 Shared "${attachedFileName}" in ${activeChannel.name}`);
  };

  const sampleMembers = [
    { name: 'Prof. Sarah Jenkins', role: 'Faculty • Course Lead', online: true },
    { name: 'Rahul Sharma', role: 'Student • 2023CS0142', online: true },
    { name: 'Aanya Patel', role: 'Student • 2023CS0101', online: true },
    { name: 'Dr. Michael Chen', role: 'Faculty • Lab Co-Lead', online: false },
    { name: 'Devansh Verma', role: 'Student • 2023CS0118', online: true },
    { name: 'Pooja Iyer', role: 'Student • 2023CS0129', online: false },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[760px]">
      {/* AptTech Style Collaboration Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center font-bold text-white shadow-md">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base tracking-tight">
                AptTech Remote Classroom Nexus
              </h2>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                Live Collaboration
              </span>
            </div>
            <p className="text-xs text-indigo-200">
              Interactive academic discussions, remote file sharing, and faculty-student sync
            </p>
          </div>
        </div>

        {/* Live Audio/Video Office Hours Banner */}
        <div className="hidden md:flex items-center gap-2 bg-indigo-900/60 border border-indigo-400/30 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-indigo-200">
            Prof. Jenkins Virtual Office Hours Active
          </span>
          <button
            onClick={() => setToastMessage('🎙️ Connected to Prof. Jenkins Virtual Audio Office Hours')}
            className="ml-2 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
          >
            <Mic className="w-3 h-3" />
            Join Audio
          </button>
        </div>
      </div>

      {/* 3-Column Body: Channels List (Left), Message Feed (Center), Active Roster (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Channels Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Classroom Channels
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {channels.map((chn) => {
              const isActive = chn.id === activeChannelId;
              return (
                <button
                  key={chn.id}
                  onClick={() => setActiveChannelId(chn.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <Hash
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate leading-tight">{chn.name}</p>
                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        isActive ? 'text-indigo-200' : 'text-slate-500'
                      }`}
                    >
                      {chn.lastMessage || chn.description}
                    </p>
                  </div>
                  {chn.unreadCount && chn.unreadCount > 0 ? (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-white text-indigo-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {chn.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-200 text-[11px] text-slate-500 bg-white">
            <span className="font-semibold block text-slate-700">Protected Room:</span>
            <span>TLS 1.3 + AES-256 chat storage</span>
          </div>
        </div>

        {/* CENTER COLUMN: Interactive Chat Feed */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Channel Info Bar */}
          <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">{activeChannel.name}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{activeChannel.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                {activeChannel.membersCount} participants
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {channelMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              const isFaculty = msg.senderRole === 'faculty';
              const isAdmin = msg.senderRole === 'admin';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className={`max-w-xl ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900">{msg.senderName}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          isFaculty
                            ? 'bg-indigo-100 text-indigo-800'
                            : isAdmin
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {msg.senderRole}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    {/* Bubble Content */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none'
                      }`}
                    >
                      <p>{msg.content}</p>

                      {/* File Attachment if attached */}
                      {msg.attachment && (
                        <div
                          className={`mt-2.5 p-3 rounded-xl flex items-center justify-between gap-3 border ${
                            isMe
                              ? 'bg-indigo-700/60 border-indigo-400/40 text-white'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs truncate">
                                {msg.attachment.name}
                              </p>
                              <span className="text-[10px] opacity-75">
                                {msg.attachment.size} • Verified Secure
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              setToastMessage(`💾 Downloaded ${msg.attachment?.name}!`)
                            }
                            className="p-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-lg transition shrink-0"
                            title="Download Attachment"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Reactions */}
                    {msg.reactions && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {Object.entries(msg.reactions).map(([emoji, count]) => (
                          <span
                            key={emoji}
                            className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-slate-600 font-semibold"
                          >
                            {emoji} {count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-200 bg-slate-50/50 shrink-0 space-y-2"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAttachmentModal(true)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                title="Attach Course File"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsCodeMode(!isCodeMode)}
                className={`p-2 rounded-xl transition ${
                  isCodeMode
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                title="Code Snippet Formatting"
              >
                <Code className="w-4 h-4" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isCodeMode
                      ? 'Paste code snippet or question (e.g. Dijkstra relaxation O(E log V))...'
                      : `Message #${activeChannel.name}...`
                  }
                  className={`w-full text-xs py-2.5 px-4 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white ${
                    isCodeMode ? 'font-mono text-indigo-900 bg-indigo-50/20' : ''
                  }`}
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Classroom Members Roster */}
        <div className="w-56 border-l border-slate-200 bg-slate-50 hidden lg:flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Online Roster ({sampleMembers.filter((m) => m.online).length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {sampleMembers.map((member, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs">
                <div className="relative shrink-0">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-[10px]">
                    {member.name.charAt(0)}
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full absolute -bottom-0.5 -right-0.5 ring-1 ring-white ${
                      member.online ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate leading-tight">{member.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attachment Upload Modal */}
      {showAttachmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Share File to Remote Classroom
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Upload code files, lab assignments, or study sheets for instant student collaboration.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  value={attachedFileName}
                  onChange={(e) => setAttachedFileName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={attachedFileType}
                    onChange={(e) => setAttachedFileType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="code">Source Code (.cpp, .py)</option>
                    <option value="pdf">Document (.pdf)</option>
                    <option value="docx">Report (.docx)</option>
                    <option value="zip">Archive (.zip)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Simulated Size</label>
                  <input
                    type="text"
                    value={attachedFileSize}
                    onChange={(e) => setAttachedFileSize(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Files are virus-scanned and encrypted for authorized students only.</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setShowAttachmentModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendAttachment}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-1.5"
              >
                <Paperclip className="w-3.5 h-3.5" />
                Attach & Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
