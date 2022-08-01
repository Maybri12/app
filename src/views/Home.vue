<template>

  <v-container grid-list-m>
    <v-layout wrap >
       
      <v-flex xs12 sm12 md12 >
        <div class="ct-chart">
          <canvas id="myChart">
          </canvas>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Spinner from '../layout/Spinner.vue'
import axios from 'axios'
import Chart from 'chart.js'
export default {
   components :{Spinner},
  data() {
    return {
      valores: [],
      meses: [],
      totales: [],
      dataAll: [],
      valores2: [],
      ifLoad: false,
    }
  },
  methods: {
    listar() {
      let me = this;
      let header = { "Token": this.$store.state.token };
      let configuracion = { headers: header };
      axios.get('venta/grafico12meses', configuracion).then(function (response) {
        me.dataAll = response.data;
        let result=[]
        me.dataAll.map(function (res) {
          var date = new Date(res.createdAt);
          result.push({ year: date.getFullYear(), mes: date.getMonth() + 1, total: parseInt(res.total) })
        })
        var nuevoArray = []
        var arrayTemporal = []
        var arrayFinal = []
        for (var i = 0; i < result.length; i++) {
          arrayTemporal = nuevoArray.filter(resp => resp["mes"] == result[i]["mes"])
          if (arrayTemporal.length > 0) {
            nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["total"].push(result[i]["total"])
          } else {
            nuevoArray.push({ "mes": result[i]["mes"],"year": result[i]["year"], "total": [result[i]["total"]] })
          }
        }
        for (let i = 0; i < nuevoArray.length; i++) {
          const element = nuevoArray[i].total;
          let total = element.reduce((a, b) => a + b, 0);
          arrayFinal.push({mes:nuevoArray[i].mes, year:nuevoArray[i].year, total:total});
        }
        me.valores = arrayFinal;
        me.graficar();
      }).catch(function (error) {
        console.log(error);
      });
    },
    graficar() {
      let me = this;
      let mesn = '';
      me.valores.map(function (x) {
        switch (parseInt(x.mes)) {
          case 1:
            mesn = 'Enero';
            break;
          case 2:
            mesn = 'Febrero';
            break;
          case 3:
            mesn = 'Marzo';
            break;
          case 4:
            mesn = 'Abril';
            break;
          case 5:
            mesn = 'Mayo';
            break;
          case 6:
            mesn = 'Junio';
            break;
          case 7:
            mesn = 'Julio';
            break;
          case 8:
            mesn = 'Agosto';
            break;
          case 9:
            mesn = 'Setiembre';
            break;
          case 10:
            mesn = 'Octubre';
            break;
          case 11:
            mesn = 'Noviembre';
            break;
          case 12:
            mesn = 'Diciembre';
            break;
          default:
            mesn = 'error'
        }

        me.meses.push(mesn + '-' + x.year);
        me.totales.push(x.total);
      });
      var ctx = document.getElementById('myChart');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: me.meses,
          datasets: [{
            label: 'Ventas de los últimos 12 meses',
            data: me.totales,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }

  },
  mounted() {
    this.listar();
  }
}
</script>
