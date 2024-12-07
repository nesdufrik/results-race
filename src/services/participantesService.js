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
		const response = await axios.post(
			`/participantes/put?id=${participante.identificador}`,
			participante
		)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const deleteParticipante = async (participanteId) => {
	try {
		const response = await axios.post(
			`/participantes/delete?=${participanteId}`
		)
		return response.data
	} catch (error) {
		console.error(error)
	}
}
