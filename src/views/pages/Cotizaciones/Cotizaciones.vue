<script>
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import appConfig from "@/app.config";
import axios from 'axios'
import { BModal } from "bootstrap-vue-next";

/**
 * Basic-table component
 */
export default {
  page: {
    title: "Basic Tables",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
        producto: [],
        carrito: [],
        showCart: false,
      id : '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      codigo: '',
      categoria: '',
      imagen: null,

      title: "Cotizaciones",
      items: [
        {
          text: "Home",
          href: "/"
        },
        {
          text: "Cotizaciones",
          active: true
        }
      ]
    };
  },
  mounted(){
    //Si no ponemos this lo reconocera como una funcion local
    //El this lo convierte en una funcion global
    this.getProductos()
    setInterval(this.getProductos, 30000); // Actualizar cada 30 segundos
  },
  methods: {
    getProductos() {
      const request = 'http://127.0.0.1:8000/productos'
      axios.get(request)
      .then(response => {
        this.producto = response.data.map(element => ({
          id: element.Producto_ID,
          nombre: element.Nombre,
          descripcion: element.Descripcion,
          precio: element.Precio,
          stock: element.Stock,
          codigo: element.Codigo_Producto,
          categoria: element.Categoria_ID,
          imagen: element.ImagenUrl 
        }));
      })
      .catch(error => {
        console.log('Error: ', error)
      })
    },
    agregarAlCarrito(producto) {
      this.carrito.push(producto);
      alert('Producto agregado al carrito');
    },
    toggleCart() {
      this.showCart = !this.showCart;
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <button @click="toggleCart" class="btn btn-primary mb-3">Ver carrito</button>
            <BModal v-model="showCart" title="Carrito de Compras">
              <ul>
                <li v-for="(producto, index) in carrito" :key="index" class="d-flex align-items-center mb-2">
                  <img :src="producto.imagen" alt="Imagen del producto" class="img-thumbnail me-3" width="50">
                  <div>
                    <p class="mb-1">{{ producto.nombre }}</p>
                    <small class="text-muted">Q.{{ producto.precio }}</small>
                  </div>
                </li>
              </ul>
              <div>
                <button class="btn btn-primary">Cotizar</button>
              </div>
            </BModal>
            <div>
              <div class="row">
                <div class="col-md-6">
                  <div>
                    <h5>Productos actuales</h5>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-inline float-md-end">
                    <div class="search-box ms-2">
                      <div class="position-relative">
                        <input type="text" class="form-control rounded" placeholder="Search..." />
                        <i class="mdi mdi-magnify search-icon"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                <div class="row no-gutters">
                    <div class="col-xl-3 col-sm-4"  v-for="(producto, index) in producto" :key="index">
                    <div class="product-box">
                        <div class="product-img">
                        <a href="#" @click.prevent="agregarAlCarrito(producto)">
                            <i class="mdi mdi-plus me-2"> Cotizar</i>
                        </a>
                        <img :src="producto.imagen" alt="Imagen del producto" class="img-fluid mx-auto d-block" width="100%">
                    </div>

                    <div class="text-center">
                        <p class="text-muted">{{ producto.nombre }}</p>
                        <h5 class="font-size-15">{{ producto.descripcion }}</h5>
                        <h4 class="mt-0 mb-3">Q.{{ producto.precio }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </Layout>
</template>