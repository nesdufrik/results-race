import {
	getEventos,
	postEvento,
	putEvento,
	deleteEvento,
} from '@/services/eventosService'
import {
	getParticipantes,
	postParticipante,
	putParticipante,
	deleteParticipante,
} from '@/services/participantesService'
import { useRaceStore } from '@/stores/raceStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useSupabase } from './useSupabase'

export const useRace = () => {
	const { supabase } = useSupabase()
	const raceStore = useRaceStore()
	const { events, participants, getParticipants } = storeToRefs(raceStore)
	const loading = ref(false)

	const loadEventos = async () => {
		try {
			loading.value = true
			const data = await getEventos()
			raceStore.setEvents(data)
			loading.value = false
		} catch (error) {
			return Promise.reject(error)
		}
	}

	const createEvento = async (evento) => {
		try {
			loading.value = true
			const response = await postEvento(evento)
			loading.value = false
			return response
		} catch (error) {
			return Promise.reject(error)
		}
	}

	const updateEvento = async (event) => {
		try {
			loading.value = true
			const response = await putEvento(event)
			loading.value = false
			return response
		} catch (error) {
			return Promise.reject(error)
		}
	}

	const removeEvento = async (id) => {
		try {
			loading.value = true
			const response = await deleteEvento(id)
			loading.value = false
			return response
		} catch (error) {
			return Promise.reject(error)
		}
	}

	const loadParticipantes = async (eventoId) => {
		try {
			loading.value = true
			const data = await getParticipantes(eventoId)
			raceStore.setParticipants(data)
			loading.value = false
		} catch (error) {
			return Promise.reject(error)
		}
	}

	const createParticipante = async (participante) => {
		try {
			loading.value = true
			const response = await postParticipante(participante)
			loading.value = false
			return response
		} catch (error) {
			return Promise.reject(error)
		}
	}

	const updateParticipante = async (participante) => {
		try {
			loading.value = true
			const response = await putParticipante(participante)
			loading.value = false
			return response
		} catch (error) {
			return Promise.reject(error)
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

	const removeParticipante = async (id) => {
		try {
			loading.value = true
			const response = await deleteParticipante(id)
			loading.value = false
			return response
		} catch (error) {
			return Promise.reject(error)
		}
	}

	const getLeaderboard = (eventoId, categoryId) => {
		return raceStore.getLeaderboard(eventoId, categoryId)
	}

	return {
		events,
		participants,
		getParticipants,
		loading,
		loadEventos,
		createEvento,
		updateEvento,
		removeEvento,
		loadParticipantes,
		createParticipante,
		updateParticipante,
		removeParticipante,
		getLeaderboard,
		registerFinish,
	}
}
