<template>
  <div class="q-pa-md q-gutter-xs">
    <q-dialog v-model="dialogNovaCategoria">
      <q-card style="min-width: 50%">
        <q-card-section>
          <div class="text-10">Categoria</div>
        </q-card-section>
        <q-card-section>
          <q-input
            ref="refCategoriaNova"
            label="Nome"
            Type="text"
            maxlength="50"
            counter
            autofocus
            dense
            v-model="categoriaNova.nome"
            :disable="desabilitarEdicao"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Nome é obrigatório']"
          ></q-input>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-sm-6 text-left">
              <q-btn
                label="Sair"
                color="info"
                @click="dialogNovaCategoria=false"
              ></q-btn>
            </div>
            <div class="col-sm-6 text-right">
              <q-btn
                label="Salvar"
                color="positive"
                type="submit"
                :disable="desabilitarEdicao"
                @click="salvar"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-card>
      <q-card-section>
        <div class="row gutter-sm">
          <div class="col-6">
            <q-input
              ref="refNome"
              label="Nome"
              Type="text"
              counter
              maxlength="50"
              v-model="nomePesquisa"
              @keyup.13="pesquisarCategoria"
              dense
            ></q-input>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6 text-left">
            <q-btn
              icon="fas fa-search"
              color="warning"
              label="Pesquisar"
              @click="pesquisarCategoria"
            ></q-btn>
          </div>
          <div class="col-sm-6 text-right">
            <q-btn
              icon="fas fa-plus"
              color="primary"
              label="Nova"
              @click="dialogNovaCategoria = true"
            ></q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <table style="width:100%">
          <q-tr>
            <q-td>Codigo</q-td>
            <q-td>Nome</q-td>
            <div style="float: right">
              <q-th>Operação</q-th>
            </div>
          </q-tr>
          <q-tr
            v-for="categoria in categoriaList"
            v-bind:key="categoria.codigo"
          >
            <q-td>{{categoria.codigo}}</q-td>
            <q-td>{{categoria.nome}}</q-td>
            <div style="float: right">
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="blue"
                  icon="fas fa-search"
                  @click="visualizarCategoria(categoria)"
                ></q-btn>
              </q-td>
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="orange"
                  icon="fas fa-pencil-alt"
                  @click="editarCategoria(categoria)"
                ></q-btn>
              </q-td>
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="red"
                  icon="fas fa-trash-alt"
                  @click="confirmarExclusao(categoria)"
                ></q-btn>
              </q-td>
            </div>
          </q-tr>
        </table>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import api from '../../../components/util/api'
import util from '../../../components/util/util'
export default {
  data () {
    return {
      categoriaList: [],
      nomePesquisa: '',
      categoriaNova: {},
      dialogNovaCategoria: false,
      desabilitarEdicao: false
    }
  },
  methods: {
    listarCategoria () {
      this.$axios.get(api.CATEGORIA).then((res) => {
        this.categoriaList = res.data
        this.countCategoria = res.count
      }).catch((err) => {
        util.mensagemFalha(err)
      })
    },
    pesquisarCategoria () {
      var filtro = '?texto='.concat(this.nomePesquisa)
      // +'&descricao='.concat(this.descricao)
      this.$axios.get(api.CATEGORIA_FILTRAR_POR_TEXTO.concat(filtro)).then((res) => {
        this.categoriaList = res.data
      }).catch((err) => {
        util.mensagemFalha(err)
      })
    },
    salvar () {
      this.$refs.refCategoriaNova.validate()
      if (this.$refs.refCategoriaNova.hasError) {
        this.formHasError = true
      } else {
        if (!this.categoriaNova.codigo) {
          this.$axios.post(api.CATEGORIA, this.categoriaNova).then((res) => {
            util.mensagemSucessoAoSalvar()
            this.limparObjetoCategoriaAoSalvar()
            this.listarCategoria()
          }).catch((err) => {
            util.mensagemFalha(err)
          })
        } else {
          const filtro = '/'.concat(this.categoriaNova.codigo)
          this.$axios.put(api.CATEGORIA.concat(filtro), this.categoriaNova).then((res) => {
            util.mensagemSucessoAoAtualizar()
            this.limparObjetoCategoriaAoSalvar()
            this.listarCategoria()
          }).catch((err) => {
            util.mensagemFalha(err)
          })
        }
      }
    },
    visualizarCategoria (categoria) {
      this.categoriaNova = categoria
      this.dialogNovaCategoria = true
      this.desabilitarEdicao = true
    },
    editarCategoria (categoria) {
      this.categoriaNova = categoria
      this.dialogNovaCategoria = true
      this.desabilitarEdicao = false
    },
    excluirCategoria (categoria) {
      const filtro = '/'.concat(categoria.codigo)
      this.$axios.delete(api.CATEGORIA.concat(filtro)).then((res) => {
        util.mensagemSucessoAoDeletar()
        this.listarCategoria()
      }).catch((err) => {
        util.mensagemFalha(err)
      })
    },
    confirmarExclusao (categoria) {
      this.$q.dialog({
        title: 'Excluir',
        message: 'Deseja realmente excluir a categoria '.concat(categoria.nome).concat('?'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.excluirCategoria(categoria)
      })
    },
    limparObjetoCategoriaAoSalvar () {
      this.categoriaNova = {}
      this.dialogNovaCategoria = false
    }
  },
  mounted () {
    this.listarCategoria()
  }
}

</script>
<style>
tr:nth-child(even) {
  background-color: #ddd;
}
</style>
