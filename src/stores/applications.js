import { defineStore } from 'pinia'
import { supabase } from 'src/boot/supabase'

export const useApplicationStore = defineStore('applications', {
  state: () => ({
    list: [],
    loading: false,
    subscription: null
  }),
  actions: {
    async fetchApplications() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*, application_history(*)')
          .order('created_at', { ascending: false })

        if (error) throw error

        this.list = this._mapApplications(data)
      } catch (error) {
        console.error('Error fetching applications:', error.message)
      } finally {
        this.loading = false
      }
    },

    subscribeToApplications() {
      if (this.subscription) return

      this.subscription = supabase
        .channel('public:applications')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
          this.fetchApplications()
        })
        .subscribe()
    },

    unsubscribeApplications() {
      if (this.subscription) {
        supabase.removeChannel(this.subscription)
        this.subscription = null
      }
    },

    _mapApplications(data) {
      return data.map(item => ({
        id: item.id,
        applicantId: item.applicant_id,
        name: item.name,
        address: item.address,
        nic: item.nic,
        mobile: item.mobile,
        rank: item.rank,
        postedCamp: item.posted_camp,
        svcNo: item.svc_no,
        hasPreviousPass: item.has_previous_pass ? 'Yes' : 'No',
        previousPassNo: item.previous_pass_no,
        journeyFrom: item.journey_from,
        journeyTo: item.journey_to,
        nearestTown: item.nearest_town,
        busRouteNo: item.bus_route_no,
        amount: item.amount,
        distance: item.distance,
        status: item.status,
        applicationReceivedDate: item.application_received_date,
        hoToCtbDate: item.ho_to_ctb_date,
        receivedFromCtbDate: item.received_from_ctb_date,
        busPassNo: item.bus_pass_no,
        dateHoToCamp: item.date_ho_to_camp,
        returnDateFromCamp: item.return_date_from_camp,
        hoDateToCtbReturn: item.ho_date_to_ctb_return,
        history: (item.application_history || []).map(h => ({
          step: h.step,
          role: h.role,
          timestamp: h.timestamp
        }))
      }))
    },

    async uploadDocument(path, file) {
      this.loading = true
      try {
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(path, file)
        return { data, error }
      } catch (error) {
        return { error }
      } finally {
        this.loading = false
      }
    },

    async submitApplication(appData) {
      this.loading = true
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        const { data, error } = await supabase
          .from('applications')
          .insert([{
            applicant_id: user.id,
            name: appData.name,
            address: appData.address,
            nic: appData.nic,
            mobile: appData.mobile,
            rank: appData.rank,
            posted_camp: appData.postedCamp,
            svc_no: appData.svcNo,
            has_previous_pass: appData.hasPreviousPass === 'Yes',
            previous_pass_no: appData.previousPassNo,
            journey_from: appData.journeyFrom,
            journey_to: appData.journeyTo,
            nearest_town: appData.nearestTown,
            bus_route_no: appData.busRouteNo,
            amount: parseFloat(appData.amount),
            distance: parseFloat(appData.distance),
            document_url: appData.documentUrl
          }])
          .select()
          .single()

        if (error) throw error

        const { error: historyError } = await supabase
          .from('application_history')
          .insert([{
            application_id: data.id,
            step: 'Applied',
            role: 'Applicant'
          }])
        
        if (historyError) throw historyError

        await this.fetchApplications()
        return { success: true }
      } catch (error) {
        console.error('Submission failed:', error.message)
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async updateApplication(appId, updatedData) {
      this.loading = true
      try {
        const { error } = await supabase
          .from('applications')
          .update({
            name: updatedData.name,
            address: updatedData.address,
            nic: updatedData.nic,
            mobile: updatedData.mobile,
            rank: updatedData.rank,
            posted_camp: updatedData.postedCamp,
            svc_no: updatedData.svcNo,
            journey_from: updatedData.journeyFrom,
            journey_to: updatedData.journeyTo,
            nearest_town: updatedData.nearestTown,
            bus_route_no: updatedData.busRouteNo,
            amount: parseFloat(updatedData.amount),
            distance: parseFloat(updatedData.distance)
          })
          .eq('id', appId)

        if (error) throw error

        const { error: historyError } = await supabase
          .from('application_history')
          .insert([{
            application_id: appId,
            step: 'Updated',
            role: 'Applicant'
          }])

        if (historyError) throw historyError
        await this.fetchApplications()
        return { success: true }
      } catch (error) {
        console.error('Update failed:', error.message)
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async updateApplicationTracking(appId, trackingData) {
      try {
        const dbData = {}
        if (trackingData.hoToCtbDate) dbData.ho_to_ctb_date = trackingData.hoToCtbDate
        if (trackingData.receivedFromCtbDate) dbData.received_from_ctb_date = trackingData.receivedFromCtbDate
        if (trackingData.busPassNo) dbData.bus_pass_no = trackingData.busPassNo
        if (trackingData.dateHoToCamp) dbData.date_ho_to_camp = trackingData.dateHoToCamp
        if (trackingData.returnDateFromCamp) dbData.return_date_from_camp = trackingData.returnDateFromCamp
        if (trackingData.hoDateToCtbReturn) dbData.ho_date_to_ctb_return = trackingData.hoDateToCtbReturn

        const { error } = await supabase
          .from('applications')
          .update(dbData)
          .eq('id', appId)

        if (error) throw error
        await this.fetchApplications()
      } catch (error) {
        console.error('Error updating tracking:', error.message)
      }
    },

    async approveApplication(appId, currentRole, nextRoleStr) {
      try {
        const { error: updateError } = await supabase
          .from('applications')
          .update({ status: nextRoleStr })
          .eq('id', appId)

        if (updateError) throw updateError

        const { error: historyError } = await supabase
          .from('application_history')
          .insert([{
            application_id: appId,
            step: 'Approved',
            role: currentRole
          }])

        if (historyError) throw historyError
        await this.fetchApplications()
      } catch (error) {
        console.error('Error approving application:', error.message)
      }
    }
  }
})
