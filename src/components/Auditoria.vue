<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Módulo Auditoria</v-toolbar-title>
                <v-divider class="mx-2" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line
                    hide-details></v-text-field>
                <v-spacer></v-spacer>

                
                <v-dialog v-model="adModal2" max-width="290">
                    <v-card>
                        <v-card-title class="headline">
                            Eliminar Item
                        </v-card-title>

                        <v-card-text>
                            Estás a punto de eliminar la categoria <b>{{ adNombre }}</b>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="activarDesactivarCerrar()" color="green darken-1" flat="flat">
                                Cancelar
                            </v-btn>

                            <v-btn @click="remove()" color="orange darken-4" flat="flat">
                                Eliminar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <Spinner v-if="ifLoad">Resetear</Spinner>
            <v-data-table v-else :headers="headers" :items="categorias" :search="search" class="elevation-1">
                <template v-slot:items="props">
                    <td class="justify-center layout px-0">
                        
                        <v-icon small  @click="EliminarMostrar(props.item)">
                            delete
                        </v-icon>
                    </td>
                    <td>{{ props.item.usuario }}</td>
                    <td>{{ props.item.tipo }}</td>
                    <td>{{ props.item.createdAt.substring(0, 10) }}</td>
                    <td>{{ props.item.documento }}</td>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="listar()">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>

    </v-layout>
</template>
<script>
import axios from 'axios'
import Spinner from '../layout/Spinner.vue'
export default {
    components: { Spinner },
    data() {
        return {
            dialog: false,
            ifLoad: false,
            search: '',
            categorias: [],
            headers: [
                { text: 'Opciones', value: 'opciones', sortable: false },
                { text: 'Usuario', value: 'usuario', sortable: true },
                { text: 'Tipo', value: 'tipo', sortable: true },
                { text: 'Fecha', value: 'createdAt', sortable: false },
                { text: 'Estado', value: 'documento', sortable: false },
            ],
            editedIndex: -1,
            id: '',
            nombre: '',
            descripcion: '',
            valida: 0,
            validaMensaje: [],
            adModal: 0,
            adModal2: false,
            adAccion: 0,
            adNombre: '',
            adId: ''
        }
    },
    validators: { //area
        nombre : function(value) {
            return this.$validator
                .value(value)
                .required()
                .minLength(3)
                .maxLength(80);
        },

    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
        }
    },
    watch: {
        dialog(val) {
            val || this.close()
        }
    },
    created() {
        this.listar()
    },
    methods: {
        listar() {
            this.ifLoad = true;
            let me = this;
            let configuracion = { headers: {'x-access-token': this.$store.state.token, 'options': 'Listas Categorias'} };
            axios.get('auditoria/list', configuracion).then(function (response) {
                me.categorias = response.data;
                me.ifLoad = false;
            }).catch(function (error) {
                this.ifLoad = false;
                console.log(error);
            });
        },
        limpiar() {
            this.id = '';
            this.nombre = '';
            this.descripcion = '';
            this.valida = 0;
            this.validaMensaje = [];
            this.editedIndex = -1;
        },

        open(){
            this.valida = 0;
            this.dialog = true;
        },
        editItem(item) {
            this.valida = 0;
            this.id = item.id;
            this.nombre = item.nombre;
            this.descripcion = item.descripcion;
            this.dialog = true;
            this.editedIndex = 1;
        },
        activarDesactivarMostrar(accion, item) {
            this.adModal = 1;
            this.valida = 0;
            this.adNombre = item.nombre;
            this.adId = item.id;
            if (accion == 1) {
                this.adAccion = 1;
            } else if (accion == 2) {
                this.adAccion = 2;
            } else {
                this.adModal = 0;
            }
        },
        EliminarMostrar(item) {
            this.adModal2 = true;
            this.adNombre = item.nombre;
            this.adId = item.id;

        },
        activarDesactivarCerrar() {
            this.adModal = 0;
            this.adModal2 = false;
        },
        remove() {
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.delete(`auditoria/remove/${this.adId}`, {}, configuracion)
                .then(function (response) {
                    me.adModal2 = false;
                    me.adNombre = '';
                    me.adId = '';
                    me.listar();
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        close() {
            this.dialog = false;
        }
    }
}
</script>
