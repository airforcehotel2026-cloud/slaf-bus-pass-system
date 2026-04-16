import { defineStore } from 'pinia'
import { supabase } from 'src/boot/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null, // Store user profile from public.profiles
    loading: false,
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
    currentRole: (state) => state.profile?.role || state.user?.user_metadata?.role || null,
    currentSvcNo: (state) => state.profile?.service_no || state.user?.user_metadata?.service_no || null
  },
  actions: {
    async fetchProfile(userId) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (!error) {
        this.profile = data
      }
    },

    async initializeChannel() {
      const { data: { session } } = await supabase.auth.getSession()
      this.user = session?.user || null
      if (this.user) await this.fetchProfile(this.user.id)
      
      supabase.auth.onAuthStateChange(async (event, session) => {
        // We use event implicitly via state changes or can just ignore it
        this.user = session?.user || null
        if (this.user) {
          await this.fetchProfile(this.user.id)
        } else {
          this.profile = null
        }
      })
    },

    async login(email, password) {
      this.loading = true
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        this.user = data.user
        await this.fetchProfile(this.user.id)
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async register(email, password, role) {
      this.loading = true
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role,
              full_name: email.split('@')[0], // Default name
              service_no: `SLAF/${Math.floor(1000 + Math.random() * 9000)}`
            }
          }
        })
        if (error) throw error
        this.user = data.user
        // Profile is automatically created by the SQL trigger on_auth_user_created
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
    }
  }
})
