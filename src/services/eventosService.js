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
		const response = await axios.post(`/eventos/put?id=${evento.id}`, evento)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const deleteEvento = async (eventoId) => {
	try {
		const response = await axios.post(`/eventos/delete?id=${eventoId}`)
		return response.data
	} catch (error) {
		console.error(error)
	}
}
