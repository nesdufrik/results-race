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

export const useRace = () => {
	const raceStore = useRaceStore()
	const { events, participants, getParticipants } = storeToRefs(raceStore)
	const loading = ref(false)

	const loadEventos = async () => {
		try {
			loading.value = true
			const response = await getEventos()
			raceStore.setEvents(response.data)
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

	const updateEvento = async (evento) => {
		try {
			loading.value = true
			const response = await putEvento(evento)
			loading.value = false
			console.log(response)
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
			const response = await getParticipantes(eventoId)
			raceStore.setParticipants(response.data)
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
	}
}
