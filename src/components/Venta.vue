<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Ventas</v-toolbar-title>
                <v-divider class="mx-2" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-text-field v-if="verNuevo == 0" class="text-xs-center" v-model="search" append-icon="search"
                    label="Búsqueda" single-line hide-details></v-text-field>
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
                <v-btn color="primary" v-if="verNuevo == 0" @click="mostrarNuevo()" dark class="mb-2">Nuevo</v-btn>
                <v-dialog v-model="dialog" max-width="1000px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Seleccione un artículo</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-text-field v-model="texto" @keyup.enter="listarArticulos()"
                                            class="text-xs-center" append-icon="search" label="Búsqueda"></v-text-field>
                                        <template>
                                            <v-data-table :headers="cabeceraArticulos" :items="articulos"
                                                class="elevation-1">
                                                <template v-slot:items="props">
                                                    <td class="justify-center layout px-0">
                                                        <v-icon small class="mr-2" @click="agregarDetalle(props.item)">
                                                            add
                                                        </v-icon>
                                                    </td>
                                                    <td>{{ props.item.codigo }}</td>
                                                    <td>{{ props.item.nombre }}</td>
                                                    <td>{{ props.item.categorium.nombre }}</td>
                                                    <td>{{ props.item.stock }}</td>
                                                    <td>{{ props.item.precio_venta }}</td>
                                                    <td>{{ props.item.descripcion }}</td>
                                                    
                                                </template>
                                            </v-data-table>
                                        </template>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
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
                <v-dialog v-model="comprobanteModal" max-width="1000px" class="croll">
                    <v-card class="croll">
                        <v-card-title class="headline">
                            <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn> Reporte de venta
                        </v-card-title>

                        <v-card-text class="croll">
                            <div id="factura">
                                <header>
                                    <div id="logo">
                                        <img src="../assets/img/image.jpg" id="imagen">
                                    </div>
                                    <div id="datos">
                                        <p id="encabezado">
                                            <b>CRÉDITOS BRYAN</b>
                                            <br>AV. CAMILO PONCE Y 27 DE NOVIEMBRE,SAN LORENZO
                                            <br>0994943265 - 2781691<br>creditos_miriam@hotmail.com
                                        </p>
                                    </div>
                                    <div id="fact">
                                        <p>{{ tipo_comprobante }}<br>
                                            {{ serie_comprobante }}-{{ num_comprobante }}<br>
                                            {{ fecha }}</p>
                                    </div>
                                </header>
                                <br>
                                <section>
                                    <div>
                                        <table id="facliente">
                                            <tbody>
                                                <tr>
                                                    <td id="cliente">
                                                        <strong>Sr(a). {{ persona.nombre }}</strong><br>
                                                        <strong>Documento:</strong> {{ persona.num_documento }}<br>
                                                        <strong>Dirección:</strong> {{ persona.direccion }}<br>
                                                        <strong>Teléfono:</strong> {{ persona.telefono }}<br>
                                                        <strong>Email:</strong> {{ persona.email }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                                <br>
                                <section>
                                    <div>
                                        <table id="facarticulo">
                                            <thead>
                                                <tr id="fa">
                                                    <th>CANT</th>
                                                    <th>DESCRIPCION</th>
                                                    <th>PRECIO UNIT</th>
                                                    <th>DESC.</th>
                                                    <th>PRECIO TOTAL</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="det in detalles" :key="det._id">
                                                    <td style="text-align:center;">{{ det.cantidad }}</td>
                                                    <td style="text-align:center;">{{ det.nombre }}</td>
                                                    <td style="text-align:right;">{{ det.precio }}</td>
                                                    <td style="text-align:right;">{{ det.descuento }}</td>
                                                    <td style="text-align:right;">
                                                        {{ (det.cantidad * det.precio) - det.descuento }}</td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th style="text-align:right;">SUBTOTAL</th>
                                                    <th style="text-align:right;">$
                                                        {{ totalParcial = (total - totalImpuesto).toFixed(2) }}</th>
                                                </tr>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th style="text-align:right;">IVA({{ impuesto }}%)</th>
                                                    <th style="text-align:right;">$
                                                        {{
                                                            totalImpuesto = ((total * impuesto) / (1 +
                                                                impuesto)).toFixed(2)
                                                        }}
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th style="text-align:right;">TOTAL</th>
                                                    <th style="text-align:right;">$ {{ total = calcularTotal }}</th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </section>
                                <br>
                                <br>
                                <footer>
                                    <div id="gracias">
                                        <p><b>Gracias por su compra!</b></p>
                                    </div>
                                </footer>
                            </div>
                        </v-card-text>

                        <v-card-actions>
                            <v-btn @click="ocultarComprobante()" color="blue darken-1" flat>Cancelar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table :headers="headers" :items="ventas" :search="search" class="elevation-1" v-if="verNuevo == 0">
                <template v-slot:items="props">
                    <td class="justify-center layout px-0">
                        <v-icon small class="mr-2" @click="verIngreso(props.item)">
                            tab
                        </v-icon>
                        <v-icon small class="mr-2" @click="mostrarComprobante(props.item)">
                            print
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
                    <td>{{ props.item.user.nombre }}</td>
                    <td>{{ props.item.persona.nombre }}</td>
                    <td>{{ props.item.tipo_comprobante }}</td>
                    <td>{{ props.item.num_comprobante }}</td>
                    <td>{{ props.item.createdAt.substring(0, 10) }}</td>
                    <td>{{ props.item.impuesto }}</td>
                    <td>{{ props.item.total }}</td>
                   
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="listar()">Resetear</v-btn>
                </template>
            </v-data-table>
            <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
                <v-layout row wrap>
                    <v-flex xs12 sm6 md6 lg6 xl6>
                        <v-select v-model="tipo_comprobante" :items="comprobantes" label="Tipo Comprobante">
                        </v-select>
                        <p class="red--text" v-show="valida == 1">
                            {{ validation.firstError("tipo_comprobante") }}
                        </p>
                    </v-flex>

                    <v-flex xs12 sm6 md6 lg6 xl6>
                        <v-text-field v-model="num_comprobante" label="Número Comprobante">
                        </v-text-field>
                        <p class="red--text" v-show="valida == 1">
                            {{ validation.firstError("num_comprobante") }}
                        </p>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-autocomplete :items="personas" v-model="persona" label="Cliente">
                        </v-autocomplete>
                        <p class="red--text" v-show="valida == 1">
                            {{ validation.firstError("persona") }}
                        </p>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="impuesto" label="Impuesto">
                        </v-text-field>
                        <p class="red--text" v-show="valida == 1">
                            {{ validation.firstError("impuesto") }}
                        </p>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 x8>
                        <v-text-field v-model="codigo" label="Código" @keyup.enter="buscarCodigo()">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2>
                        <v-btn small fab dark color="teal" @click="mostrarModalArticulos()">
                            <v-icon dark>list</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2 v-show="errorArticulo">
                        <div class="red--text" v-text="errorArticulo">

                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <template>
                            <v-data-table :headers="cabeceraDetalles" :items="detalles" hide-actions
                                class="elevation-1">
                                <template slot="items" slot-scope="props">
                                    <td>
                                        <v-icon small class="mr-2" @click="eliminarDetalle(detalles, props.item)">
                                            delete
                                        </v-icon>
                                    </td>
                                    <td class="text-xs-center">{{ props.item.nombre }}</td>
                                    <td class="text-xs-center"><v-text-field v-model="props.item.cantidad"
                                            type="number"></v-text-field></td>
                                    <td class="text-xs-center"><v-text-field v-model="props.item.precio"
                                            type="number"></v-text-field></td>
                                    <td class="text-xs-center"><v-text-field v-model="props.item.descuento"
                                            type="number"></v-text-field></td>
                                    <td class="text-xs-right">$ {{ (props.item.cantidad *
                                        props.item.precio) - props.item.descuento
                                    }}</td>
                                </template>
                                <template slot="no-data">
                                    <h3>No hay artículos agregados al detalle.</h3>
                                </template>
                            </v-data-table>
                            <v-flex class="text-xs-right">
                                <strong>Total Parcial:</strong> $
                                {{ totalParcial = (total - totalImpuesto).toFixed(2) }}
                            </v-flex>
                            <v-flex class="text-xs-right">
                                <strong>Total Impuesto:</strong> $
                                {{ totalImpuesto = ((total * impuesto) / (1 + impuesto)).toFixed(2) }}
                            </v-flex>
                            <v-flex class="text-xs-right">
                                <strong>Total Neto:</strong> $ {{ total = calcularTotal }}
                            </v-flex>
                        </template>
                    </v-flex>
                    <v-flex xs12 sm12 md12 v-show="valida">
                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">

                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()">Cancelar</v-btn>
                        <v-btn color="success" v-if="verDetalle == 0" @click.native="guardar()">Guardar</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-flex>
    </v-layout>
</template>
<script>
import axios from 'axios'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
export default {
    data() {
        return {
            dialog: false,
            search: '',
            ventas: [],
            headers: [
                { text: 'Opciones', value: 'opciones', sortable: false },
                { text: 'Usuario', value: 'usuario.nombre', sortable: true },
                { text: 'Cliente', value: 'persona.nombre', sortable: true },
                { text: 'Tipo Comprobante', value: 'tipo_comprobante', sortable: true },
                { text: 'Num compro.', value: 'num_comprobante', sortable: false },
                { text: 'Fecha', value: 'createdAt', sortable: false },
                { text: 'Impuesto', value: 'impuesto', sortable: false },
                { text: 'Total', value: 'total', sortable: false },
            ],
            id: '',
            persona: '',
            personas: [],
            tipo_comprobante: '',
            comprobantes: ['BOLETA', 'FACTURA', 'TICKET', 'GUIA'],
            serie_comprobante: 10,
            num_comprobante: '',
            impuesto: 0.12,
            codigo: '',
            cabeceraDetalles: [
                { text: 'Borrar', value: 'borrar', sortable: false },
                { text: 'Artículo', value: 'articulo', sortable: false },
                { text: 'Cantidad', value: 'cantidad', sortable: false },
                { text: 'Precio', value: 'precio', sortable: false },
                { text: 'Descuento', value: 'descuento', sortable: false },
                { text: 'Sub Total', value: 'subtotal', sortable: false }
            ],
            detalles: [],
            verNuevo: 0,
            errorArticulo: null,
            total: 0,
            totalParcial: 0,
            totalImpuesto: 0,
            articulos: [],
            texto: '',
            cabeceraArticulos: [
                { text: 'Seleccionar', value: 'seleccionar', sortable: false },
                { text: 'Código', value: 'codigo', sortable: false },
                { text: 'Nombre', value: 'nombre', sortable: true },
                { text: 'Categoría', value: 'categoria.nombre', sortable: true },
                { text: 'Stock', value: 'stock', sortable: false },
                { text: 'Precio Venta', value: 'precio_venta', sortable: false },
                { text: 'Descripción', value: 'descripcion', sortable: false },
            ],
            verDetalle: 0,
            valida: 0,
            validaMensaje: [],
            adModal: 0,
            adAccion: 0,
            adNombre: '',
            adId: '',
            comprobanteModal: 0,
            fecha: null,
            adModal2: false
        }
    },
    computed: {
        calcularTotal: function () {
            let resultado = 0.0;
            for (var i = 0; i < this.detalles.length; i++) {
                resultado = resultado + ((this.detalles[i].cantidad * this.detalles[i].precio) - this.detalles[i].descuento);
            }
            return resultado;
        }
    },
    validators: { //area
        tipo_comprobante: function (value) {
            return this.$validator
                .value(value)
                .required()
        },
        num_comprobante: function (value) {
            return this.$validator
                .value(value)
                .required()
                .float()
        },
        persona: function (value) {
            return this.$validator
                .value(value)
                .required()
        },
        impuesto: function (value) {
            return this.$validator
                .value(value)
                .required()
                .float()
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
        this.selectPersona();
    },
    methods: {
        async emitir(obj) {
            console.log(obj);

        },
        listarProductosDetalles(id) {
            let me = this;
            let configuracion = { headers: {'x-access-token': this.$store.state.token, 'options': 'Agrego Venta'} };
            axios.get('venta/queryDetalles?id=' + id, configuracion).then(function (response) {
                me.detalles = response.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        crearPDF() {
            var quotes = document.getElementById('factura');
            html2canvas(quotes).then(function (canvas) {
                var imgData = canvas.toDataURL('image/png');
                var imgWidth = 210;
                var pageHeight = 295;

                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;

                var doc = new jsPDF('p', 'mm', 'a4');
                var position = 0;

                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                doc.save('ComprobanteVenta.pdf');
            });
        },
        mostrarComprobante(item) {
            console.log(item);
            this.limpiar();
            this.tipo_comprobante = item.tipo_comprobante;
            this.serie_comprobante = item.serie_comprobante;
            this.num_comprobante = item.num_comprobante;
            this.fecha = item.createdAt;
            this.persona = item.persona;
            this.impuesto = item.impuesto;
            this.listarDetalles(item.id);
            this.comprobanteModal = 1;
        },
        ocultarComprobante() {
            this.comprobanteModal = 0;
        },
        selectPersona() {
            let me = this;
            let personaArray = [];
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('persona/listClientes', configuracion).then(function (response) {
                personaArray = response.data;
                personaArray.map(function (x) {
                    me.personas.push({ text: x.nombre, value: x.id });
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        buscarCodigo() {
            let me = this;
            me.errorArticulo = null;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('articulo/queryCodigo?codigo=' + this.codigo, configuracion).then(function (response) {
                me.agregarDetalle(response.data);
            }).catch(function (error) {
                me.errorArticulo = 'No existe el artículo.';
            });

        },
        agregarDetalle(data) {
            this.errorArticulo = null;
            if (this.encuentra(data.id) == true) {
                this.errorArticulo = 'El artículo ya ha sido agregado.';
            }
            else {
                this.detalles.push(
                    {
                        articuloId: data.id,
                        nombre: data.nombre,
                        cantidad: 1,
                        precio: data.precio_venta,
                        descuento: 0
                    }
                );
                this.codigo = '';
            }

        },
        encuentra(id) {
            let sw = 0;
            for (var i = 0; i < this.detalles.length; i++) {
                if (this.detalles[i].id == id) {
                    sw = true;
                }
            }
            return sw;
        },
        eliminarDetalle(arr, item) {
            let i = arr.indexOf(item);
            if (i != -1) {
                arr.splice(i, 1);
            }
        },
        listarArticulos() {
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('articulo/listName?nombre=' + this.texto, configuracion).then(function (response) {
                me.articulos = response.data;
                console.log(me.articulos);
            }).catch(function (error) {
                console.log(error);
            });
        },
        mostrarModalArticulos() {
            this.dialog = 1;
        },
        listarDetalles(id) {
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('venta/queryDetalles?id=' + id, configuracion).then(function (response) {
                me.detalles = response.data;
                console.log(me.detalles);
            }).catch(function (error) {
                console.log(error);
            });
        },
        verIngreso(item) {
            this.limpiar();
            this.tipo_comprobante = item.tipo_comprobante;
            this.serie_comprobante = item.serie_comprobante;
            this.num_comprobante = item.num_comprobante;
            this.persona = item.persona.id;
            this.impuesto = item.impuesto;
            this.listarDetalles(item.id);
            this.verNuevo = 1;
            this.verDetalle = 1;
        },
        listar() {
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('venta/list', configuracion).then(function (response) {
                me.ventas = response.data;
            }).catch(function (error) {
                console.log(error);
            });

        },
        limpiar() {
            this.id = '';
            this.tipo_comprobante = '';
            this.serie_comprobante = '';
            this.num_comprobante = '';
            this.impuesto = 0.12;
            this.codigo = '';
            this.total = 0;
            this.totalParcial = 0;
            this.totalImpuesto = 0;
            this.detalles = [];
            this.verNuevo = 0;
            this.valida = 0;
            this.validaMensaje = [];
            this.verDetalle = 0;
        },

        mostrarNuevo() {
            this.verNuevo = 1;
        },
        ocultarNuevo() {
            this.verNuevo = 0;
            this.limpiar();
        },
        guardar() {
            let me = this;
            let configuracion = { headers: {'x-access-token': this.$store.state.token, 'options': 'Agrego Venta'} };
            if (this.detalles.length == 0) {
                alert('Ingrese al menos un artículo al detalle');
                return;
            }
            this.$validate().then(success => {
                if (!success) {
                    this.valida = 1;
                    return;
                }
                axios.post('venta/add',
                {
                    'personaId': this.persona,
                    'userId': this.$store.state.usuario.id,
                    'tipo_comprobante': this.tipo_comprobante,
                    'serie_comprobante': this.serie_comprobante,
                    'num_comprobante': this.num_comprobante,
                    'impuesto': this.impuesto,
                    'total': this.total,
                    'detalles': this.detalles
                }, configuracion)
                .then(function (response) {
                    me.limpiar();
                    me.close();
                    me.listar();
                })
                .catch(function (error) {
                    console.log(error);
                });
            });
           
        },
        activarDesactivarMostrar(accion, item) {
            this.adModal = 1;
            this.adNombre = item.num_comprobante;
            this.adId = item.id;
            if (accion == 1) {
                this.adAccion = 1;
            } else if (accion == 2) {
                this.adAccion = 2;
            } else {
                this.adModal = 0;
            }
        },
        activarDesactivarCerrar() {
            this.adModal = 0;
        },
        activar() {
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.put('venta/activate', { 'id': this.adId }, configuracion)
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
            axios.put('venta/deactivate', { 'id': this.adId }, configuracion)
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
        },
        EliminarMostrar(item) {
            this.adModal2 = true;
            this.adNombre = item.nombre;
            this.adId = item.id;

        },
        remove() {
            let me = this;
            let configuracion = { headers: {'x-access-token': this.$store.state.token, 'options': 'Elimino Venta'} };
            axios.delete(`venta/remove/${this.adId}`,  configuracion)
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
    }
}
</script>
<style>
#factura {
    padding: 20px;
    font-family: Arial, sans-serif;
    font-size: 16px;
}

#logo {
    float: left;
    margin-left: 2%;
    margin-right: 2%;
}

#imagen {
    width: 100px;
}

#fact {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}

#datos {
    float: left;
    margin-top: 0%;
    margin-left: 2%;
    margin-right: 2%;
    /*text-align: justify;*/
}

#encabezado {
    text-align: center;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 16px;
}

section {
    clear: left;
}

#cliente {
    text-align: left;
}

#facliente {
    width: 40%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: 15px;
}

#fa {
    color: #FFFFFF;
    font-size: 14px;
}

#facarticulo {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    padding: 20px;
    margin-bottom: 15px;
}

#facarticulo thead {
    padding: 20px;
    background: #2183E3;
    text-align: center;
    border-bottom: 1px solid #FFFFFF;
}

#gracias {
    text-align: center;
}
</style>
