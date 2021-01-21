
/**
 * Classe para criar objetos do tipo despesa
 */
class Despesa{
  /**
   * 
   * @param {string} ano 
   * @param {string} mes 
   * @param {string} dia 
   * @param {string} tipo 
   * @param {string} descricao 
   * @param {string} valor 
   */
  constructor(ano, mes, dia, tipo, descricao, valor){
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  /**
   * Método responsável por validar os dados recebidos do formulário.
   */
  validarDados(){
    for(let i in this){
      if(this[i] === undefined || this[i] === "" || this[i] === null){
        return false
      }
    }
    return true
  }
}

/**
 * Classe reponsável por todo tratamento do banco localStorage do navegador
 */
class Bd{

  /**
   * Construtor da classe inicia o id em 0 caso esse campo não exista em localStorage
   */
  constructor(){
    let id = localStorage.getItem('id')

    if(id === null){
      localStorage.setItem('id', 0)
    }
  }

  /**
   * Método responsável por gerar o proximo id para gravar no banco de forma incremental
   */
  getProximoId(){
    let proximoId = localStorage.getItem('id')
    return parseInt(proximoId) + 1
  }

  /**
   * Método para gravar os dados da despesas no localStorage do navegador
   * @param {object: despesa} despesa 
   */
  gravar(despesa){
    let id = this.getProximoId()

    localStorage.setItem(id, JSON.stringify(despesa))

    localStorage.setItem('id', id)
  }

  /**
   * Método retorna todos os dados do localStorage 
   */
  recuperarTodosDados(){
    // Recupera o ultimo id
    let id = localStorage.getItem('id')
    let despesas = Array()
    
    //logica para recuperar cada item da lista de despesas
    for(let i = 1; i <= id; i++){
      // percorre cada iten da lista despesas e converte para objeto literal
      let despesa = JSON.parse(localStorage.getItem(i))

      // verifica se um objeto e null para não incluir ele na lista
      if(despesa == null){
        continue
      }

      // incluir no objeto despesa o campo id que corresponde ao id da informação
      despesa.id = i
      // inclui cada objeto literal em um array
      despesas.push(despesa)
    }

    return despesas
  }

  /**
   * Método responsável por pesquisar uma despesa filtrada
   * @param {object: despesa} despesa 
   * 
   */
  pesquisar(despesa){
    let despesasFiltradas = this.recuperarTodosDados()

    //ano
    if(despesa.ano != ''){
      despesasFiltradas = despesasFiltradas.filter(dado => dado.ano == despesa.ano)
    }
    //mes
    if(despesa.mes != ''){
      despesasFiltradas = despesasFiltradas.filter(dado => dado.mes == despesa.mes)
    }
    //dia
    if(despesa.dia != ''){
      despesasFiltradas = despesasFiltradas.filter(dado => dado.dia == despesa.dia)
    }
    //tipo
    if(despesa.tipo != ''){
      despesasFiltradas = despesasFiltradas.filter(dado => dado.tipo == despesa.tipo)
    }
    //descricao
    if(despesa.descricao != ''){
      despesasFiltradas = despesasFiltradas.filter(dado => dado.descricao == despesa.descricao)
    }
    //valor
    if(despesa.valor != ''){
      despesasFiltradas = despesasFiltradas.filter(dado => dado.valor == despesa.valor)
    }

    return despesasFiltradas
  }
  
  remover(id){
    localStorage.removeItem(id)
  }
}

let bd = new Bd()

// Função responsável por efetuar o cadastro no localStorage do navegador
function cadastrarDespesa(){
  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')
  let modalTitulo = document.getElementById('titulo')
  let modalTexto = document.getElementById('texto')
  let modalBtn = document.getElementById('btnModal')
  

  let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
  
  if(despesa.validarDados()){
    bd.gravar(despesa)
    modalTitulo.innerHTML = "Sucesso na Gravação"
    modalTitulo.className = 'modal-title text-success'
    modalTexto.innerHTML = "Despesa foi cadastrada com sucesso"
    modalBtn.innerHTML = "Voltar"
    modalBtn.className = 'btn btn-success'
    $('#modalRegistraDespesa').modal('show')
    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = ''
    descricao.value = ''
    valor.value = ''
  }else{
    modalTitulo.innerHTML = "Erro na Gravação"
    modalTitulo.className = 'modal-title text-danger'
    modalTexto.innerHTML = "Erro na gravação, verifique se todos os campos foram preenchidos"
    modalBtn.innerHTML = "Voltar e corrigir"
    modalBtn.className = 'btn btn-danger'
    $('#modalRegistraDespesa').modal('show')
  }
  
}

// Função responsável por carregar a lista de despesa na pagina de consulta 
function carregarListaDespesa(despesas = Array(), filtro = false){

  if(despesas.length == 0 && filtro == false){
    despesas = bd.recuperarTodosDados()
  }
  

  /**
   * Modelo com a despesa vai ser exibida na tela
   * <tr>
   *  <td>data formato: 15/01/2020</td>
   *  <td>tipo: Alimentação</td>
   *  <td>Descrição: compra do mês</td>
   *  <td>valor: 400.00</td>
   * </tr>
   */

  let listaDespesa = document.getElementById('listaDespesas')
  listaDespesa.innerHTML = ''

  // percorendo o array despesas, listando cada despesa de forma dinâmica
  despesas.forEach(function(dado){
    
    // criando a linha <tr></tr>
    let linha = listaDespesa.insertRow()

    // criar coluna <td></td>
    linha.insertCell(0).innerHTML = `${dado.dia}/${dado.mes}/${dado.ano}`

    // ajustar o tipo
    switch(dado.tipo){
      case '1': dado.tipo = 'Alimentação'
        break
      case '2': dado.tipo = 'Educação'
        break
      case '3': dado.tipo = 'Lazer'
        break
      case '4': dado.tipo = 'Saúde'
        break
      case '5': dado.tipo = 'Transporte'
    }

    linha.insertCell(1).innerHTML = dado.tipo
    linha.insertCell(2).innerHTML = dado.descricao
    linha.insertCell(3).innerHTML = dado.valor

    let btn = document.createElement('button')
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class="fas fa-times"></i>'
    btn.id = `id_despesa_${dado.id}`
    btn.onclick = function(){
      let id = this.id.replace('id_despesa_', '')
      bd.remover(id)
      let modalTitulo = document.getElementById('titulo')
      let modalTexto = document.getElementById('texto')
      let modalBtn = document.getElementById('btnModal')
      modalTitulo.innerHTML = "Despesa Removida"
      modalTitulo.className = 'modal-title text-success'
      modalTexto.innerHTML = "A despesa foi removida com sucesso"
      modalBtn.innerHTML = "Voltar"
      modalBtn.className = 'btn btn-success'
      $('#modalRemoveDespesa').modal('show')
      
    }
    linha.insertCell(4).append(btn)
  })


}

// Função para pesquisar por despesa específica
function pesquisarDespesa(){
  let ano = document.getElementById('ano').value,
      mes = document.getElementById('mes').value,
      dia = document.getElementById('dia').value,
      tipo = document.getElementById('tipo').value,
      descricao = document.getElementById('descricao').value,
      valor = document.getElementById('valor').value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

  let despesaFiltrada = bd.pesquisar(despesa)

  carregarListaDespesa(despesaFiltrada, true)


}

