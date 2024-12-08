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
		getLeaderboard(eventoId, categoryId) {
			return this.getParticipants
				.filter((p) => p.eventoId === eventoId && p.categoryId === categoryId)
				.sort((a, b) => {
					if (!a.finishTime) return 1
					if (!b.finishTime) return -1
					return new Date(a.finishTime) - new Date(b.finishTime)
				})
		},
	},
})
