import { useSupabase } from '@/composables/useSupabase'

const { supabase } = useSupabase()

export const getEventos = async () => {
	try {
		const { data, error } = await supabase
			.from('events')
			.select(`*,start_groups(*)`)
		if (error) {
			throw error
		}
		return data
	} catch (error) {
		console.error(error)
	}
}

export const postEvento = async (evento) => {
	try {
	} catch (error) {}
}

export const putEvento = async (evento) => {
	const time = new Date().toISOString()
	try {
		const { data, error } = await supabase
			.from('start_groups')
			.update({ start_time: time })
			.in('id', evento.start_groups)
			.select()

		if (error) throw error
		return data
	} catch (error) {
		console.error(error)
	}
}

export const deleteEvento = async (eventoId) => {
	try {
	} catch (error) {}
}
