<template>
  <div class="q-pa-md q-gutter-xs">
    <q-card>
      <q-card-section>
        <div class="row q-gutter-sm">
          <div class="col-6">
            <q-input
              ref="refDescricao"
              label="Descrição"
              Type="text"
              counter
              maxlength="50"
              v-model="lancamento.descricao"
              @keypress.enter="pesquisarLancamento"
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
              @click="pesquisarLancamento"
            ></q-btn>
          </div>
          <div class="col-sm-6 text-right">
            <q-btn
              icon="fas fa-plus"
              color="primary"
              label="Novo"
              @click="novoLancamento()"
            ></q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <table style="width:100%">
          <q-tr>
            <q-th>Codigo</q-th>
            <q-th>Pessoa</q-th>
            <q-th>Categoria</q-th>
            <q-th>Valor</q-th>
            <q-th>Descrição</q-th>
            <div style="float: right">
              <q-th>Operações</q-th>
            </div>
          </q-tr>
          <q-tr
            v-for="lancamento in lancamentoList"
            v-bind:key="lancamento.codigo"
          >
            <q-td>{{lancamento.codigo}}</q-td>
            <q-td>{{lancamento.pessoa.nome}}</q-td>
            <q-td>{{lancamento.categoria.nome}}</q-td>
            <q-td>{{lancamento.valor.toFixed(2)}}</q-td>
            <q-td>{{lancamento.descricao}}</q-td>
            <div style="float: right">
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="blue"
                  icon="fas fa-search"
                  @click="visualizarLancamento(lancamento)"
                ></q-btn>
              </q-td>
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="orange"
                  icon="fas fa-pencil-alt"
                  @click="editarLancamento(lancamento)"
                ></q-btn>
              </q-td>
              <q-td class="col-md-1">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="red"
                  icon="fas fa-trash-alt"
                  @click="confirmarExclusao(lancamento)"
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
import api from 'components/util/api'
import util from 'components/util/util'
export default {
  data () {
    return {
      lancamentoList: [],
      lancamento: {},
      lancamentoPesquisa: ''
    }
  },
  methods: {
    listarLancamento () {
      this.$axios.get(api.LANCAMENTO).then((res) => {
        this.lancamentoList = res.data
      }).catch((err) => {
        util.mensagemFalha(err)
      })
    },
    pesquisarLancamento () {
      const filtro = '?texto='.concat(this.lancamento.descricao)
      this.$axios.get(api.LANCAMENTO_FILTRAR_POR_TEXTO.concat(filtro)).then((res) => {
        this.lancamentoList = res.data
      }).catch((err) => {
        util.mensagemFalha(err)
      })
    },
    novoLancamento () {
      const newPaginaStatus = {
        lancamento: {
          categoria: {},
          pessoa: {}
        }
      }
      this.$router.push({
        name: 'lancamentoCadastro',
        params: {
          paginaStatus: newPaginaStatus
        }
      })
    },
    visualizarLancamento (pLancamento) {
      const newPaginaStatus = {
        lancamento: pLancamento,
        desabilitarEdicao: true
      }
      this.$router.push({
        name: 'lancamentoCadastro',
        params: {
          paginaStatus: newPaginaStatus
        }
      })
    },
    editarLancamento (pLancamento) {
      const newPaginaStatus = {
        lancamento: pLancamento,
        desabilitarEdicao: false
      }
      this.$router.push({
        name: 'lancamentoCadastro',
        params: {
          paginaStatus: newPaginaStatus
        }
      })
    },
    excluirLancamento (lancamento) {
      const filtro = '/'.concat(lancamento.codigo)
      this.$axios.delete(api.LANCAMENTO.concat(filtro)).then((res) => {
        util.mensagemSucessoAoDeletar()
        this.listarLancamento()
      }).catch((err) => {
        util.mensagemFalha(err)
      })
    },
    confirmarExclusao (lancamento) {
      this.$q.dialog({
        title: 'Excluir',
        message: 'Deseja realmente excluir o lançamento '.concat(lancamento.descricao).concat('?'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.excluirLancamento(lancamento)
      })
    }
  },
  mounted () {
    this.listarLancamento()
  }
}
</script>

<style>
tr:nth-child(even) {
  background-color: #ddd;
}
</style>
