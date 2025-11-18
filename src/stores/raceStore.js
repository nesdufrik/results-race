import { defineStore } from 'pinia'

export const useRaceStore = defineStore('race', {
	state: () => ({
		events: [],
		participants: [],
	}),
	actions: {
		setEvents(events) {
			this.events = events
		},
		setParticipants(participants) {
			this.participants = participants
		},
	},
})
