<template>
  <div class="q-pa-md q-gutter-xs">
    <q-breadcrumbs class="text-orange">
      <template v-slot:separator>
        <q-icon
          size="1.5em"
          name="chevron_right"
          color="primary"
        />
      </template>

      <q-breadcrumbs-el
        label="Pessoas"
        icon="person"
      />
    </q-breadcrumbs>
    <q-card>
      <q-card-section>
        <div class="row q-gutter-sm">
          <div class="col-6">
            <q-input
              ref="refNome"
              label="Nome"
              Type="text"
              counter
              maxlength="50"
              v-model="nomePesquisa"
              @keyup.13="pesquisarPessoa"
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
              @click="pesquisarPessoa"
            ></q-btn>
          </div>
          <div class="col-sm-6 text-right">
            <q-btn
              icon="person_add"
              color="primary"
              label="Nova"
              @click="novaPessoa()"
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
            <q-td>Logradouro</q-td>
            <q-td>Ativo</q-td>
            <div style="float: right">
              <q-th>Operação</q-th>
            </div>
          </q-tr>
          <q-tr
            v-for="pessoa in pessoaList"
            v-bind:key="pessoa.codigo"
          >
            <q-td>{{pessoa.codigo}}</q-td>
            <q-td>{{pessoa.nome}}</q-td>
            <q-td>{{pessoa.endereco.logradouro}}</q-td>
            <q-td>{{pessoa.ativo?'Sim':'Não'}}</q-td>
            <div style="float: right">
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="blue"
                  icon="fas fa-search"
                  @click="visualizarPessoa(pessoa)"
                ></q-btn>
              </q-td>
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="orange"
                  icon="fas fa-pencil-alt"
                  @click="editarPessoa(pessoa)"
                ></q-btn>
              </q-td>
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="red"
                  icon="fas fa-trash-alt"
                  @click="confirmarExclusao(pessoa)"
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
      pessoaList: [],
      pessoa: {},
      nomePesquisa: ''
    }
  },
  methods: {
    listarPessoa () {
      this.$axios.get(api.PESSOA).then((res) => {
        this.pessoaList = res.data
      }).catch((err) => {
        util.mensagemFalha(err)
      })
    },
    pesquisarPessoa () {
      var filtro = '?texto='.concat(this.nomePesquisa)
      // +'&descricao='.concat(this.descricao)
      this.$axios.get(api.PESSOA_FILTRAR_POR_TEXTO.concat(filtro)).then((res) => {
        this.pessoaList = res.data
      }).catch((err) => {
        util.mensagemFalha(err)
      })
    },
    novaPessoa () {
      const newPaginaStatus = {
        pessoa: {
          endereco: {}
        }
      }
      this.$router.push({
        name: 'pessoaCadastro',
        params: {
          paginaStatus: newPaginaStatus
        }
      })
    },
    visualizarPessoa (pPessoa) {
      const newPaginaStatus = {
        pessoa: pPessoa,
        desabilitarEdicao: true
      }
      this.$router.push({
        name: 'pessoaCadastro',
        params: {
          paginaStatus: newPaginaStatus
        }
      })
    },
    editarPessoa (pPessoa) {
      const newPaginaStatus = {
        pessoa: pPessoa,
        desabilitarEdicao: false
      }
      this.$router.push({
        name: 'pessoaCadastro',
        params: {
          paginaStatus: newPaginaStatus
        }
      })
    },
    excluirPessoa (pessoa) {
      const filtro = '/'.concat(pessoa.codigo)
      this.$axios.delete(api.PESSOA.concat(filtro)).then((res) => {
        util.mensagemSucessoAoDeletar()
        this.listarPessoa()
      }).catch((err) => {
        util.mensagemFalha(err)
      })
    },
    confirmarExclusao (pessoa) {
      this.$q.dialog({
        title: 'Excluir',
        message: 'Deseja realmente excluir a pessoa '.concat(pessoa.nome).concat('?'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.excluirPessoa(pessoa)
      })
    }
  },
  mounted () {
    this.listarPessoa()
  }
}

</script>
<style>
tr:nth-child(even) {
  background-color: #ddd;
}
</style>
