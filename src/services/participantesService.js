import { useSupabase } from '@/composables/useSupabase'

const { supabase } = useSupabase()

export const getParticipantes = async (eventoId) => {
	try {
		const { data, error } = await supabase
			.from('participants')
			.select(`*, categories(name)`)
			.eq('event_id', eventoId)
		if (error) {
			throw error
		}
		return data
	} catch (error) {
		console.error(error)
	}
}

export const postParticipante = async (participante) => {
	try {
	} catch (error) {
		console.error(error)
	}
}

export const putParticipante = async (participante) => {
	try {
	} catch (error) {
		console.error(error)
	}
}

export const deleteParticipante = async (participanteId) => {
	try {
	} catch (error) {
		console.error(error)
	}
}
