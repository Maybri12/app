<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF()">
                    <v-icon>print</v-icon>
                </v-btn>
                <v-toolbar-title>Artículos</v-toolbar-title>
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
                                        <v-text-field v-model="codigo" label="Código">
                                        </v-text-field>
                                        <p class="red--text" v-show="valida == 1">
                                            {{ validation.firstError("codigo") }}
                                        </p>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-select v-model="categoria" :items="categorias" label="Categoría">
                                        </v-select>
                                        <p class="red--text" v-show="valida == 1">
                                            {{ validation.firstError("categoria") }}
                                        </p>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-select v-model="marca" :items="marcas" label="Marcas">
                                        </v-select>
                                        <p class="red--text" v-show="valida == 1">
                                            {{ validation.firstError("marca") }}
                                        </p>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="nombre" label="Nombre">
                                        </v-text-field>
                                        <p class="red--text" v-show="valida == 1">
                                            {{ validation.firstError("nombre") }}
                                        </p>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field type="number" v-model="stock" label="Stock">
                                        </v-text-field>
                                        <p class="red--text" v-show="valida == 1">
                                            {{ validation.firstError("stock") }}
                                        </p>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field v-model="precio_venta" label="precio_venta">
                                        </v-text-field>
                                        <p class="red--text" v-show="valida == 1">
                                            {{ validation.firstError("precio_venta") }}
                                        </p>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12>
                                        <v-select v-model="ubicacion" :items="ubicaciones" label="Ubicacion">
                                        </v-select>
                                        <p class="red--text" v-show="valida == 1">
                                            {{ validation.firstError("ubicacion") }}
                                        </p>
                                    </v-flex>
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
                            Estás a punto de eliminar el Artículo <b>{{ adNombre }}</b>
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
            <Spinner v-if="ifLoad" />
            <v-data-table v-else :headers="headers" :items="articulos" :search="search" class="elevation-1">
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
                        </template> &nbsp;&nbsp;
                        <v-icon small class="mr-2" @click="EliminarMostrar(props.item)">
                            delete
                        </v-icon>
                    </td>
                    <td>{{ props.item.codigo }}</td>
                    <td>{{ props.item.nombre }}</td>
                    <td> {{ props.item.categorium.nombre }} </td>
                    <td>{{ props.item.stock }}</td>
                    <td>{{ props.item.precio_venta }}</td>
                    <td>{{ props.item.marca.nombre }}</td>
                    <td>{{ props.item.ubicacion.nombre }}</td>
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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import Spinner from '../layout/Spinner.vue'
export default {
    components: { Spinner },
    data() {
        return {
            dialog: false,
            ifLoad: false,
            search: '',
            articulos: [],
            headers: [
                { text: 'Opciones', value: 'opciones', sortable: false },
                { text: 'Código', value: 'codigo', sortable: false },
                { text: 'Nombre', value: 'nombre', sortable: true },
                { text: 'Categoría', value: 'categorium.nombre', sortable: true },
                { text: 'Stock', value: 'stock', sortable: false },
                { text: 'Pre. Venta', value: 'precio_venta', sortable: false },
                { text: 'Marca', value: 'descripcion', sortable: false },
                { text: 'Ubicacion', value: 'ubicacion', sortable: false },
                { text: 'Estado', value: 'estado', sortable: false }
            ],
            editedIndex: -1,
            id: '',
            categoria: '',
            categorias: [],
            ubicacion : '',
            ubicaciones: [],
            marca: '',
            marcas: [],
            codigo: '',
            nombre: '',
            stock: 0,
            precio_venta: 0,
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
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
        }
    },
    validators: { //area
        nombre: function (value) {
            return this.$validator
                .value(value)
                .required()
                .minLength(3)
                .maxLength(80);
        },
        codigo: function (value) {
            return this.$validator
                .value(value)
                .required()
                .minLength(2)
                .maxLength(80);
        },
        categoria: function (value) {
            return this.$validator
                .value(value)
                .required()
        },
        marca: function (value) {
            return this.$validator
                .value(value)
                .required()
        },
        ubicacion: function (value) {
            return this.$validator
                .value(value)
                .required()
        },
        stock: function (value) {
            return this.$validator
                .value(value)
                .required()
                .greaterThan(-1)
        },
        precio_venta: function (value) {
            return this.$validator
                .value(value)
                .required()
                .greaterThan(-1)
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        }
    },
    created() {
        this.listar();
        this.selectCategoria();
        this.selectMarcas();
        this.selectUbicacion();
    },
    methods: {
        crearPDF() {
            var columns = [
                { title: "Nombre", dataKey: "nombre" },
                { title: "Código", dataKey: "codigo" },
                { title: "Categoría", dataKey: "categoria" },
                { title: "Stock", dataKey: "stock" },
                { title: "Precio Venta", dataKey: "precio_venta" }
            ];
            var rows = [];
            this.articulos.map(function (x) {
                rows.push(
                    {
                        nombre: x.nombre,
                        codigo: x.codigo,
                        categoria: x.categorium.nombre,
                        stock: x.stock,
                        precio_venta: x.precio_venta
                    }
                );
            });
            var doc = new jsPDF('p', 'pt');
            doc.autoTable(columns, rows, {
                margin: { top: 60 },
                addPageContent: function (data) {
                    doc.text("Lista de Artículos", 40, 30);
                }
            });
            doc.save('Articulos.pdf');
        },
        selectCategoria() {
            let me = this;
            let categoriaArray = [];
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('categoria/list', configuracion).then(function (response) {
                categoriaArray = response.data;
                categoriaArray.map(function (x) {
                    me.categorias.push({ text: x.nombre, value: x.id });
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        selectMarcas() {
            let me = this;
            let marcasArray = [];
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('marca/list', configuracion).then(function (response) {
                marcasArray = response.data;
                marcasArray.map(function (x) {
                    me.marcas.push({ text: x.nombre, value: x.id });
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        selectUbicacion() {
            let me = this;
            let ubicacionArray = [];
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('ubicacion/list', configuracion).then(function (response) {
                ubicacionArray = response.data;
                ubicacionArray.map(function (x) {
                    me.ubicaciones.push({ text: x.nombre, value: x.id });
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        listar() {
            this.ifLoad = true;
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('articulo/list', configuracion).then(function (response) {
                me.articulos = response.data;
                console.log(me.articulos);
                me.ifLoad = false;
            }).catch(function (error) {
                this.ifLoad = false;
                console.log(error);
            });
        },
        limpiar() {
            this.id = '';
            this.nombre = '';
            this.codigo = '';
            this.stock = 0;
            this.precio_venta = 0;
            this.descripcion = '';
            this.valida = 0;
            this.validaMensaje = [];
            this.editedIndex = -1;
        },
        guardar() {
            let me = this;
            let configuracion = { headers: {'x-access-token': this.$store.state.token, 'options': 'Agrego Articulo'} };
            this.$validate().then(success => {
                if (!success) {
                    this.valida = 1;
                    return;
                }
                if (this.editedIndex > -1) {
                    //Código para editar
                    axios.put('articulo/update',
                        {
                            'id': this.id,
                            'categoriumId': this.categoria,
                            'codigo': this.codigo,
                            'marcaId': this.marca,
                            'ubicacionId': this.ubicacion,
                            'nombre': this.nombre,
                            'stock': this.stock,
                            'precio_venta': this.precio_venta,
                            'descripcion': this.descripcion
                        }, configuracion)
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
                    axios.post('articulo/add',
                        {
                            'categoriumId': this.categoria,
                            'codigo': this.codigo,
                            'marcaId': this.marca,
                            'ubicacionId': this.ubicacion,
                            'nombre': this.nombre,
                            'stock': this.stock,
                            'precio_venta': this.precio_venta,
                            'descripcion': this.descripcion
                        }, configuracion)
                        .then(function (response) {
                            me.limpiar();
                            me.close();
                            me.listar();
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        },
        open(){
            this.valida = 0;
            this.dialog = true;
            this.limpiar()
        },
        editItem(item) {
            this.valida = 0;
            this.id = item.id;
            this.categoria = item.categorium.id;
            this.codigo = item.codigo;
            this.nombre = item.nombre;
            this.stock = item.stock;
            this.precio_venta = item.precio_venta;
            this.descripcion = item.descripcion;
            this.dialog = true;
            this.editedIndex = 1;
        },
        activarDesactivarMostrar(accion, item) {
            this.adModal = 1;
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
            let configuracion = { headers: {'x-access-token': this.$store.state.token, 'options': 'Elimino Articulo'} };
            axios.delete(`articulo/remove/${this.adId}`,  configuracion)
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
            axios.put('articulo/activate', { 'id': this.adId }, configuracion)
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
            axios.put('articulo/deactivate', { 'id': this.adId }, configuracion)
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