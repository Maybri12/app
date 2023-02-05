<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Cambiar Contraseña</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                        <span class="headline">CAMBIAR CONTRASEÑA</span>
                        </v-card-title>            
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="password" type="password" color="accent" label="Contraseña" required>
                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="copassword" type="password" color="accent" label="Confirmar Contraseña" required>
                    </v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        </v-card-text>            
                        <v-card-actions  >
                            <p class="purple--text" v-if="mensaje">{{ mensaje }}</p>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat >Cancelar</v-btn>
                        <v-btn color="blue darken-1" v-if="((password ==copassword))" flat @click="reset">
                            Guardar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>

        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios'
    export default {
        data(){
            return{
               
                menu: false,
                search:'',
                categorias:[],
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Nombre', value: 'nombre', sortable: true },
                    { text: 'Descripción', value: 'descripcion', sortable: false },
                    { text: 'Estado', value: 'estado', sortable: false },
                ],
                editedIndex: -1,
                _id:'',
                nombre:'',
                descripcion:'',
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:'',
                password : '',
                copassword : '',
                mensaje: '',
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            this.inicio()
        },
        methods: {
            inicio (){
                const seccio = JSON.parse(localStorage.getItem("Xf")); 
                console.log(seccio);
                this.email = seccio.email;
                console.log('correo',this.email);
            },

            limpiar(){
                this._id='';
                this.nombre='';
                this.descripcion='';
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
            },


            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.nombre;
                this.adId=item._id;
                if (accion==1){
                    this.adAccion=1;
                } else if(accion==2){
                    this.adAccion=2;
                } else{
                    this.adModal=0;
                }
            },
            activarDesactivarCerrar(){
                this.adModal=0;
            },


            close () {
                this.dialog = false;
            },
            reset(){
                let me = this
            axios.post('auth/rest',{email: this.email,password : this.password})
            .then(respuesta =>{
                me.mensaje = 'CAMBIO EXITOSO'
                me.dialog = false;
                return respuesta.data;
                
            })
            .then(data =>{
                this.isLogued=1;
                this.email = '';
            })
            .catch(error =>{
                this.errorM=null;
                if (error.response.status==404){
                    this.errorR='No existe el usuario.';
                } else{
                    this.errorR='Ocurrió un error con el servidor.';
                }
            });
        }
        }
    }
</script>
