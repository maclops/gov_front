
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        name: 'categoriaPesquisa',
        path: '/privado/categorias/pesquisa',
        component: () => import('pages/privado/categoria/CategoriaPesquisa.vue')
      }, {
        name: 'pessoaPesquisa',
        path: '/privado/pessoas/pesquisa',
        component: () => import('pages/privado/pessoa/PessoaPesquisa.vue')
      }, {
        name: 'lancamentoPesquisa',
        path: '/privado/lancamentos/pesquisa',
        component: () => import('pages/privado/lancamento/LancamentoPesquisa.vue')
      }, {
        name: 'lancamentoCadastro',
        path: '/privado/lancamentos/cadastro',
        component: () => import('pages/privado/lancamento/LancamentoCadastro.vue')
      // }, {
      //   name: 'categoriaPesquisa',
      //   path: '/privado/categorias/pesquisa',
      //   component: () => import('pages/privado/categoria/CategoriaPesquisa.vue')
      // }, {
      //   name: 'categoriaPesquisa',
      //   path: '/privado/categorias/pesquisa',
      //   component: () => import('pages/privado/categoria/CategoriaPesquisa.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
