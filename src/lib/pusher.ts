import Pusher from 'pusher-js'


export const PUSHER_CONFIG = {
  key: '8b5d2d1012a29f43271c',
  cluster:  'ap2',
  authEndpoint: 'https://realstatebackend.processiqtech.com/test/public/broadcasting/auth',
}

export const pusherClient = new Pusher(PUSHER_CONFIG.key, {
  cluster: PUSHER_CONFIG.cluster,
  authorizer: (channel: any) => ({
    authorize: (socketId: string, callback: (error: Error | null, data?: any) => void) => {
      const token = localStorage.getItem('token') || ''
      console.log('🔑 PUSHER AUTH for', channel.name, 'token:', token ? token.slice(0, 20) + '...' : 'EMPTY')
      fetch(PUSHER_CONFIG.authEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ socket_id: socketId, channel_name: channel.name }),
      })
        .then(res => {
          console.log('🔑 PUSHER AUTH RESPONSE STATUS:', res.status)
          return res.json()
        })
        .then(data => {
          console.log('🔑 PUSHER AUTH DATA:', data)
          callback(null, data)
        })
        .catch(err => {
          console.error('🔑 PUSHER AUTH ERROR:', err)
          callback(new Error(err.message))
        })
    },  
  }),
})

// Debug connection state
pusherClient.connection.bind('state_change', (states: { previous: string; current: string }) => {
  console.log('📡 PUSHER CONNECTION:', states.previous, '->', states.current)
})
pusherClient.connection.bind('connected', () => {
  console.log('📡 PUSHER CONNECTED, socket:', pusherClient.connection.socket_id)
})
pusherClient.connection.bind('error', (err: any) => {
  console.error('📡 PUSHER CONNECTION ERROR:', err)
})

export default pusherClient
