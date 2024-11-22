<script>
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import appConfig from "@/app.config";
import axios from 'axios'

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
      tiendas: [],
      inventarios: [],
      idinventario: '',
      producto: '',
      tienda: '',
      stock: '',
      title: "Ubicaciones",
      items: [
        {
          text: "Tables",
          href: "/"
        },
        {
          text: "Basic",
          active: true
        }
      ]
    };
  },
  mounted(){
    //Si no ponemos this lo reconocera como una funcion local
    //El this lo convierte en una funcion global
    this.getTiendas()
    this.getInventario()
    setInterval(this.getTiendas, 30000); // Actualizar cada 30 segundos
    setInterval(this.getInventario, 30000); // Actualizar cada 30 segundos
  },
  methods: {
    getTiendas() {
      const request = 'http://127.0.0.1:8000/tiendas'
      axios.get(request)
      .then(response => {
        this.tiendas = response.data.map(element => ({
          id: element.Tienda_ID,
          tienda: element.Nombre_Tienda,
          direccion: element.Direccion,
          ciudad: element.Ciudad,
        }));
        console.log(this.tiendas); // Verificar los datos almacenados
      })
      .catch(error => {
        console.log('Error: ', error)
      })
    },
    getInventario(){
      const request = 'http://127.0.0.1:8000/inventarios'
      axios.get(request)
      .then(response => {
        this.inventarios = response.data.map(element => ({
          idinventario: element.Inventario_ID,
          idproducto: element.Producto_ID,
          idtienda: element.Tienda_ID,
          stock: element.Stock
        }));
        console.log(this.inventarios); // Verificar los datos almacenados
      })
      .catch(error => {
        console.log('Error: ', error)
      })
    },
    EnviarInsertar(){
      const request = 'http://127.0.0.1:8000/inventarios';
      const data = {
        Producto_ID: this.producto,
        Tienda_ID: this.tienda,
        Stock: this.stock
      };
      axios.post(request, data)
      .then(response => {
        console.log(response);
        this.$refs.modalInsertar.hide();
        this.getInventario();
      })
      .catch(error => {
        console.log('Error: ', error)
      });
    },
    Actualizar(inventario){
      this.idinventario = inventario.idinventario;
      this.producto = inventario.idproducto;
      this.tienda = inventario.idtienda;
      this.stock = inventario.stock;
      this.$refs.modalActualizar.show();
    },
    EnviarActualizar(){
      const request = 'http://127.0.0.1:8000/inventarios/' + this.idinventario;
      const data = {
        Producto_ID: this.producto,
        Tienda_ID: this.tienda,
        Stock: this.stock
      };
      axios.put(request, data)
      .then(response => {
        console.log(response);
        this.$refs.modalActualizar.hide();
        this.getInventario();
      })
      .catch(error => {
        console.log('Error: ', error)
      });
    },
    Eliminar(inventario){
      this.idinventario = inventario.idinventario;
      this.$refs.modalEliminar.show();
    },
    EnviarEliminar(){
      const request = 'http://127.0.0.1:8000/inventarios/' + this.idinventario;
      axios.delete(request)
      .then(response => {
        console.log('Eliminación exitosa:', response.data);
        this.$refs.modalEliminar.hide();
        this.getInventario();
      })
      .catch(error => {
        console.error('Error al eliminar:', error);
      });
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <!--Tabla Tiendas-->
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Tiendas actuales</h4>

            <div class="table-responsive">
              <table class="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>No. Tienda</th>
                    <th>Nombre</th>
                    <th>Ciudad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tienda in tiendas" :key="tienda.id">
                    <th scope="row">{{ tienda.id }}</th>
                    <td>{{ tienda.tienda }}</td>
                    <td>{{ tienda.ciudad }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Tabla Ubicaciones-->
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Ubicaciones de los productos</h4>
            <button v-b-modal.modal-insertar class="btn btn-success mb-2">
              <i class="mdi mdi-plus me-2"></i>Agregar ubicacion
            </button>

            <div class="table-responsive">
              <table class="table mb-0">
                <caption>Lista de ubicaciones de los productos</caption>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Tienda</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="inventario in inventarios" :key="inventario.idinventario">
                    <th scope="row">{{ inventario.idinventario }}</th>
                    <td>{{ inventario.idproducto }}</td>
                    <td>{{ inventario.idtienda }}</td>
                    <td>{{ inventario.stock }}</td>
                    <td>
                      <a class="me-3 text-primary" href="javascript:void(0);" @click="Actualizar(inventario)">
                        <i class="mdi mdi-pencil font-size-18"></i>
                      </a>
                      <a class="me-3 text-danger" href="javascript:void(0);" @click="Eliminar(inventario)">
                        <i class="mdi mdi-trash-can font-size-18"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Insertar-->
    <div>
      <BRow>
        <BModal ref="modalInsertar" id="modal-insertar" title="Ingresar nueva ubicacion" title-class="font-18" hide-footer>
          <h5>Datos</h5>
          <form>
            <div>
                <label for="nombre">Producto:</label>
              <input id="nombre" type="text" placeholder="Ingrese un producto" v-model="producto">
              <br>
              <label for="descripcion">Tienda:</label>
              <input id="descripcion" type="text" placeholder="Ingrese una tienda" v-model="tienda">
              <br>
              <label for="precio">Stock:</label>
              <input id="precio" type="text" placeholder="Ingrese un stock" v-model="stock">
            </div>
          </form>
          <div>
            <BButton type="submit" class="me-2" variant="danger" @click="EnviarInsertar()">Insertar</BButton>
          </div>
        </BModal>
      </BRow>
    </div>

     <!-- Modal Actualizar-->
     <div>
      <BRow>
        <BModal ref="modalActualizar" id="modal-actualizar" title="Actualizar ubicacion" title-class="font-18" hide-footer>
          <h5>Datos</h5>
          <form>
            <div>
                <label for="nombre">Producto:</label>
              <input id="nombre" type="text" placeholder="Ingrese un producto" v-model="producto">
              <br>
              <label for="descripcion">Tienda:</label>
              <input id="descripcion" type="text" placeholder="Ingrese una tienda" v-model="tienda">
              <br>
              <label for="precio">Stock:</label>
              <input id="precio" type="text" placeholder="Ingrese un stock" v-model="stock">
            </div>
          </form>
          <div>
            <BButton type="submit" class="me-2" variant="danger" @click="EnviarActualizar()">Actualizar</BButton>
          </div>
        </BModal>
      </BRow>
    </div>

    <!-- Modal eliminar-->
    <div>
      <BRow>
        <BModal ref="modalEliminar" id="modal-eliminar" title="Eliminar Ubicacion" title-class="font-18" hide-footer>
          <h5>Datos</h5>
          <form>
            <div>
              <label for="nombre">Esta seguro que quiere eliminar esta ubicacion?</label>
            </div>
          </form>
          <div>
            <BButton class="me-2" variant="danger" @click="EnviarEliminar()">Eliminar</BButton>
          </div>
        </BModal>
      </BRow>
    </div>
  </Layout>
</template>