import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Send, Mail, Building2, ChevronLeft, MoreVertical,  X, FileText, Download, CheckCheck } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { useChatStore, type ChatUser } from '@/stores/useChatStore'
import { cn } from '@/lib/utils'

const STORAGE_BASE = 'https://realstatebackend.processiqtech.com/test/public/storage/'

const getAttachmentUrl = (path?: string | null) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return STORAGE_BASE + path
}

const isImage = (type?: string | null, path?: string | null) => {
  if (type?.startsWith('image/')) return true
  if (path) return /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(path)
  return false
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

const formatTime = (dateStr?: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

const Avatar = ({ name, className }: { name: string; className?: string }) => {
  const initial = name?.charAt(0).toUpperCase() || '?'
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#066EAE] to-[#055a8c] text-sm font-semibold text-white ring-2 ring-white',
        className
      )}
    >
      {initial}
    </div>
  )
}

export default function Messages() {
  const location = useLocation()
  const isUnreadFilter = location.pathname.includes('/unread')

  const {
    users,
    messages,
    selectedUser,
    loadingUsers,
    loadingMessages,
    sending,
    searchQuery,
    currentUserId,
    setSearchQuery,
    setSelectedUser,
    fetchUsers,
    sendMessage,
    sendAttachment,
    subscribeToMessages,
    unsubscribeFromMessages,
    
  
  } = useChatStore()

  const [input, setInput] = useState('')
  const [showMobileList, setShowMobileList] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchUsers()
    subscribeToMessages()
    
    return () => {
      unsubscribeFromMessages()
      
    }
  }, [fetchUsers, subscribeToMessages, unsubscribeFromMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (selectedUser && !showMobileList) inputRef.current?.focus()
  }, [selectedUser, showMobileList])

  const filteredUsers = users
    .filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((u) => !isUnreadFilter || (u.unread_count || 0) > 0)

  const handleSelectUser = (user: ChatUser) => {
    setSelectedUser(user)
    setShowMobileList(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => setFilePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setFilePreview('')
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setFilePreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    if (selectedFile) {
      const ok = await sendAttachment(selectedFile, input)
      if (ok) {
        clearFile()
        setInput('')
      }
      return
    }
    if (!input.trim()) return
    const sent = await sendMessage(input)
    if (sent) setInput('')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      {/* Desktop */}
      <div className="hidden lg:ml-64 lg:block">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-[1620px] items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">{isUnreadFilter ? 'Unread Messages' : 'Messages'}</h1>
            <p className="text-sm text-slate-500">{users.length} distributors</p>
          </div>
        </header>
        <main className="mx-auto h-[calc(100vh-65px)] max-w-full px-6 py-6">
          <div className="flex h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Distributor List */}
            <div
              className={cn(
                'flex w-full flex-col border-r border-slate-200 md:w-80 lg:w-96',
                !showMobileList && 'hidden md:flex'
              )}
            >
              <div className="border-b border-slate-100 p-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search distributors..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-[#066EAE] focus:bg-white"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loadingUsers ? (
                  <div className="space-y-1 p-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex animate-pulse items-start gap-3 p-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-3 w-1/2 rounded bg-slate-200" />
                          <div className="h-2.5 w-3/4 rounded bg-slate-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex h-64 flex-col items-center justify-center text-slate-400">
                    <Building2 size={40} className="mb-2" />
                    <p className="text-sm">No distributors found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className={cn(
                          'flex w-full items-start gap-3 border-l-2 border-transparent p-4 text-left transition-colors hover:bg-slate-50',
                          selectedUser?.id === user.id && 'border-l-[#066EAE] bg-[#066EAE]/5 hover:bg-[#066EAE]/10'
                        )}
                      >
                        <Avatar name={user.name} className="h-10 w-10 text-base" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={cn(
                                'truncate text-sm text-slate-800',
                                (user.unread_count || 0) > 0 ? 'font-semibold' : 'font-medium'
                              )}
                            >
                              {user.name}
                            </p>
                            {user.last_message_at && (
                              <span className="shrink-0 text-xs text-slate-400">{formatTime(user.last_message_at)}</span>
                            )}
                          </div>
                          <p className="truncate text-xs text-slate-500">{user.company_name || user.email}</p>
                          {user.last_message && (
                            <p
                              className={cn(
                                'mt-1 truncate text-xs',
                                (user.unread_count || 0) > 0 ? 'font-medium text-slate-700' : 'text-slate-500'
                              )}
                            >
                              {user.last_message}
                            </p>
                          )}
                        </div>
                        {(user.unread_count || 0) > 0 && (
                          <span className="ml-2 flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#E7002B] px-1.5 text-[10px] font-semibold text-white">
                            {user.unread_count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Chat Area */}
            <div className={cn('flex flex-1 flex-col', showMobileList && 'hidden md:flex')}>
              {selectedUser ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={selectedUser.name} className="h-10 w-10 text-base" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{selectedUser.name}</p>
                        <p className="text-xs text-slate-500">{selectedUser.company_name || 'Distributor'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <a href={`mailto:${selectedUser.email}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100" title="Email">
                        <Mail size={16} />
                      </a>
                      <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto bg-slate-50/60 p-5">
                    {loadingMessages ? (
                      <div className="space-y-4">
                        <div className="flex justify-start"><div className="h-10 w-40 animate-pulse rounded-2xl rounded-bl-md bg-slate-200" /></div>
                        <div className="flex justify-end"><div className="h-10 w-52 animate-pulse rounded-2xl rounded-br-md bg-slate-200" /></div>
                        <div className="flex justify-start"><div className="h-10 w-32 animate-pulse rounded-2xl rounded-bl-md bg-slate-200" /></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center text-slate-400">
                        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100"><Send size={24} className="text-slate-400" /></div>
                        <p className="text-sm font-medium text-slate-600">No messages yet</p>
                        <p className="text-xs text-slate-400">Start the conversation with {selectedUser.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {messages.map((msg, index) => {
                          const isMe = msg.sender_id === currentUserId
                          const prevMsg = messages[index - 1]
                          const nextMsg = messages[index + 1]
                          const showDate = index === 0 || formatDate(prevMsg.created_at) !== formatDate(msg.created_at)
                          const isFirstInGroup = showDate || !prevMsg || prevMsg.sender_id !== msg.sender_id
                          const isLastInGroup = !nextMsg || nextMsg.sender_id !== msg.sender_id || showDate
                          return (
                            <div key={msg.id}>
                              {showDate && (
                                <div className="sticky top-0 z-[1] my-4 flex items-center justify-center">
                                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium text-slate-500 shadow-sm">{formatDate(msg.created_at)}</span>
                                </div>
                              )}
                              <div className={cn('group flex items-end gap-2', isMe ? 'justify-end' : 'justify-start', isFirstInGroup ? 'mt-3' : 'mt-0.5')}>
                                {!isMe && <div className="h-7 w-7 shrink-0">{isLastInGroup && <Avatar name={selectedUser.name} className="h-7 w-7 text-xs" />}</div>}
                                <div className={cn('flex max-w-[75%] flex-col', isMe ? 'items-end' : 'items-start')}>
                                  {isFirstInGroup && <span className={cn('mb-1 px-1 text-[11px] font-medium text-slate-400', isMe && 'hidden')}>{selectedUser.name}</span>}
                                  <div className={cn('rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-shadow group-hover:shadow-md', isMe ? 'bg-gradient-to-br from-[#066EAE] to-[#055a8c] text-white' : 'border border-slate-200 bg-white text-slate-700', isMe && isLastInGroup && 'rounded-br-md', !isMe && isLastInGroup && 'rounded-bl-md')}>
                                    {msg.message && <p className="whitespace-pre-wrap break-words">{msg.message}</p>}
                                    {msg.attachment && isImage(msg.attachment_type, msg.attachment) ? (
                                      <a href={getAttachmentUrl(msg.attachment)} target="_blank" rel="noopener noreferrer" className={cn('block overflow-hidden rounded-lg', msg.message && 'mt-1.5')}>
                                        <img src={getAttachmentUrl(msg.attachment)} alt="attachment" className="max-h-60 w-full object-cover transition-transform hover:scale-[1.02]" />
                                      </a>
                                    ) : msg.attachment ? (
                                      <a href={getAttachmentUrl(msg.attachment)} target="_blank" rel="noopener noreferrer" className={cn('flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors', msg.message && 'mt-1.5', isMe ? 'bg-white/15 hover:bg-white/25' : 'bg-slate-50 hover:bg-slate-100')}>
                                        <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', isMe ? 'bg-white/15' : 'bg-white')}><FileText size={16} /></span>
                                        <span className="min-w-0 flex-1 truncate font-medium">Attachment</span>
                                        <Download size={14} className="ml-auto shrink-0 opacity-80" />
                                      </a>
                                    ) : null}
                                    <div className={cn('mt-1 flex items-center justify-end gap-1 text-[10px]', isMe ? 'text-blue-100' : 'text-slate-400')}>
                                      <span>{formatTime(msg.created_at)}</span>
                                      {isMe && <CheckCheck size={13} className="shrink-0" />}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleSend} className="border-t border-slate-100 bg-white p-4">
                    {selectedFile && (
                      <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        {filePreview ? <img src={filePreview} alt="preview" className="h-14 w-14 rounded-lg object-cover" /> : <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-200"><FileText size={20} className="text-slate-500" /></div>}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-700">{selectedFile.name}</p>
                          <p className="text-xs text-slate-400">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <button type="button" onClick={clearFile} className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"><X size={16} /></button>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <input ref={fileInputRef} type="file" accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar" onChange={handleFileChange} className="hidden" />
                      <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#066EAE] focus:bg-white" />
                      <button type="submit" disabled={(!input.trim() && !selectedFile) || sending} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#066EAE] text-white transition-colors hover:bg-[#055a8c] disabled:cursor-not-allowed disabled:opacity-50">
                        {sending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Send size={18} />}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-slate-50/50 text-slate-400">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100"><Send size={32} className="text-slate-400" /></div>
                  <p className="text-base font-medium text-slate-600">Select a distributor to start chatting</p>
                  <p className="text-sm text-slate-400">Your conversations will appear here</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile: Full-screen chat */}
      <div className="lg:hidden">
        {/* Mobile: Distributor List */}
        <div className={cn('flex h-screen flex-col', !showMobileList && 'hidden')}>
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
            <h1 className="text-base font-semibold text-slate-800">{isUnreadFilter ? 'Unread Messages' : 'Messages'}</h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">{users.length}</span>
          </div>
          <div className="border-b border-slate-100 bg-white px-3 pb-3 pt-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search distributors..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-[#066EAE] focus:bg-white"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-white">
            {loadingUsers ? (
              <div className="space-y-1 p-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex animate-pulse items-start gap-3 p-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 w-1/2 rounded bg-slate-200" />
                      <div className="h-2.5 w-3/4 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-slate-400">
                <Building2 size={36} className="mb-2" />
                <p className="text-sm">No distributors found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-slate-100"
                  >
                    <Avatar name={user.name} className="h-11 w-11 text-base" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn('truncate text-sm', (user.unread_count || 0) > 0 ? 'font-semibold text-slate-900' : 'font-medium text-slate-800')}>{user.name}</p>
                        {user.last_message_at && <span className="shrink-0 text-[11px] text-slate-400">{formatTime(user.last_message_at)}</span>}
                      </div>
                      {user.last_message ? (
                        <p className={cn('mt-0.5 truncate text-xs', (user.unread_count || 0) > 0 ? 'font-medium text-slate-700' : 'text-slate-500')}>{user.last_message}</p>
                      ) : (
                        <p className="mt-0.5 truncate text-xs text-slate-400">{user.company_name || user.email}</p>
                      )}
                    </div>
                    {(user.unread_count || 0) > 0 && (
                      <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#E7002B] px-1.5 text-[10px] font-semibold text-white">{user.unread_count}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Chat View */}
        <div className={cn('flex h-screen flex-col', showMobileList && 'hidden')}>
          {selectedUser && (
            <>
              <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-3 py-2.5">
                <button onClick={() => setShowMobileList(true)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 active:bg-slate-100">
                  <ChevronLeft size={22} />
                </button>
                <Avatar name={selectedUser.name} className="h-9 w-9 text-sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{selectedUser.name}</p>
                  <p className="truncate text-[11px] text-slate-400">{selectedUser.company_name || 'Distributor'}</p>
                </div>
                <a href={`mailto:${selectedUser.email}`} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 active:bg-slate-100">
                  <Mail size={16} />
                </a>
              </div>
              <div className="flex-1 overflow-y-auto bg-slate-50/60 px-3 py-3">
                {loadingMessages ? (
                  <div className="space-y-3">
                    <div className="flex justify-start"><div className="h-9 w-36 animate-pulse rounded-2xl rounded-bl-md bg-slate-200" /></div>
                    <div className="flex justify-end"><div className="h-9 w-44 animate-pulse rounded-2xl rounded-br-md bg-slate-200" /></div>
                    <div className="flex justify-start"><div className="h-9 w-28 animate-pulse rounded-2xl rounded-bl-md bg-slate-200" /></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-slate-400">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100"><Send size={22} className="text-slate-400" /></div>
                    <p className="text-sm font-medium text-slate-600">No messages yet</p>
                    <p className="text-xs text-slate-400">Say hi to {selectedUser.name}</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {messages.map((msg, index) => {
                      const isMe = msg.sender_id === currentUserId
                      const prevMsg = messages[index - 1]
                      const showDate = index === 0 || formatDate(prevMsg.created_at) !== formatDate(msg.created_at)
                      return (
                        <div key={msg.id}>
                          {showDate && (
                            <div className="my-3 flex items-center justify-center">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">{formatDate(msg.created_at)}</span>
                            </div>
                          )}
                          <div className={cn('flex', isMe ? 'justify-end' : 'justify-start', index > 0 && messages[index - 1].sender_id === msg.sender_id && !showDate ? 'mt-0.5' : 'mt-2')}>
                            <div className={cn('max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px]', isMe ? 'bg-[#066EAE] text-white' : 'border border-slate-200 bg-white text-slate-700')}>
                              {msg.message && <p className="break-words">{msg.message}</p>}
                              {msg.attachment && isImage(msg.attachment_type, msg.attachment) ? (
                                <a href={getAttachmentUrl(msg.attachment)} target="_blank" rel="noopener noreferrer" className={cn('block overflow-hidden rounded-lg', msg.message && 'mt-1')}>
                                  <img src={getAttachmentUrl(msg.attachment)} alt="attachment" className="max-h-48 w-full object-cover" />
                                </a>
                              ) : msg.attachment ? (
                                <a href={getAttachmentUrl(msg.attachment)} target="_blank" rel="noopener noreferrer" className={cn('flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs', msg.message && 'mt-1', isMe ? 'bg-white/15' : 'bg-slate-50')}>
                                  <FileText size={14} />
                                  <span className="truncate">Attachment</span>
                                  <Download size={12} className="ml-auto shrink-0 opacity-70" />
                                </a>
                              ) : null}
                              <div className={cn('mt-0.5 flex items-center justify-end gap-1 text-[9px]', isMe ? 'text-blue-100' : 'text-slate-400')}>
                                <span>{formatTime(msg.created_at)}</span>
                                {isMe && <CheckCheck size={11} />}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              <form onSubmit={handleSend} className="border-t border-slate-200 bg-white px-3 py-2.5">
                {selectedFile && (
                  <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                    {filePreview ? <img src={filePreview} alt="preview" className="h-10 w-10 rounded object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-200"><FileText size={16} className="text-slate-500" /></div>}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-700">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-400">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button type="button" onClick={clearFile} className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200"><X size={14} /></button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input ref={fileInputRef} type="file" accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar" onChange={handleFileChange} className="hidden" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-[#066EAE] focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={(!input.trim() && !selectedFile) || sending}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#066EAE] text-white active:bg-[#055a8c] disabled:opacity-40"
                  >
                    {sending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Send size={16} />}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}