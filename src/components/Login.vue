<template>
    <v-layout align-center justify-center>
        <v-flex v-if="isLogued" xs12 sm8 md6 lg5 xl4 >
            <v-card>
                <v-toolbar style=" color: #000" color="darken-3">
                    <v-toolbar-title>
                        Acceso al Sistema
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-text-field v-model="email" autofocus color="accent" label="Correo electrónico" required>
                    </v-text-field>
                    <v-text-field v-model="password" type="password" color="accent" label="Contraseña" required>
                    </v-text-field>
                    <v-flex class="red--text" v-if="errorM">
                        {{errorM}}
                    </v-flex>
                </v-card-text>
                <v-card-actions class="px-3 pb-3">
                    <v-flex text-xs-right>
                          <v-btn color="blue darken-2" flat @click="isLogued=0">Olvide mi contraseña</v-btn>
                        <v-btn @click="ingresar()" color="primary">Ingresar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-flex>
         <v-flex v-else xs12 sm8 md6 lg5 xl4 >
            <v-card>
                <v-toolbar   style=" color: #000" color="darken-3">
                    <v-toolbar-title>
                       Recuperar contraseña
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-text-field v-model="email2" autofocus color="accent" label="Correo electrónico" required>
                    </v-text-field>
                    <v-flex class="red--text" v-if="errorR">
                        {{errorR}}
                    </v-flex>
                </v-card-text>
                <v-card-actions class="px-3 pb-3">
                    <v-flex text-xs-right>
                        <v-btn color="blue darken-1" flat @click="isLogued=1">Iniciar sesión</v-btn>
                        <v-btn @click="reset()" color="primary">Recuperar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
import axios from 'axios';
export default {
    data (){
        return{
            email:'',
            password:'',
            errorM:null,
            isLogued: 1,
            email2:'',
            errorR : null,
        }
    },
    methods:{
        ingresar(){
            axios.post('auth/signin',{email: this.email, password: this.password})
            .then(respuesta =>{
                return respuesta.data;
            })
            .then(data =>{
                this.$store.dispatch("guardarToken",data.tokenReturn);
                this.$router.push({name: 'home'});
            })
            .catch(error =>{
                //console.log(eror);
                this.errorM=null;
                if (error.response.status==404){
                    this.errorM='No existe el usuario o las credenciales son incorrectas.';
                } else{
                    this.errorM='Ocurrió un error con el servidor.';
                }
            });
        },
        reset(){
            axios.post('usuario/reset',{email: this.email2})
            .then(respuesta =>{
                return respuesta.data;
            })
            .then(data =>{
                this.isLogued=1;
                this.email2 = '';
                console.log(data);
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

