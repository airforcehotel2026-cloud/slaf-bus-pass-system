import { defineStore } from 'pinia'

export const useApplicationStore = defineStore('applications', {
  state: () => ({
    // Array of mock applications
    list: []
  }),
  actions: {
    submitApplication(appData) {
      this.list.push({
        id: 'REQ-' + Math.floor(10000 + Math.random() * 90000),
        ...appData, // svcNo, rank, name, postedCamp, category, amount, journeyFrom, journeyTo
        
        // Status tracking
        status: 'Pending Off I/C',
        applicationReceivedDate: new Date().toLocaleDateString(),
        
        // CTB & Camp Tracking (Filled in by Imprest Branch in Phase 3)
        hoToCtbDate: null,
        receivedFromCtbDate: null,
        busPassNo: null,
        dateHoToCamp: null,
        
        // Returns
        returnDateFromCamp: null,
        hoDateToCtbReturn: null,
        
        history: [
          { step: 'Applied', role: 'Applicant', timestamp: new Date().toLocaleString() }
        ]
      })
    },

    updateApplicationTracking(appId, trackingData) {
      const app = this.list.find(a => a.id === appId)
      if (app) {
        Object.assign(app, trackingData)
      }
    },

    approveApplication(appId, currentRole, nextRoleStr) {
      const app = this.list.find(a => a.id === appId)
      if (app) {
        app.status = nextRoleStr
        app.history.push({ step: 'Approved', role: currentRole, timestamp: new Date().toLocaleString() })
      }
    }
  }
})
