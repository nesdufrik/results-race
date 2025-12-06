<script setup>
import { inject, onMounted, ref } from 'vue';
import { useRace } from '@/composables/useRace';

const { participantsListComplete, loadParticipantsListComplete } = useRace()
const dialogRef = inject('dialogRef')

const dt = ref()

const exportCSV = () => {
    dt.value.exportCSV()
}

onMounted(() => {
    loadParticipantsListComplete(dialogRef.value.data.eventId)
})

</script>
<template>
    <DataTable :value="participantsListComplete" ref="dt">
        <template #header>
            <div class="text-end pb-4">
                <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
            </div>
        </template>
        <Column field="race_number" header="Numero"></Column>
        <Column field="full_name" header="Nombre"></Column>
        <Column field="team" header="Equipo"></Column>
        <Column field="start_group_name" header="Grupo"></Column>
        <Column field="category_name" header="Categoria"></Column>
        <Column field="event_name" header="Evento"></Column>
    </DataTable>
</template>