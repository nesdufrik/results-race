import axios from 'axios'

export const getParticipantes = async (eventoId) => {
	try {
		const response = await axios.get(`/participantes?eventoId=${eventoId}`)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const postParticipante = async (participante) => {
	try {
		const response = await axios.post('/participantes', participante)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const putParticipante = async (participante) => {
	try {
		const response = await axios.put(
			`/065e8430-6df5-4505-a07f-4bf6390d7872/participantes/${participante.id}`,
			participante
		)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const deleteParticipante = async (participanteId) => {
	try {
		const response = await axios.delete(
			`/065e8430-6df5-4505-a07f-4bf6390d7872/participantes/${participanteId}`
		)
		return response.data
	} catch (error) {
		console.error(error)
	}
}
