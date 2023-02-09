<template>
    <v-layout align-start>
        <v-flex>
            <v-container grid-list-sm class="white">
                <v-layout row wrap>
                    <v-flex xs12 sm4 md4 lg4 x4>
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
                    <v-flex xs12 sm4 md4 lg4 x4>
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
                    <v-flex xs12 sm4 md4 lg4 x4>
                        <div v-if="ifLoads">load...</div>
                        <v-select v-else v-on:change="oncChange" v-model="categoria" :items="categorias"
                            label="Articulos">
                        </v-select>
                    </v-flex>

                </v-layout>
                <div style="overflow-x:auto;">
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Detalle</th>
                                <th></th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                                <th></th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                                <th></th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="active-row" v-for="(item) in inventario" :key="item.id">
                                <td>{{ item.fecha.substring(0, 10) }}</td>
                                <td>{{ item.detalle }}</td>
                                <td> <b> |</b> </td>
                                <td> <span v-if="item.estado == '0'"> {{ item.cantidad }}</span></td>
                                <td> <span v-if="item.estado == '0'">{{ item.precio }}</span> </td>
                                <td> <span v-if="item.estado == '0'">{{ item.total }}</span> </td>
                                <td> <b> |</b> </td>
                                <td> <span v-if="item.estado == '1'">{{ item.cantidad }}</span> </td>
                                <td><span v-if="item.estado == '1'">{{ item.precio }}</span> </td>
                                <td> <span v-if="item.estado == '1'">{{ item.total }}</span> </td>
                                <td> <b> |</b> </td>
                                
                                <td> 
                                    <span> {{ item.saldoCantidad }}</span>
                                </td>
                                <td> <span>{{ item.precio }}</span> </td>
                                <td> <span>{{ item.saldoTotal }}</span> </td>
                            </tr>

                            <!-- and so on... -->
                        </tbody>
                    </table>
                </div>

            </v-container>

        </v-flex>
    </v-layout>
</template>
<style>
.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    width: 100%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.styled-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
}

.styled-table th,
.styled-table td {
    padding: 12px 15px;
}

.styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}

.styled-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
}
</style>
<script>
import axios from 'axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
export default {
    name: 'Consultas',
    data() {
        return {
            inventario: [],
            inventario2: [],
            search: '',
            date: '',
            date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            modal: false,
            modal2: false,

            detalles: [],
            comprobanteModal: 0,
            total: 0,
            totalVenta: 0,
            categorias: [],
            ifLoads: false,
            categoria: '',
            search: '',
            sto: '',
        }
    },

    methods: {
        selectArticulo() {
            let me = this;
            this.ifLoads = true;
            let categoriaArray = [];
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('articulo/list', configuracion).then(function (response) {
                categoriaArray = response.data;
                categoriaArray.map(function (x) {
                    me.categorias.push({ text: x.nombre, value: x.id, stock: x.stock });
                    me.ifLoads = false;
                });
            }).catch(function (error) {
                console.log(error);
                this.ifLoads = false;
            });
        },
        oncChange(a) {
            const result = this.categorias.filter(x => x.value == a);
            this.sto = '';
            if (result[0].text != '' && this.date != '') {
                this.search = result[0].text;
                this.sto = result[0].stock;
                this.buscarCodigo();

            } else {
                alert('error')
            }
        },
        buscarCodigo() {
            let me = this;
            let header = { "Token": this.$store.state.token };
            let configuracion = { headers: header };
            axios.get('ingreso/consultaFechas?start=' + this.date + '&end=' + this.date2, configuracion).then(function (response) {
                me.algotirmoJhoin(response.data)

            }).catch(function (error) {
                console.log(error);
            });
        },
        algotirmoJhoin(obj) {
            try {
            let precioInventarioInicial = 0;
            let cantidadInventarioInicial = 0;
            for (let i = 0; i < obj.ingresoInicial.length; i++) {
                let detalles = obj.ingresoInicial[i].detallemovs;
                for (let j = 0; j < detalles.length; j++) {
                    let items = detalles[j]
                    if (items.nombre == this.search) {
                        precioInventarioInicial = items.precio;
                        cantidadInventarioInicial = cantidadInventarioInicial + parseInt(items.cantidad)
                    }
                }
            }
            let cantidadComprasInicial = 0;
            for (let i = 0; i < obj.ventaInicial.length; i++) {
                let detalles = obj.ventaInicial[i].detalles;
                for (let j = 0; j < detalles.length; j++) {
                    let items = detalles[j]
                    if (items.nombre == this.search) {
                        cantidadComprasInicial = cantidadComprasInicial + parseInt(items.cantidad)
                    }
                }
            }
            let stokInicial = cantidadInventarioInicial - cantidadComprasInicial
            this.inventarioInit = stokInicial;
            let precioTotalInicial = (stokInicial * precioInventarioInicial).toFixed(2)
            const inventarioInicial = [{
                nombre: 'mi nombre',
                cantidad: stokInicial,
                precio: precioInventarioInicial,
                total: precioTotalInicial,
                estado: '2',
                fecha: '2023-01-01 19:59:43.425-05',
                detalle: 'INVENTARIO INICIAL',
                saldoCantidad : stokInicial,
                saldoTotal : precioTotalInicial,
            }]

            //----------------RANGOS DE FECHAS A CONSULTAR -------------------------------'Venta'
            let ventas = obj.ventas
            let ingresos = obj.ingresos
            this.inventario = []
            const compras = []
            const venta = []
            for (let i = 0; i < ingresos.length; i++) {
                let detalles = ingresos[i].detallemovs;
                let fecha = ingresos[i].updatedAt
                for (let j = 0; j < detalles.length; j++) {
                    let items = detalles[j]
                    if (items.nombre == this.search) {
                        let res = parseInt(items.cantidad) * parseFloat(items.precio)
                        let total = res.toFixed(2)
                        compras.push({
                            nombre: items.nombre,
                            cantidad: items.cantidad,
                            precio: items.precio,
                            total: total,
                            estado: '0',
                            fecha: fecha,
                            detalle: 'Compra',
                            saldoCantidad : 0,
                            saldoTotal : 0,
                        })

                    }
                }
            }
            for (let i = 0; i < ventas.length; i++) {
                let detalles = ventas[i].detalles;
                let fecha = ventas[i].updatedAt
                for (let j = 0; j < detalles.length; j++) {
                    let items = detalles[j]
                    if (items.nombre == this.search) {
                        let res = parseInt(items.cantidad) * parseFloat(items.precio)
                        let total = res.toFixed(2)
                        venta.push({
                            nombre: items.nombre,
                            cantidad: items.cantidad,
                            precio: items.precio,
                            total: total,
                            estado: '1',
                            fecha: fecha,
                            detalle: 'Venta',
                            saldoCantidad : 0,
                            saldoTotal : 0,
                        })
                    }
                }
            }
            const arr3 = [...compras, ...venta, ...inventarioInicial];
            function sortFunction(a, b) {
                var dateA = new Date(a.fecha).getTime();
                var dateB = new Date(b.fecha).getTime();
                return dateA > dateB ? 1 : -1;
            };
            arr3.sort(sortFunction)
            let aux = stokInicial
            for (let i = 0; i < arr3.length; i++) {
                const element = arr3[i];
                if (element.estado == '0') {
                    aux = aux + element.cantidad
                    element.saldoCantidad = aux
                    element.saldoTotal = (aux * parseInt(element.precio) ).toFixed(2)
                }
                if (element.estado == '1') {
                    aux = aux - element.cantidad
                    element.saldoCantidad = aux
                    element.saldoTotal = (aux * parseInt(element.precio)).toFixed(2)
                }
            }
            this.inventario = arr3
            } catch (error) {
                console.log(error)
            }
         
        },

        listarDetalles(item) {
            this.detalles = item.detalles;
        },
        mostrarComprobante(item) {
            this.limpiar();

            this.fecha = item.createdAt;
            this.persona = item.persona;
            this.impuesto = item.impuesto;
            this.listarDetalles(item);
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
    },
    created() {
        this.selectArticulo()
    }
}
</script>
