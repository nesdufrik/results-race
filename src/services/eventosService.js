import axios from 'axios'

export const getEventos = async () => {
	try {
		const response = await axios.get('/eventos')
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const postEvento = async (evento) => {
	try {
		const response = await axios.post('/eventos', evento)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const putEvento = async (evento) => {
	try {
		const response = await axios.put(
			`/de32e52d-7c36-4d63-8e9b-9bc08da2e7bb/eventos/${evento.id}`,
			evento
		)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const deleteEvento = async (eventoId) => {
	try {
		const response = await axios.delete(
			`/de32e52d-7c36-4d63-8e9b-9bc08da2e7bb/eventos/${eventoId}`
		)
		return response.data
	} catch (error) {
		console.error(error)
	}
}
