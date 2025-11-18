import { useRaceStore } from '@/stores/raceStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useSupabase } from './useSupabase'

export const useRace = () => {
	const { supabase } = useSupabase()
	const raceStore = useRaceStore()
	const { events, participants } = storeToRefs(raceStore)
	const loading = ref(false)

	const loadEvents = async () => {
		try {
			loading.value = true
			const { data, error } = await supabase
				.from('events')
				.select(`*,start_groups(*)`)
			if (error) throw error
			raceStore.setEvents(data)
		} catch (error) {
			return Promise.reject(error)
		} finally {
			loading.value = false
		}
	}

	const registerStart = async (event) => {
		const time = new Date().toISOString()
		try {
			loading.value = true
			const { data, error } = await supabase
				.from('start_groups')
				.update({
					start_time: time,
				})
				.in('id', event.start_groups)
				.select()

			if (error) throw error
			return data
		} catch (error) {
			console.error(error)
		} finally {
			loading.value = false
		}
	}

	const loadParticipants = async (eventoId) => {
		try {
			loading.value = true
			const { data, error } = await supabase
				.from('participants')
				.select(`*, categories(name)`)
				.eq('event_id', eventoId)
			if (error) throw error
			raceStore.setParticipants(data)
		} catch (error) {
			console.error(error)
		} finally {
			loading.value = false
		}
	}

	const registerFinish = async (raceNumber, eventId) => {
		if (!raceNumber) {
			alert('Número de dorsal requerido')
			return
		}

		const { error } = await supabase.rpc('register_finish_time', {
			p_race_number: raceNumber,
			p_event_id: eventId,
		})

		if (error) {
			console.error('Error registering finish time:', error)
			alert(`Error: ${error.message}`)
		}
	}

	return {
		events,
		participants,
		loading,
		loadEvents,
		loadParticipants,
		registerStart,
		registerFinish,
	}
}
