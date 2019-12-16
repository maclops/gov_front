<template>
  <div class="q-pa-md q-gutter-xs">
    <q-dialog v-model="dialogNovaPessoa">
      <q-card style="min-width: 50%">
        <q-card-section>
          <div class="text-10">Pessoa</div>
        </q-card-section>
        <q-card-section>
          <q-input
            ref="refPessoaNova"
            label="Nome"
            Type="text"
            maxlength="50"
            counter
            autofocus
            dense
            v-model="pessoaNova.nome"
          ></q-input>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-sm-6 text-left">
              <q-btn
                label="Sair"
                color="info"
                @click="dialogNovaPessoa=false"
              ></q-btn>
            </div>
            <div class="col-sm-6 text-right">
              <q-btn
                label="Salvar"
                color="positive"
                type="submit"
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
              icon="fas fa-plus"
              color="primary"
              label="Nova"
              @click="dialogNovaPessoa = true"
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
            v-for="pessoa in pessoaList"
            v-bind:key="pessoa.codigo"
          >
            <q-td>{{pessoa.codigo}}</q-td>
            <q-td>{{pessoa.nome}}</q-td>
            <div style="float: right">
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="blue"
                  icon="fas fa-search"
                  @click="visualizarPessoa(Pessoa)"
                ></q-btn>
              </q-td>
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="orange"
                  icon="fas fa-pencil-alt"
                  @click="editarPessoa(Pessoa)"
                ></q-btn>
              </q-td>
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="red"
                  icon="fas fa-trash-alt"
                  @click="excluirPessoa(Pessoa)"
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
      nomePesquisa: '',
      pessoaNova: {},
      dialogNovaPessoa: false
    }
  },
  methods: {
    listarPessoa () {
      this.$axios.get(api.PESSOA).then((res) => {
        this.pessoaList = res.data
        this.countPessoa = res.count
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
    salvar () {

    },
    visualizarPessoa (pessoa) {
      this.pessoaNova = pessoa
      this.dialogNovaPessoa = true
      this.desabilitarEdicao = true
    },
    editarPessoa (pessoa) {
      this.pessoaNova = pessoa
      this.dialogNovaPessoa = true
      this.desabilitarEdicao = false
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
    },
    limparObjetoPessoaAoSalvar () {
      this.pessoaNova = {}
      this.dialogNovaPessoa = false
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
