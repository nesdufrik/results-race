import { useRaceStore } from '@/stores/raceStore'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useSupabase } from './useSupabase'

export const useRace = () => {
	const { supabase } = useSupabase()
	const raceStore = useRaceStore()
	const { events, participants, event, categorie, participant, startGroups } =
		storeToRefs(raceStore)

	const loading = reactive({
		loadEvents: false,
		loadParticipants: false,
		registerStart: false,
		registerFinish: false,
		registerNewEvent: false,
		deleteEvent: false,
		registerNewStartGroup: false,
		deleteStartGroup: false,
		registerNewCategorie: false,
		deleteCategorie: false,
		editCategorie: false,
	})

	const loadEvents = async () => {
		try {
			loading.loadEvents = true
			const { data, error } = await supabase
				.from('events')
				.select(`*,start_groups(*,categories(*))`)
			if (error) throw error
			raceStore.setEvents(data)
		} catch (error) {
			return Promise.reject(error)
		} finally {
			loading.loadEvents = false
		}
	}

	const registerStart = async (event) => {
		const time = new Date().toISOString()
		try {
			loading.registerStart = true
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
			loading.registerStart = false
		}
	}

	const loadParticipants = async (eventoId) => {
		try {
			loading.loadParticipants = true
			const { data, error } = await supabase
				.from('participants')
				.select(`*, categories(name)`)
				.eq('event_id', eventoId)
			if (error) throw error
			raceStore.setParticipants(data)
		} catch (error) {
			console.error(error)
		} finally {
			loading.loadParticipants = false
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

	const registerNewEvent = async (newEvent) => {
		try {
			loading.registerNewEvent = true
			const { data, error } = await supabase
				.from('events')
				.insert({
					name: newEvent.name,
					event_date: newEvent.event_date,
					location: newEvent.location,
				})
				.select()
			if (error) throw error

			raceStore.addEvent(data[0])

			return data
		} catch (error) {
			console.error(error)
			return Promise.reject(error)
		} finally {
			loading.registerNewEvent = false
		}
	}

	const deleteEvent = async (eventId) => {
		try {
			loading.deleteEvent = true
			const { data, error } = await supabase
				.from('events')
				.delete()
				.eq('id', eventId)
			if (error) throw error

			raceStore.removeEvent(eventId)
			return data
		} catch (error) {
			console.error(error)
			return Promise.reject(error)
		} finally {
			loading.deleteEvent = false
		}
	}

	const registerNewStartGroup = async (newStartGroup) => {
		try {
			loading.registerNewStartGroup = true
			const { data, error } = await supabase
				.from('start_groups')
				.insert({
					name: newStartGroup.name,
					event_id: newStartGroup.event_id,
				})
				.select()
			if (error) throw error

			raceStore.addStartGroup(data[0])

			return data
		} catch (error) {
			console.error(error)
			return Promise.reject(error)
		} finally {
			loading.registerNewStartGroup = false
		}
	}

	const deleteStartGroup = async (eventId, startGroupId) => {
		try {
			loading.deleteStartGroup = true
			const { data, error } = await supabase
				.from('start_groups')
				.delete()
				.eq('id', startGroupId)
			if (error) throw error

			raceStore.removeStartGroup(eventId, startGroupId)
			return data
		} catch (error) {
			console.error(error)
			return Promise.reject(error)
		} finally {
			loading.deleteStartGroup = false
		}
	}

	const registerNewCategorie = async (newCategorie) => {
		try {
			loading.registerNewCategorie = true
			const { data, error } = await supabase
				.from('categories')
				.insert({
					start_group_id: newCategorie.start_group_id,
					name: newCategorie.name,
					min_age: newCategorie.min_age,
					max_age: newCategorie.max_age,
					gender: newCategorie.gender,
				})
				.select()
			if (error) throw error

			return data
		} catch (error) {
			console.error(error)
			return Promise.reject(error)
		} finally {
			loading.registerNewCategorie = false
		}
	}

	const deleteCategorie = async (categorieId) => {
		try {
			loading.deleteCategorie = true
			const { data, error } = await supabase
				.from('categories')
				.delete()
				.eq('id', categorieId)
			if (error) throw error
			return data
		} catch (error) {
			console.error(error)
			return Promise.reject(error)
		} finally {
			loading.deleteCategorie = false
		}
	}

	const editCategorie = async (categorieEdit) => {
		try {
			loading.editCategorie = true
			const { data, error } = await supabase
				.from('categories')
				.update({
					name: categorieEdit.name,
					min_age: categorieEdit.min_age,
					max_age: categorieEdit.max_age,
					gender: categorieEdit.gender,
				})
				.eq('id', categorieEdit.id)
			if (error) throw error
			return data
		} catch (error) {
			console.error(error)
			return Promise.reject(error)
		} finally {
			loading.editCategorie = false
		}
	}

	return {
		events,
		event,
		categorie,
		startGroups,
		participant,
		participants,
		loading,
		loadEvents,
		loadParticipants,
		registerStart,
		registerFinish,
		registerNewEvent,
		deleteEvent,
		registerNewStartGroup,
		deleteStartGroup,
		registerNewCategorie,
		deleteCategorie,
		editCategorie,
	}
}
