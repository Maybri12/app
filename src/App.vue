<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
      v-if="logueado"
    >
      <v-list dense>
        <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-tile :to="{name:'home'}">
            <v-list-tile-action>
               <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19" ><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><path d="M9 22V12h6v10"></path></svg>
            </v-list-tile-action>
           
            <v-list-tile-title>
              Inicio
            </v-list-tile-title>
          </v-list-tile>
        </template> 
        <template v-if="esAdministrador || esAlmacenero">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  Almacén
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'categoria'}">
              <v-list-tile-action>
                <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><path d="M12 3h7a2 2 0 012 2v14a2 2 0 01-2 2h-7m0-18H5a2 2 0 00-2 2v14a2 2 0 002 2h7m0-18v18"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Categorías
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile :to="{name: 'marca'}">
              <v-list-tile-action>
                <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><path d="M12 3h7a2 2 0 012 2v14a2 2 0 01-2 2h-7m0-18H5a2 2 0 00-2 2v14a2 2 0 002 2h7m0-18v18"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                 Marcas
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'ubicacion'}">
              <v-list-tile-action>
                <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><path d="M12 3h7a2 2 0 012 2v14a2 2 0 01-2 2h-7m0-18H5a2 2 0 00-2 2v14a2 2 0 002 2h7m0-18v18"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                 Ubicación
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'articulo'}">
              <v-list-tile-action>
               <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 01-8 0"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Productos
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esAlmacenero">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  Inventario
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'ingreso'}">
              <v-list-tile-action>
               <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><path d="M19 4h-9"></path><path d="M14 20H5"></path><path d="M15 4L9 20"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Movimientos
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile :to="{name: 'empresas'}">
              <v-list-tile-action>
               <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><circle cx="12" cy="12" r="4"></circle><path d="M1.05 12H7"></path><path d="M17.01 12h5.95"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                Importadora
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'proveedor'}">
              <v-list-tile-action>
               <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><circle cx="12" cy="12" r="4"></circle><path d="M1.05 12H7"></path><path d="M17.01 12h5.95"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Proveedores
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
           

          </v-list-group>
        </template>
        <template v-if="esAdministrador || esVendedor">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  Ventas
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'venta'}">
              <v-list-tile-action>
                <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19" ><path d="M12 1v22"></path><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Ventas
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'cliente'}">
              <v-list-tile-action>
                <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19" ><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Clientes
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  Accesos
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'usuario'}">
              <v-list-tile-action>
              <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M20 8v6"></path><path d="M23 11h-6"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Usuarios
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  Reportes
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'consultas'}">
              <v-list-tile-action>
                 <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><path d="M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z"></path><path d="M16 16l4.5 4.5"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Reporte Ventas
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'entradas'}">
              <v-list-tile-action>
                 <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><path d="M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z"></path><path d="M16 16l4.5 4.5"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Reporte Compras
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'consultasIngreso'}">
              <v-list-tile-action>
               <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><path d="M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z"></path><path d="M16 16l4.5 4.5"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Reporte Inventario
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>   
        <template v-if="esAdministrador || esAlmacenero ">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                 Kardex
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'kardex'}">
              <v-list-tile-action>
               <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><circle cx="12" cy="12" r="4"></circle><path d="M1.05 12H7"></path><path d="M17.01 12h5.95"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Kardex 
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
           
          </v-list-group>
        </template> 
          <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  Configuración
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'material'}">
              <v-list-tile-action>
               <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><circle cx="12" cy="12" r="4"></circle><path d="M1.05 12H7"></path><path d="M17.01 12h5.95"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Configura
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
           
          </v-list-group>
        </template>   
        <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  Módulo auditoria
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{name: 'auditoria'}">
              <v-list-tile-action>
               <svg data-testid="geist-icon" fill="none" height="19" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="19"><circle cx="12" cy="12" r="4"></circle><path d="M1.05 12H7"></path><path d="M17.01 12h5.95"></path></svg>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Auditorias
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
           
          </v-list-group>
        </template> 
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color=" darken-3" 
      style="    background: #fff;"
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title style="width: 250px;  " class="ml-0 ">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">CREDITOS BRIAN </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="salir()" style="color:#e5322d" icon v-if="logueado">
        <v-icon>logout</v-icon> Salir
      </v-btn>
      <v-btn :to="{name: 'login'}" icon v-else>
        <v-icon>apps</v-icon> Login
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in" >
          <router-view/>
        </v-slide-y-transition>
      </v-container>
    </v-content>

    <!-- <v-footer dark height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat tile color="primary" class="white--text">
            <v-card-text class="white--text pt-0">
              Rivatex &copy;2022
            </v-card-text>
          </v-card>
        </v-flex>
    </v-layout>

    </v-footer> -->

  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      drawer: true,
    }
  },
  computed:{
    logueado(){
      return this.$store.state.usuario;
    },
    esAdministrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Administrador';
    },
    esAlmacenero(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Almacenero';
    },
    esVendedor(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Vendedor';
    }
  },
  created(){
    this.$store.dispatch("autoLogin");
  },
  methods:{
    salir(){
      this.$store.dispatch("salir");
    }
  }
}
</script>
<style>
.v-toolbar__content{
  height: 44px !important;
     
}
.v-navigation-drawer[data-booted="true"] {
  width: 250px !important;
}
.v-content {
   padding: 64px 0px 0px 250px !important;
   background: #f3f0ec;
}
@media screen and (max-width: 1100px){
    .v-content{
       padding: 64px 0px 0px 0px !important;
    }
}
.v-btn {
      border-radius: 0.25rem !important;
      text-transform: none !important;
      font-weight: 400 !important;
    letter-spacing: 0.05em !important;

}
.v-toolbar__title {
    font-size: 18px !important;
    font-weight: 400 !important;
}
</style>
