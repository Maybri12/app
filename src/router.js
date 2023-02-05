import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import Categoria from './components/Categoria.vue'
import Login from './components/Login.vue'
import Usuario from './components/Usuario.vue'
import Articulo from './components/Articulo.vue'
import Cliente from './components/Cliente.vue'
import Proveedor from './components/Proveedor.vue'
import Ingreso from './components/Ingreso.vue'
import Venta from './components/Venta.vue'
import Empresas from './components/Empresas.vue'
import Compras from './components/Compra.vue'
import Materiales from './components/Material'
import Consultas from './components/Consultas.vue'
import ConsultaIngresos from './components/ConsultaIngresos.vue'
import Marca from './components/Marca.vue'
import Entradas from './components/Entradas.vue'
import Ubicacion from './components/Ubicacion.vue'
import kardex from './components/Kardex.vue'
import Auditoria from './components/Auditoria.vue'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        libre: true
      }
    },
    {
      path: '/categoria',
      name: 'categoria',
      component: Categoria,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: '/articulo',
      name: 'articulo',
      component: Articulo,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: '/ingreso',
      name: 'ingreso',
      component: Ingreso,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: '/compra',
      name: 'compra',
      component: Compras,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: '/material',
      name: 'material',
      component: Materiales,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: '/cliente',
      name: 'cliente',
      component: Cliente,
      meta: {
        administrador: true,
        vendedor: true
      }
    },
    {
      path: '/venta',
      name: 'venta',
      component: Venta,
      meta: {
        administrador: true,
        vendedor: true
      }
    },
    {
      path: '/proveedor',
      name: 'proveedor',
      component: Proveedor,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: '/empresas',
      name: 'empresas',
      component: Empresas,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: Usuario,
      meta: {
        administrador: true
      }
    },
    {
      path: '/consultas',
      name: 'consultas',
      component: Consultas,
      meta: {
        administrador: true
      }
    },
    {
      path: '/consultasIngreso',
      name: 'consultasIngreso',
      component: ConsultaIngresos,
      meta: {
        administrador: true
      }
    },
    {
      path: '/kardex',
      name: 'kardex',
      component: kardex,
      meta: {
        administrador: true
      }
    },
    {
      path: '/auditoria',
      name: 'auditoria',
      component: Auditoria,
      meta: {
        administrador: true
      }
    },
    {
      path: '/marca',
      name: 'marca',
      component: Marca,
      meta: {
        administrador: true
      }
    },
    {
      path: '/ubicacion',
      name: 'ubicacion',
      component: Ubicacion,
      meta: {
        administrador: true
      }
    },
    {
      path: '/entradas',
      name: 'entradas',
      component: Entradas,
      meta: {
        administrador: true
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)){
    next();
  } else if ( store.state.usuario && store.state.usuario.rol == 'Administrador'){
    if (to.matched.some(record => record.meta.administrador)){
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Vendedor'){
    if (to.matched.some(record => record.meta.vendedor)){
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Almacenero'){
    if (to.matched.some(record => record.meta.almacenero)){
      next();
    }
  } else{
    next({name: 'login'});
  }
})
export default router
