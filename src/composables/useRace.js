import { useRaceStore } from '@/stores/raceStore'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useSupabase } from './useSupabase'
import { email } from 'zod'

export const useRace = () => {
	const { supabase } = useSupabase()
	const raceStore = useRaceStore()
	const {
		events,
		participants,
		event,
		categorie,
		categories,
		participant,
		startGroups,
	} = storeToRefs(raceStore)

	const loading = reactive({
		loadEvents: false,
		loadEvent: false,
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
		registerNewParticipant: false,
		editParticipant: false,
		loadCategories: false,
		deleteParticipant: false,
		assignParticipantNumber: false,
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

	const loadEvent = async (eventId) => {
		try {
			loading.loadEvent = true
			const { data, error } = await supabase
				.from('events')
				.select(`*,start_groups(*,categories(*))`)
				.eq('id', eventId)
			if (error) throw error
			raceStore.setEvent(data[0])
		} catch (error) {
			console.error(error)
		} finally {
			loading.loadEvent = false
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

	const loadCategories = async (eventId) => {
		try {
			loading.loadCategories = true
			const { data, error } = await supabase
				.from('categories_list')
				.select()
				.eq('event_id', eventId)
			if (error) throw error
			raceStore.setCategories(data)
		} catch (error) {
			console.error(error)
		} finally {
			loading.loadCategories = false
		}
	}

	const loadParticipants = async (eventoId) => {
		try {
			loading.loadParticipants = true
			const { data, error } = await supabase
				.from('participants')
				.select(`*, categories(*, start_groups(*))`)
				.eq('event_id', eventoId)
			if (error) throw error
			raceStore.setParticipants(data)
		} catch (error) {
			console.error(error)
		} finally {
			loading.loadParticipants = false
		}
	}

	const registerNewParticipant = async (newParticipant) => {
		try {
			loading.registerNewParticipant = true
			const { data, error } = await supabase
				.from('participants')
				.insert({
					event_id: newParticipant.event_id,
					category_id: newParticipant.category_id,
					race_number: newParticipant.race_number,
					full_name: newParticipant.full_name,
					email: newParticipant.email,
					phone: newParticipant.phone,
					birth_date: newParticipant.birth_date,
					gender: newParticipant.gender,
					team: newParticipant.team,
				})
				.select()
			if (error) throw error

			return data
		} catch (error) {
			console.error(error)
			return Promise.reject(error)
		} finally {
			loading.registerNewParticipant = false
		}
	}

	const editParticipant = async (participantEdit) => {
		try {
			loading.editParticipant = true
			const { data, error } = await supabase
				.from('participants')
				.update({
					category_id: participantEdit.category_id,
					race_number: participantEdit.race_number,
					full_name: participantEdit.full_name,
					email: participantEdit.email,
					phone: participantEdit.phone,
					birth_date: participantEdit.birth_date,
					gender: participantEdit.gender,
					team: participantEdit.team,
				})
				.eq('id', participantEdit.id)
			if (error) throw error
			return data
		} catch (error) {
			console.error(error)
			return Promise.reject(error)
		} finally {
			loading.editParticipant = false
		}
	}

	const deleteParticipant = async (participantId) => {
		try {
			loading.deleteParticipant = true
			const { data, error } = await supabase
				.from('participants')
				.delete()
				.eq('id', participantId)
			if (error) throw error
			return data
		} catch (error) {
			console.error(error)
			return Promise.reject(error)
		} finally {
			loading.deleteParticipant = false
		}
	}

	const assignParticipantNumber = async (participantId, raceNumber) => {
		try {
			loading.assignParticipantNumber = true
			const { data, error } = await supabase
				.from('participants')
				.update({
					race_number: raceNumber,
				})
				.eq('id', participantId)
			if (error) throw error
			return data
		} catch (error) {
			console.error(error)
			return Promise.reject(error)
		} finally {
			loading.assignParticipantNumber = false
		}
	}

	return {
		events,
		event,
		categorie,
		categories,
		startGroups,
		participant,
		participants,
		loading,
		loadEvents,
		loadEvent,
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
		loadCategories,
		registerNewParticipant,
		editParticipant,
		deleteParticipant,
		assignParticipantNumber,
	}
}
