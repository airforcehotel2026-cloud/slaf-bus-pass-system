import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // null if not logged in
    roles: [
      'Applicant', 
      'Off I/C', 
      'O/Room', 
      'P3 Clerk', 
      'P3 Officer', 
      'Base CMDr', 
      'P&R Branch', 
      'Imprest Branch'
    ]
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentRole: (state) => state.user ? state.user.role : null
  },
  actions: {
    login(roleName) {
      if (this.roles.includes(roleName)) {
        this.user = {
          name: `Mock ${roleName}`,
          role: roleName,
          serviceNo: `SLAF/${Math.floor(1000 + Math.random() * 9000)}` 
        }
      }
    },
    logout() {
      this.user = null
    }
  }
})
