import { defineStore } from 'pinia'

export const useRaceStore = defineStore('race', {
	state: () => ({
		events: [],
		participants: [],
	}),
	getters: {
		getEvents: (state) => state.events,
		getParticipants: (state) => {
			return state.participants.map((participant) => {
				return {
					...participant,
					startTime: state.events
						.find((event) => event.identificador === participant.eventoId)
						.categories.find(
							(category) => category.id === participant.categoryId
						).startTime,
				}
			})
		},
	},
	actions: {
		setEvents(events) {
			this.events = events
		},
		setParticipants(participants) {
			this.participants = participants
		},
	},
})
