<template>
    <v-layout align-start>
        <v-flex>
            <v-container grid-list-sm class="white">
                <v-layout row wrap>
                    <v-flex xs12 sm5 md5 lg5 x5>
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="date" label="Fecha inicio" prepend-icon="mdi-calendar" readonly
                                    v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="date" scrollable locale="es">
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">
                                    Cancelar
                                </v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(date)">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-flex>
                    <v-flex xs12 sm5 md5 lg5 x5>
                        <v-dialog ref="dialog1" v-model="modal2" :return-value.sync="date2" persistent width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="date2" label="Fecha final" prepend-icon="mdi-calendar" readonly
                                    v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="date2" scrollable locale="es">
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal2 = false">
                                    Cancelar
                                </v-btn>
                                <v-btn text color="primary" @click="$refs.dialog1.save(date2)">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 x2>
                        <v-btn color="success" @click="buscarCodigo()">Cargar</v-btn>

                    </v-flex>
                </v-layout>
                <v-btn @click="crearPDF()">
                    <v-icon>print</v-icon>
                </v-btn>
                Suma total de ventas en corte : $ {{totalVenta = ventasTotal}}
                <v-data-table :headers="headers" :items="ventas" :search="search">
                    <template v-slot:items="props">
                        <td class="justify-center layout px-0">
                            <svg style="color: #000;margin-top: 15px;cursor: pointer;"  @click="mostrarComprobante(props.item)" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                viewBox="0 0 24 24" width="24" >
                                <path d="M8 6h13"></path>
                                <path d="M8 12h13"></path>
                                <path d="M8 18h13"></path>
                                <path d="M3 6h.01"></path>
                                <path d="M3 12h.01"></path>
                                <path d="M3 18h.01"></path>
                            </svg>
                           
                        </td>
                        <td>{{ props.item.user.nombre }}</td>
                        <td>{{ props.item.persona.nombre }}</td>
                        <td>{{ props.item.tipo_comprobante }}</td>
                        <td>{{ props.item.createdAt }}</td>
                        <td>{{ props.item.impuesto }}</td>
                        <td>{{ props.item.total }}</td>

                    </template>
                    <template v-slot:no-data>
                        <v-btn color="primary">Resetear</v-btn>
                    </template>
                </v-data-table>
            </v-container>

        </v-flex>
        <v-dialog v-model="comprobanteModal" max-width="1000px">
            <v-card>
                <v-card-title class="headline">
                    Detalles de venta
                </v-card-title>

                <v-card-text>
                    <div id="factura">

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
                                            <td>{{ det.articulo }}</td>
                                            <td style="text-align:center;">{{ det.precio }}</td>
                                            <td style="text-align:center;">{{ det.descuento }}</td>
                                            <td style="text-align:center;">{{ (det.cantidad * det.precio) - det.descuento }}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>

                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th style="text-align:right;">TOTAL</th>
                                            <th style="text-align:right;">$ {{total=calcularTotal}}</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </section>
                        <br>
                        <br>

                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-btn @click="ocultarComprobante()" color="blue darken-1" flat>Cancelar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import axios from 'axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
export default {
    name: 'Consultas',
    data() {
        return {
            ventas: [],
            search: '',
            date: '',
            date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            modal: false,
            modal2: false,
            headers: [
                { text: 'Opciones', value: 'opciones', sortable: false },
                { text: 'Usuario', value: 'user.nombre', sortable: true },
                { text: 'Cliente', value: 'persona.nombre', sortable: true },
                { text: 'Tipo Comprobante', value: 'tipo_comprobante', sortable: true },
                { text: 'Fecha', value: 'createdAt', sortable: false },
                { text: 'Impuesto', value: 'impuesto', sortable: false },
                { text: 'Total', value: 'total', sortable: false },
            ],
            detalles: [],
            comprobanteModal: 0,
            total:0,
            totalVenta : 0,
        }
    },
    computed: {
            calcularTotal: function(){
                let resultado=0.0;
                for(var i=0;i<this.detalles.length;i++){
                    resultado=resultado+((this.detalles[i].cantidad*this.detalles[i].precio)-this.detalles[i].descuento);
                }
                return resultado;
            }, ventasTotal: function(){
                let resultado=0.0;
                for(var i=0;i<this.ventas.length;i++){
                    resultado=resultado+ parseInt(this.ventas[i].total);
                }
                return resultado;
            }
        },
    methods: {
        buscarCodigo() {
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('venta/consultaFechas?start=' + this.date + '&end=' + this.date2, configuracion).then(function (response) {
               
                me.ventas = response.data;
                 console.log(me.ventas);
            }).catch(function (error) {
                console.log(error);
            });

        },
        crearPDF() {
            var columns = [
                { title: "Responsable", dataKey: "responsable" },
                { title: "Cliente", dataKey: "cliente" },
                { title: "Comprobante", dataKey: "comprobante" },
                { title: "Total", dataKey: "total" }
            ];
            var rows = [];

            this.ventas.map(function (x) {
                rows.push(
                    {
                        responsable: x.user.nombre,
                        cliente: x.persona.nombre,
                        comprobante: x.tipo_comprobante,
                        total: x.total
                    }
                );
            });
            var doc = new jsPDF('p', 'pt');
            let total = this.totalVenta
            let start = this.date
            let end = this.date2
            doc.autoTable(columns, rows, {
                margin: { top: 120 },
                addPageContent: function (data) {
                    doc.text("Reporte de ventas", 250, 30);
                    doc.text("Fecha inicio : " + start, 40, 60);
                    doc.text("Fecha final  : " + end, 40, 85);
                    doc.text("Total ventas : $" + total, 40, 110);
                }
            });

            doc.save('corte' + this.date + this.date2 + '.pdf');
        },
        listarDetalles(id) {
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('venta/query?_id=' + id, configuracion).then(function (response) {
                me.detalles = response.data.detalles;
            }).catch(function (error) {
                console.log(error);
            });
        },
        mostrarComprobante(item) {
            this.limpiar();

            this.fecha = item.createdAt;
            this.persona = item.persona;
            this.impuesto = item.impuesto;
            this.listarDetalles(item._id);
            this.comprobanteModal = 1;
        },
        ocultarComprobante() {
            this.comprobanteModal = 0;
        },
        limpiar() {
            this._id = '';
            this.impuesto = 0.12;
            this.total = 0;
            this.detalles = [];
        },
    }
}
</script>
