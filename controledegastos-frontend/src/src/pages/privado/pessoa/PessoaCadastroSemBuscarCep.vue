<template>
  <div>
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
          :to="{name: 'pessoaPesquisa'}"
        />
        <q-breadcrumbs-el
          label="Cadastrar pessoa"
          icon="person_add"
        />
      </q-breadcrumbs>
      <q-card>
        <q-card-section>
          <div class="text-subtitle">Informações Pessoais</div>
          <div class="row q-col-gutter-xs">
            <div class="col-2">
              <q-input
                ref="refCodigo"
                label="Codigo"
                Type="Number"
                :disable="true"
                v-model="paginaStatus.pessoa.codigo"
                dense
              ></q-input>
            </div>
            <div class="col-10">
              <q-input
                ref="refNome"
                label="Nome"
                Type="text"
                maxlength="50"
                counter
                v-model="paginaStatus.pessoa.nome"
                :disable="paginaStatus.desabilitarEdicao"
                lazy-rules
                :rules="[val => val && val.length > 0 || 'Nome é obrigatório']"
                dense
              ></q-input>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle">Endereço</div>
          <div class="row q-col gutter-xs">
            <div class="col-6">
              <q-input
                ref="refLogradouro"
                label="Logradouro"
                Type="text"
                maxlength="30"
                counter
                v-model="paginaStatus.pessoa.endereco.logradouro"
                :disable="paginaStatus.desabilitarEdicao"
                dense
              ></q-input>
            </div>
            <div class="col-2">
              <q-input
                ref="refNumero"
                label="Número"
                Type="number"
                maxlength="30"
                v-model="paginaStatus.pessoa.endereco.numero"
                :disable="paginaStatus.desabilitarEdicao"
                dense
              ></q-input>
            </div>
            <div class="col-4">
              <q-input
                ref="refComplemento"
                label="Complemento"
                Type="text"
                maxlength="30"
                counter
                v-model="paginaStatus.pessoa.endereco.complemento"
                :disable="paginaStatus.desabilitarEdicao"
                dense
              ></q-input>
            </div>
          </div>
          <div class="row q-col-gutter-xs">
            <div class="col-4">
              <q-input
                ref="refBairro"
                label="Bairro"
                Type="text"
                maxlength="30"
                counter
                v-model="paginaStatus.pessoa.endereco.bairro"
                :disable="paginaStatus.desabilitarEdicao"
                dense
              ></q-input>
            </div>
            <div class="col-2">
              <q-input
                ref="refCep"
                label="Cep"
                Type="text"
                maxlength="30"
                v-model="paginaStatus.pessoa.endereco.cep"
                :disable="paginaStatus.desabilitarEdicao"
                dense
              ></q-input>
            </div>
            <div class="col-4">
              <q-input
                ref="refCidade"
                label="Cidade"
                Type="text"
                maxlength="30"
                counter
                v-model="paginaStatus.pessoa.endereco.cidade"
                :disable="paginaStatus.desabilitarEdicao"
                dense
              ></q-input>
            </div>
            <div class="col-1">
              <q-select
                ref="refEstado"
                label="Estado"
                Type="text"
                v-model="paginaStatus.pessoa.endereco.estado"
                :disable="paginaStatus.desabilitarEdicao"
                :options="estados"
                dense
              ></q-select>
            </div>
            <div class="col-1">
              <q-option-group
                ref="rafAtivo"
                type="toggle"
                v-model="paginaStatus.pessoa.ativo"
                :options="options"
                :disable="paginaStatus.desabilitarEdicao"
              />
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
  </div>
</template>
<script>
import api from 'components/util/api'
import util from 'components/util/util'
export default {
  data () {
    return {
      pessoaList: [],
      paginaStatus: {
        desabilitarEdicao: false,
        pessoa: {
          endereco: {}
        }
      },
      options: [
        {
          label: 'Ativo',
          value: true,
          color: 'teal'
        }
      ],
      estados: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
    }
  },
  methods: {
    salvar () {
      if (util.validarCamposAntesSalvar(this.$refs)) {
        if (!this.paginaStatus.pessoa.codigo) {
          this.$axios.post(api.PESSOA, this.paginaStatus.pessoa).then((res) => {
            util.mensagemSucessoAoSalvar()
          }).catch((err) => {
            util.mensageFalha(err)
          })
        } else {
          const filtro = '/'.concat(this.paginaStatus.pessoa.codigo)
          this.$axios.put(api.PESSOA.concat(filtro), this.paginaStatus.pessoa).then((res) => {
            util.mensagemSucessoAoSalvar()
          }).catch((err) => {
            util.mensageFalha(err)
          })
        }
      }
    },
    buscarPessoa () {
      this.$axios.get(api.PESSOA).then((res) => {
        this.pessoaList = res.data
      }).catch((err) => {
        util.mensageFalha(err)
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
