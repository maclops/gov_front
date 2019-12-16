<template>
  <div class="q-pa-md q-gutter-xs">
    <q-card>
      <q-breadcrumbs class="text-orange">
        <template v-slot:separator>
          <q-icon
            size="1.5em"
            name="chevron_right"
            color="primary"
          />
        </template>

        <q-breadcrumbs-el
          label="Lançamentos"
          icon="assignment"
          :to="{name: 'lancamentoPesquisa'}"
        />
        <q-breadcrumbs-el
          label="Cadastrar lançamento"
          icon="assignment_late"
        />
      </q-breadcrumbs>
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="col-2">
            <q-input
              ref="refCodigo"
              label="Codigo"
              Type="Number"
              :disable="true"
              v-model="paginaStatus.lancamento.codigo"
              dense
            ></q-input>
          </div>
          <div class="col-5">
            <q-radio
              v-model="paginaStatus.lancamento.tipo"
              val="RECEITA"
              color="teal"
            >Receita</q-radio>
            <q-radio
              v-model="paginaStatus.lancamento.tipo"
              val="DESPESA"
              color="red"
            >Despesa</q-radio>
          </div>
        </div>
        <div class="row q-col-gutter-xs">
          <div class="col-6">
            <q-input
              ref="refDescricao"
              label="Descrição"
              Type="text"
              maxlength="50"
              counter
              v-model="paginaStatus.lancamento.descricao"
              :disable="paginaStatus.desabilitarEdicao"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Descrição é obrigatória']"
              dense
            ></q-input>
          </div>
          <div class="col-2">
            <q-input
              label="Data vencimento"
              v-model="paginaStatus.lancamento.dataVencimento"
              :disable="paginaStatus.desabilitarEdicao"
              dense
            >
              <template v-slot:append>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="paginaStatus.lancamento.dataVencimento"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-2">
            <q-input
              label="Data pagamento"
              v-model="paginaStatus.lancamento.dataPagamento"
              :disable="paginaStatus.desabilitarEdicao"
              dense
            >
              <template v-slot:append>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="paginaStatus.lancamento.dataPagamento"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-2">
            <q-input
              ref="refValorLancamento"
              label="Valor"
              Type="number"
              prefix="R$"
              v-model="paginaStatus.lancamento.valor"
              :disable="paginaStatus.desabilitarEdicao"
              input-class="text-right"
              lazy-rules
              :rules="[val => val && val > 0 || 'Valor é obrigatório']"
              dense
            ></q-input>
          </div>
        </div>
        <div class="row q-col-gutter-xs">
          <div class="col-6">
            <q-select
              ref="refCategoria"
              label="Categoria"
              @focus="buscarCategoria()"
              @filter="filterCategoria"
              :options="optionsCategoriaArray"
              :option-value="item => item === null ? null : item"
              option-label="nome"
              :disable="paginaStatus.desabilitarEdicao"
              v-model="paginaStatus.lancamento.categoria"
              lazy-rules
              :rules="[val => val.codigo !== undefined || 'Categoria é obrigatório']"
              clearable
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              dense
            >
            </q-select>
          </div>
          <div class="col-6">
            <q-select
              ref="refPessoa"
              label="Pessoa"
              @focus="buscarPessoa()"
              @filter="filterPessoa"
              :options="optionsPessoaArray"
              :option-value="item => item === null ? null : item"
              option-label="nome"
              :disable="paginaStatus.desabilitarEdicao"
              v-model="paginaStatus.lancamento.pessoa"
              lazy-rules
              :rules="[val => val.codigo !== undefined || 'Pessoa é obrigatória']"
              clearable
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              dense
            >
            </q-select>
          </div>
        </div>
        <div class="row q-col-gutter-xs">
          <div class="col-12">
            <q-input
              ref="refObservacao"
              label="Observação"
              Type="text"
              maxlength="100"
              counter
              v-model="paginaStatus.lancamento.observacao"
              :disable="paginaStatus.desabilitarEdicao"
              dense
            ></q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="col-12 text-right pad-20t-h10-80b">
      <q-btn
        class="fixed"
        color="positive"
        icon="check"
        size="lg"
        @click="salvar"
        style="right: 18px; bottom:18px"
        v-show="!paginaStatus.desabilitarEdicao"
      >
        <q-tooltip>Salvar</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
<script>
import api from 'components/util/api'
import util from 'components/util/util'
export default {
  data () {
    return {
      categoriaList: [],
      optionsCategoriaArray: [],
      pessoaList: [],
      optionsPessoaArray: [],
      paginaStatus: {
        desabilitarEdicao: false,
        lancamento: {
          cateoria: {},
          pessoa: {}
        }
      }
    }
  },
  methods: {
    salvar () {
      if (util.validarCamposAntesSalvar(this.$refs)) {
        this.paginaStatus.lancamento.dataVencimento = util.criarData(this.paginaStatus.lancamento.dataVencimento)
        this.paginaStatus.lancamento.dataPagamento = util.criarData(this.paginaStatus.lancamento.dataPagamento)
        if (!this.paginaStatus.lancamento.codigo) {
          this.$axios.post(api.LANCAMENTO, this.paginaStatus.lancamento).then((res) => {
            util.mensagemSucessoAoSalvar()
          }).catch((err) => {
            util.mensagemFalha(err)
          })
        } else {
          const filtro = '/'.concat(this.paginaStatus.lancamento.codigo)
          this.$axios.put(api.LANCAMENTO.concat(filtro), this.paginaStatus.lancamento).then((res) => {
            util.mensagemSucessoAoAtualizar()
          }).catch((err) => {
            util.mensagemFalha(err)
          })
        }
      }
    },
    buscarCategoria () {
      this.$axios.get(api.CATEGORIA).then((res) => {
        this.categoriaList = res.data
      }).catch((err) => {
        util.mensagemFalha(err)
      })
    },
    filterCategoria (val, update) {
      update(() => {
        const needle = val.toLowerCase()
        if (needle.length >= 3) {
          this.optionsCategoriaArray = this.categoriaList.filter(v => v.nome.toLowerCase().indexOf(needle) > -1)
        }
        if (needle.length === 0) {
          this.optionsCategoriaArray = this.categoriaList
        }
      })
    },
    buscarPessoa () {
      this.$axios.get(api.PESSOA).then((res) => {
        this.pessoaList = res.data
      }).catch((err) => {
        util.mensagemFalha(err)
      })
    },
    filterPessoa (val, update) {
      update(() => {
        const needle = val.toLowerCase()
        if (needle.length >= 3) {
          this.optionsPessoaArray = this.pessoaList.filter(v => v.nome.toLowerCase().indexOf(needle) > -1)
        }
        if (needle.length === 0) {
          this.optionsPessoaArray = this.pessoaList
        }
      })
    }
  },
  mounted () {
    if (this.$route.params.paginaStatus) {
      this.paginaStatus = this.$route.params.paginaStatus
    }
  }
}
</script>
<style>
</style>
