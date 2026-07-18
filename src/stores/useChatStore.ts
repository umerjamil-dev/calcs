import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'
import { pusherClient } from '@/lib/pusher'

declare global {
    interface Window {
        __chatPolling?: ReturnType<typeof setInterval>
    }
}

export interface ChatUser {
    id: number
    name: string
    email?: string
    number?: string
    company_name?: string | null
    role_id: number
    avatar?: string
    unread_count?: number
    last_message?: string
    last_message_at?: string
}
export interface ChatMessage {
    id: number
    sender_id: number
    receiver_id: number
    message: string
    attachment?: string | null
    attachment_type?: string | null
    created_at: string
    updated_at?: string
    sender?: {
        id: number
        name: string
        number: string
    }
}
interface ChatState {
    users: ChatUser[]
    messages: ChatMessage[]
    selectedUser: ChatUser | null
    loadingUsers: boolean
    loadingMessages: boolean
    sending: boolean
    currentUserId: number | null
    searchQuery: string
    setSearchQuery: (query: string) => void
    setSelectedUser: (user: ChatUser | null) => void
    fetchUsers: () => Promise<void>
    fetchMessages: (userId: number) => Promise<void>
    sendMessage: (message: string) => Promise<boolean>
    sendAttachment: (file: File, message?: string) => Promise<boolean>
    subscribeToMessages: () => void
    unsubscribeFromMessages: () => void
  
    markAsRead: (userId: number) => void
}
const getCurrentUser = (): { id: number } | null => {
    try {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    } catch {
        return null
    }
}
export const useChatStore = create<ChatState>()((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    loadingUsers: false,
    loadingMessages: false,
    sending: false,
    currentUserId: getCurrentUser()?.id || null,
    searchQuery: '',
    setSearchQuery: (query) => {
        set({
            searchQuery: query
        })
    },
    setSelectedUser: (user) => {
        set({
            selectedUser: user
        })
        if (user) {
            get().fetchMessages(user.id)
            get().markAsRead(user.id)
        }
    },
    // MAL Pakistan ke liye distributors list
    fetchUsers: async () => {
        set({
            loadingUsers: true
        })
        try {
            const res = await api.get(
                '/chat/distributors'
            )
            console.log('👥 DISTRIBUTORS RESPONSE:', res.data)
            const data =
                res.data.data || []
            // Map backend 'time' field to frontend 'last_message_at'
            const mapped = Array.isArray(data)
                ? data.map((u: any) => ({
                    ...u,
                    last_message_at: u.last_message_at || u.time || null,
                }))
                : []
            console.log('👥 DISTRIBUTORS MAPPED:', mapped)
            set({
                users: mapped
            })
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                'Failed to load distributors'
            )
        } finally {
            set({
                loadingUsers: false
            })
        }
    },
    // Chat history
    fetchMessages: async (userId: number) => {
        set({
            loadingMessages: true
        })
        try {
            const res =
                await api.get(
                    `/chat/history/${userId}`
                )
            console.log('📩 FETCH HISTORY RESPONSE:', res.data)
            const data =
                res.data.data || res.data || []
            console.log('📩 FETCH HISTORY DATA:', data)
            set({
                messages: Array.isArray(data)
                    ? data
                    : []
            })
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                'Failed to load messages'
            )
            set({
                messages: []
            })
        } finally {
            set({
                loadingMessages: false
            })
        }
    },
    // Send message
    sendMessage: async (message: string) => {
        const {
            selectedUser
        } = get()
        if (
            !selectedUser ||
            !message.trim()
        ) {
            return false
        }
        set({
            sending: true
        })
        try {
            const res =
                await api.post(
                    '/chat/send',
                    {
                        receiver_id: selectedUser.id,
                        message: message.trim()
                    }
                )
            console.log('📨 SEND MSG RESPONSE:', res.data)
            // Try to extract message from response
            const newMessage =
                res.data?.data || res.data?.message || null
            console.log('📨 EXTRACTED MSG:', newMessage, 'has id?', newMessage?.id)
            if (newMessage && newMessage.id) {
                set(state => ({
                    messages: [
                        ...state.messages,
                        newMessage
                    ]
                }))
            } else {
                // Re-fetch history if message wasn't returned
                await get().fetchMessages(selectedUser.id)
            }
            return true
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                'Message send failed'
            )
            return false
        } finally {
            set({
                sending: false
            })
        }
    },
    
    sendAttachment: async (file: File, message?: string) => {
        const { selectedUser } = get()
        if (!selectedUser) return false
        set({ sending: true })
        try {
            const formData = new FormData()
            formData.append('receiver_id', String(selectedUser.id))
            formData.append('attachment', file)
            if (message?.trim()) {
                formData.append('message', message.trim())
            }
            const res = await api.post('/chat/send', formData)
            const newMessage = res.data?.data || res.data?.message || null
            if (newMessage && newMessage.id) {
                set(state => ({ messages: [...state.messages, newMessage] }))
            } else {
                await get().fetchMessages(selectedUser.id)
            }
            return true
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'File upload failed')
            return false
        } finally {
            set({ sending: false })
        }
    },
    // Pusher realtime
   subscribeToMessages: () => {

    const { currentUserId } = get();
    console.log('📡 SUBSCRIBE called, currentUserId:', currentUserId);

    if (!currentUserId) {
        console.warn('📡 SKIP SUBSCRIBE: currentUserId is null');
        return;
    }

    const channel = pusherClient.subscribe(`private-chat.${currentUserId}`);

    channel.bind('pusher:subscription_succeeded', () => {
        console.log('✅ PUSHER SUBSCRIBED to', `private-chat.${currentUserId}`);
    });

    channel.bind('pusher:subscription_error', (err: any) => {
        console.error('❌ PUSHER SUBSCRIPTION ERROR:', err);
    });

    console.log('📡 Subscribing to:', `private-chat.${currentUserId}`);

    channel.bind("message.sent", (newMessage: ChatMessage) => {
        console.log('📩 PUSHER MESSAGE RECEIVED:', newMessage);

        const { selectedUser } = get();

        set(state => {

            let messages = state.messages;

            // Agar current chat open hai to message add karo
            if (
                selectedUser &&
                (
                    selectedUser.id === newMessage.sender_id ||
                    selectedUser.id === newMessage.receiver_id
                )
            ) {

                const exists = messages.some(m => m.id === newMessage.id);

                if (!exists) {
                    messages = [...messages, newMessage];
                }
            }

            // Sidebar update
            let users = [...state.users];

            const index = users.findIndex(
                u =>
                    u.id === newMessage.sender_id ||
                    u.id === newMessage.receiver_id
            );

            if (index !== -1) {

                users[index] = {

                    ...users[index],

                    last_message: newMessage.message,

                    last_message_at: newMessage.created_at,

                    unread_count:
                        selectedUser?.id === users[index].id
                            ? 0
                            : (users[index].unread_count || 0) + 1
                };

                // WhatsApp jaisa top per lao
                const updated = users.splice(index, 1)[0];

                users.unshift(updated);
            }

            return {
                users,
                messages
            };
        });

    });

},
    unsubscribeFromMessages: () => {
        const {
            currentUserId
        } = get()
        if (!currentUserId)
            return
        pusherClient.unsubscribe(
            `private-chat.${currentUserId}`
        )
    },
    // Polling fallback - fetches new messages every 5 seconds
   
    markAsRead: (userId: number) => {
        set(state => ({
            users:
                state.users.map(user =>
                    user.id === userId
                        ?
                        {
                            ...user,
                            unread_count: 0
                        }
                        :
                        user
                )
        }))
    }
}))