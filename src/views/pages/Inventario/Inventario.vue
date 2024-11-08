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
      producto: [],
      id : '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      codigo: '',
      categoria: '',
      imagen: null,
      Nombre: '',
      Descripcion: '',
      Precio: '',
      Stock: '',
      Codigo_Producto: '',
      Categoria_ID: '',

      title: "Inventario",
      items: [
        {
          text: "Home",
          href: "/"
        },
        {
          text: "Inventario",
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
        console.log(this.producto); // Verificar los datos almacenados
      })
      .catch(error => {
        console.log('Error: ', error)
      })
    },
    Insertar(productos){
      this.nombre = ''
      this.descripcion = ''
      this.precio = ''
      this.stock = ''
      this.codigo = ''
      this.categoria = ''
    },
    SeleccionarImagen(event) {
      this.imagen = event.target.files[0];
    },
    EnviarInsertar()
    {
      const request = 'http://127.0.0.1:8000/productos/';
      const formData = new FormData();
      formData.append('Nombre', this.nombre);
      formData.append('Descripcion', this.descripcion);
      formData.append('Precio', this.precio);
      formData.append('Stock', this.stock);
      formData.append('Codigo_Producto', this.codigo);
      formData.append('Categoria_ID', this.categoria);
      formData.append('Imagen', this.imagen);

      axios.post(request, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log('Inserción exitosa:', response.data);
        this.$refs.modalInsertar.hide();
        this.getProductos();
      })
      .catch(error => {
        console.error('Error al insertar:', error);
      });
    },
    Actualizar(productos){
      this.id = productos.id
      this.nombre = productos.nombre
      this.descripcion = productos.descripcion
      this.precio = productos.precio
      this.stock = productos.stock
      this.codigo = productos.codigo
      this.categoria = productos.categoria
      this.imagen = productos.imagen
    },
    EnviarActualizar(){
      const request = 'http://127.0.0.1:8000/productos/' + this.id;
      const data = {
        Nombre: this.nombre,
        Descripcion: this.descripcion,
        Precio: this.precio,
        Stock: this.stock,
        Codigo_Producto: this.codigo,
        Categoria_ID: this.categoria
      };

      axios.put(request, data)
      .then(response => {
        console.log('Actualización exitosa:', response.data);3
        this.$refs.modalActualizar.hide();
        this.getProductos();
      })
      .catch(error => {
        console.error('Error al actualizar:', error);
      });
    },
    Eliminar(productos){
      this.id = productos.id
      this.nombre = productos.nombre
    },
    EnviarEliminar(){
      const request = 'http://127.0.0.1:8000/productos/' + this.id;
      axios.delete(request)
      .then(response => {
        console.log('Eliminación exitosa:', response.data);
        this.$refs.modalEliminar.hide();
        this.getProductos();
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
    <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Productos</h4>
            <p class="card-title-desc">
                Listado de productos en inventario
            </p>
            <button v-b-modal.modal-insertar class="btn btn-primary" @click=Insertar(productos)>Insertar</button>

            <div class="table-responsive">
              <table class="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre del producto</th>
                    <th>Descripcion</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Codigo</th>
                    <th>Categoria</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(productos, index) in producto" :key="index">
                    <th scope="row">{{ productos.id }}</th>
                    <td>{{ productos.nombre }}</td>
                    <td>{{ productos.descripcion }}</td>
                    <td>Q.{{ productos.precio }}</td>
                    <td>{{ productos.stock }}</td>
                    <td>{{ productos.codigo }}</td>
                    <td>{{ productos.categoria }}</td>
                    <td>
                      <img :src="productos.imagen" alt="Imagen del producto" width="100">
                    </td>
                    <td>
                        <button v-b-modal.modal-actualizar class="btn btn-primary" @click=Actualizar(productos)>Editar</button>
                        <button v-b-modal.modal-eliminar class="btn btn-danger" @click=Eliminar(productos)>Eliminar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>

    <!-- Modales -->
     <!-- Modal actualizar-->
    <div>
      <BRow>
        <BModal ref="modalActualizar" id="modal-actualizar" :title="'Actualizar producto: ' + nombre" title-class="font-18" hide-footer>
          <h5>Datos</h5>
          <form>
            <div>
              <label for="nombre">Nombre:</label>
              <input id="nombre" type="text" placeholder="Ingrese un nombre" v-model="nombre">
              <br>
              <label for="descripcion">Descripcion:</label>
              <input id="descripcion" type="text" placeholder="Ingrese una descripcion" v-model="descripcion">
              <br>
              <label for="precio">Precio:</label>
              <input id="precio" type="text" placeholder="Ingrese un precio" v-model="precio">
              <br>
              <label for="stock">Stock:</label>
              <input id="stock" type="text" placeholder="Ingrese el stock" v-model="stock">
              <br>
              <label for="codigo">Codigo de producto:</label>
              <input id="codigo" type="text" placeholder="Ingrese un codigo de producto" v-model="codigo">
              <br>
              <label for="categoria">Categoria:</label>
              <input id="categoria" type="text" placeholder="Ingrese una categoria" v-model="categoria">
            </div>
          </form>
          <div>
            <BButton class="me-2" variant="success" @click="EnviarActualizar()">Actualizar</BButton>
          </div>
        </BModal>
      </BRow>
    </div>
    <!--Modal actualizar imagen-->
    <div>
      <BRow>
        <BModal ref="modalActualizarImagen" id="modal-actualizarimagen" :title="'Actualizar imagen de producto: ' + nombre" title-class="font-18" hide-footer>
          <h5>Actualizacion de imagen:</h5>
          <form>
            <div>
              <label for="imagen">Seleccione la nueva imagen para el producto: </label>
              <input id="imagen" type="file" class="me-2" variant="danger" @change="SeleccionarImagen">
            </div>
          </form>
          <div>
            <BButton class="me-2" variant="danger" @click="EnviarActualizar()">Actualizar imagen</BButton>
          </div>
        </BModal>
      </BRow>
    </div>
    <!-- Modal eliminar-->
    <div>
      <BRow>
        <BModal ref="modalEliminar" id="modal-eliminar" :title="'Eliminar producto: ' + nombre" title-class="font-18" hide-footer>
          <h5>Datos</h5>
          <form>
            <div>
              <label for="nombre">Esta seguro que quiere eliminar este producto?</label>
            </div>
          </form>
          <div>
            <BButton class="me-2" variant="success">Cancelar</BButton>
            <BButton class="me-2" variant="danger" @click="EnviarEliminar()">Eliminar</BButton>
          </div>
        </BModal>
      </BRow>
    </div>
    <!-- Modal Insertar-->
    <div>
      <BRow>
        <BModal ref="modalInsertar" id="modal-insertar" title="Ingresar nuevo producto" title-class="font-18" hide-footer>
          <h5>Datos</h5>
          <form>
            <div>
                <label for="nombre">Nombre:</label>
              <input id="nombre" type="text" placeholder="Ingrese un nombre" v-model="nombre">
              <br>
              <label for="descripcion">Descripcion:</label>
              <input id="descripcion" type="text" placeholder="Ingrese una descripcion" v-model="descripcion">
              <br>
              <label for="precio">Precio:</label>
              <input id="precio" type="text" placeholder="Ingrese un precio" v-model="precio">
              <br>
              <label for="stock">Stock:</label>
              <input id="stock" type="text" placeholder="Ingrese el stock" v-model="stock">
              <br>
              <label for="codigo">Codigo de producto:</label>
              <input id="codigo" type="text" placeholder="Ingrese un codigo de producto" v-model="codigo">
              <br>
              <label for="categoria">Categoria:</label>
              <input id="categoria" type="text" placeholder="Ingrese una categoria" v-model="categoria">
              <br>
              <label for="imagen">Imagen del producto: </label>
              <input id="imagen" type="file" class="me-2" variant="danger" @change="SeleccionarImagen">
            </div>
          </form>
          <div>
            <BButton type="submit" class="me-2" variant="danger" @click="EnviarInsertar()">Insertar</BButton>
          </div>
        </BModal>
      </BRow>
    </div>
  </Layout>
</template>