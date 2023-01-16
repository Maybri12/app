<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Ubicación</v-toolbar-title>
                <v-divider class="mx-2" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line
                    hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" @click="open()" v-on="on">Nuevo</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                                    </v-flex>
                                    <p class="red--text" v-show="valida ==1">
                                       {{ validation.firstError("nombre") }}
                                     </p>
                                   
                                   
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                            <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="adModal" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion == 1">
                            Activar Item
                        </v-card-title>
                        <v-card-title class="headline" v-if="adAccion == 2">
                            Desactivar Item
                        </v-card-title>
                        <v-card-text>
                            Estás a punto de <span v-if="adAccion == 1">activar </span>
                            <span v-if="adAccion == 2">desactivar </span> el item {{ adNombre }}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="activarDesactivarCerrar()" color="green darken-1" flat="flat">
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAccion == 1" @click="activar()" color="orange darken-4" flat="flat">
                                Activar
                            </v-btn>
                            <v-btn v-if="adAccion == 2" @click="desactivar()" color="orange darken-4" flat="flat">
                                Desactivar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
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
                        <v-icon small class="mr-2" @click="editItem(props.item)">
                            edit
                        </v-icon>
                        <template v-if="props.item.estado">
                            <v-icon small @click="activarDesactivarMostrar(2, props.item)">
                                block
                            </v-icon>
                        </template>
                        <template v-else>
                            <v-icon small @click="activarDesactivarMostrar(1, props.item)">
                                check
                            </v-icon>
                        </template>&nbsp;&nbsp;
                        <v-icon small class="mr-2" @click="EliminarMostrar(props.item)">
                            delete
                        </v-icon>
                    </td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.createdAt.substring(0, 10) }}</td>
                    <td>
                        <div v-if="props.item.estado">
                            <span class="blue--text">Activo</span>
                        </div>
                        <div v-else>
                            <span class="red--text">Inactivo</span>
                        </div>
                    </td>
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
                { text: 'Nombre', value: 'nombre', sortable: true },
                { text: 'Fecha', value: 'createdAt', sortable: false },
                { text: 'Estado', value: 'estado', sortable: false },
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
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('ubicacion/list', configuracion).then(function (response) {
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

        guardar() {
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };

            this.$validate().then(success => {
                if (!success) {
                    this.valida = 1;
                    return;
                }
                if (this.editedIndex > -1) {
                //Código para editar
                console.log(this.nombre)
                axios.put('ubicacion/update', { 'id': this.id, 'nombre': this.nombre, 'descripcion': this.descripcion }, configuracion)
                    .then(function (response) {
                        me.limpiar();
                        me.close();
                        me.listar();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                //Código para guardar
                axios.post('ubicacion/add', { 'nombre': this.nombre, 'descripcion': this.descripcion }, configuracion)
                    .then(function (response) {
                        me.limpiar();
                        me.close();
                        me.listar();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            })
          
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
            axios.delete(`ubicacion/remove/${this.adId}`, {}, configuracion)
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
        activar() {
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.put('ubicacion/activate', { 'id': this.adId }, configuracion)
                .then(function (response) {
                    me.adModal = 0;
                    me.adAccion = 0;
                    me.adNombre = '';
                    me.adId = '';
                    me.listar();
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        desactivar() {
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.put('ubicacion/deactivate', { 'id': this.adId }, configuracion)
                .then(function (response) {
                    me.adModal = 0;
                    me.adAccion = 0;
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
