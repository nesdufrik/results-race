import { defineStore } from 'pinia'

export const useRaceStore = defineStore('race', {
	state: () => ({
		events: [],
		event: {},
		startGroups: {},
		categorie: {},
		categories: [],
		participants: [],
		participant: {},
	}),
	actions: {
		setEvents(events) {
			this.events = events
		},
		setEvent(event) {
			this.event = event
		},
		setParticipants(participants) {
			this.participants = participants
		},
		addEvent(event) {
			this.events.push(event)
		},
		removeEvent(eventId) {
			this.events = this.events.filter((event) => event.id !== eventId)
		},
		addStartGroup(startGroup) {
			this.events
				.find((event) => event.id === startGroup.event_id)
				.start_groups.push(startGroup)
		},
		removeStartGroup(eventId, startGroupId) {
			this.events = this.events.map((event) => {
				if (event.id === eventId) {
					event.start_groups = event.start_groups.filter(
						(startGroup) => startGroup.id !== startGroupId
					)
				}
				return event
			})
		},
		setCategories(categories) {
			this.categories = categories
		},
	},
})
