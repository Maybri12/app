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
                          <v-select v-else v-on:change="oncChange" v-model="categoria"
                                        :items="categorias"
                                        label="Articulos">
                         </v-select>
                    </v-flex>
                   
                </v-layout>
                <v-btn @click="crearPDF()">
                    <v-icon>print</v-icon>
                </v-btn>
                
                <v-data-table :headers="headers" :items="inventario" :search="search">
                    <template v-slot:items="props">
                       
                        <td>{{ props.item.nombre }}</td>
                        <td>{{ props.item.cantidad  }}</td>
                        <td>{{ props.item.entradas  }}</td>
                        <td>{{ props.item.strok  }}</td>

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

                                            <th>PRECIO TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(det, sum) in detalles" :key="det._id">
                                            <td style="text-align:center;">{{ det.cantidad }}</td>
                                            <td style="text-align:center;">{{ det.articulo }}</td>
                                            <td style="text-align:center;">{{ det.precio }}</td>

                                            <td style="text-align:center;">{{ sum = det.cantidad * det.precio }}
                                            </td>
                                        </tr>
                                    </tbody>

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
            inventario: [],
            search: '',
            date: '',
            date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            modal: false,
            modal2: false,
            headers: [
                { text: 'Articulo', value: 'nombre', sortable: true },
                { text: 'Salidas', value: 'persona.nombre', sortable: true },
                { text: 'Entradas', value: 'tipo_comprobante', sortable: true },
                { text: 'Existencia', value: 'createdAt', sortable: false },,
            ],
            detalles: [],
            comprobanteModal: 0,
            total: 0,
            totalVenta: 0,
            categorias: [],
            ifLoads: false,
            categoria: '',
            search:'',
            sto: '',
        }
    },
    computed: {
        calcularTotal: function () {
            let resultado = 0.0;
            for (var i = 0; i < this.detalles.length; i++) {
                resultado = resultado + ((this.detalles[i].cantidad * this.detalles[i].precio) - this.detalles[i].descuento);
            }
            return resultado;
        }, ventasTotal: function () {
            let resultado = 0.0;
            for (var i = 0; i < this.ventas.length; i++) {
                resultado = resultado + ((this.ventas[i].total));
            }
            return resultado;
        }
    },
    methods: {
            selectArticulo(){
                let me=this;
                this.ifLoads = true;
                let categoriaArray=[];
                let header={"Token" : this.$store.state.token};
                let configuracion= {headers : header};            
                axios.get('articulo/list',configuracion).then(function (response){
                    categoriaArray=response.data;
                    console.log(categoriaArray);
                    categoriaArray.map(function(x){
                        me.categorias.push({text:x.nombre, value:x.id, stock:x.stock});
                        
                        me.ifLoads = false;
                    });
                }).catch(function(error){
                    console.log(error);
                    this.ifLoads = false;
                });
            },
             oncChange(a) {
                const result = this.categorias.filter(x => x.value == a);
                this.sto = '';
                console.log(result);
                if (result[0].text!= ''&& this.date!='') {
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
                console.log(response.data);
                me.algotirmoJhoin(response.data)
            }).catch(function (error) {
                console.log(error);
            });
        },
        algotirmoJhoin(obj) {
            let ventas = obj.ventas
            let ingresos = obj.ingresos
            let cantidad = 0
            let entradas = 0;
            this.inventario = []
            let nombre = ''
             for (let i = 0; i < ingresos.length; i++) {
                let detalles = ingresos[i].detallemovs
                for (let j = 0; j < detalles.length; j++) {
                    let items = detalles[j]
                    if (items.nombre == this.search) {
                        entradas = items.cantidad;
                       
                    }  
                }
            }
            for (let i = 0; i < ventas.length; i++) {
                let detalles = ventas[i].detalles
                for (let j = 0; j < detalles.length; j++) {
                    let items = detalles[j]
                    if (items.nombre == this.search) {
                        nombre = items.nombre;
                        cantidad = cantidad + items.cantidad
                    }  
                }
            }
            let isAdd = this.inventario.filter(x => x.nombre == nombre)
            if (isAdd.length == 0) {
                this.inventario.push({ nombre: nombre, cantidad: cantidad, strok:this.sto, entradas:entradas })
            }
            console.log(this.inventario)
        },
        crearPDF() {
            var columns = [
                { title: "Articulo", dataKey: "nombre" },
                { title: "Entrada", dataKey: "entradas" },
                { title: "Salida", dataKey: "cantidad" },
                { title: "Existencia", dataKey: "strok" },
                
            ];
            var rows = [];
            this.inventario.map(function (x) {
                rows.push(
                    {
                        nombre: x.nombre,
                        entradas: x.entradas,
                        cantidad: x.cantidad,
                        strok: x.strok,
                       
                    }
                );
            });
            var doc = new jsPDF('p', 'pt');
            let start = this.date
            let end = this.date2
            doc.autoTable(columns, rows, {
                margin: { top: 120 },
                addPageContent: function (data) {
                    doc.text("Reporte de inventario", 250, 30);
                    doc.text("Fecha inicio : " + start, 40, 60);
                    doc.text("Fecha final  : " + end, 40, 85);
                }
            });
            doc.save('corte' + this.date + this.date2 + '.pdf');
        },
        listarDetalles(item) {
            this.detalles = item.detalles;
            console.log(this.detalles);
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
    created(){
        this.selectArticulo()
    }
}
</script>