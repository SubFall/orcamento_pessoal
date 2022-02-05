/*essa Classe pega os valores do HTML e atribua para os
atributos da classe*/
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}
//essa classe é instanciada de forma automatica na criação do app.js
class Bd {
    constructor() {
        //esse código verifica se o localStorage está vazio
        //se estiver vazio o valor será retornado null
        //assim o "if" criara automaticamente a chave 'id' e o valor 0
        this.id = localStorage.getItem('id')
        
        if(this.id === null) {
            localStorage.setItem('id', 0)
        }
    }
    //aqui o método getProximoId pega o valor do localStorage
    //e acrecenta + 1 unidade e retornando o valor para quem fez a chamada
    getProximoId() {
        let getProximoId = localStorage.getItem('id', 0)
        return parseInt(getProximoId) + 1
    }
    //aqui no método gravar, ele recupera o valor recebido do método getProximoId,
    //em seguida ele seta o valor contido no "id" e os dados que estão sendo
    //recebido pelo Objeto Despesa que está sendo convertido em JSON,
    //finalizando com a chave "id" no localStorage e atribuindo o valor atualizado 
    //no método getProximoId
    gravar(despesa) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(despesa))
        localStorage.setItem('id', id)

    }

    recuperarTodosRegistros() {
        //array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')
        
        //recuperar todas as despesas cadastradas em localStorage
        for(let i = 1; i <= id; i++) {
            
            let despesa = JSON.parse(localStorage.getItem(i))
            
            //existe a possibilidade de haver índices que foram pulados/removidos
            //nestes casos nós vamos pular esses índices

            if(despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa) {

        let todosRegistros = Array()

        todosRegistros = this.recuperarTodosRegistros()

        console.log(despesa)
        console.log(todosRegistros)
       
        //ano
        if(despesa.ano != '') {
            console.log('ano')
            todosRegistros = todosRegistros.filter(v => v.ano == despesa.ano)
        }

        //mes
        if(despesa.mes != '') {
            console.log('mes')
            todosRegistros = todosRegistros.filter(v => v.mes == despesa.mes)
        }

        //dia
        if(despesa.dia != '') {
            console.log('dia')
            todosRegistros = todosRegistros.filter(v => v.dia == despesa.dia)
        }

        //tipo
        if(despesa.tipo != '') {
            console.log('tipo')
            todosRegistros = todosRegistros.filter(v => v.tipo == despesa.tipo)
        }

        //descricao
        if(despesa.descricao != '') {
            console.log('descrição')
            todosRegistros = todosRegistros.filter(v => v.descricao == despesa.descricao)
        }

        //valor
        if(despesa.valor != '') {
            console.log('valor')
            todosRegistros = todosRegistros.filter(v => v.valor == despesa.valor)
        }
        return todosRegistros
    }

    remover(id) {
        localStorage.removeItem(id)
        window.location.reload()
    }
}

let bd = new Bd()

//esse bloco recebe os valores do HTML pelo DOM
function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value,
                              mes.value,
                              dia.value,
                              tipo.value,
                              descricao.value,
                              valor.value)
    
        if(despesa.validarDados() == true){
            bd.gravar(despesa)
            alert(`Registro inserido com sucesso
            

Despesa foi cadastrado com sucesso!
                 `)

    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = ''
    descricao.value = ''
    valor.value = ''

        } else {
            alert('Existem campos obrigatórios que não foram preenchidos')
        } 
}
//essa função carrega a tabela do formulario do consulta.html
//carregando os dados dinâmico
function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorrer o array despesas, listando cada despesa de forma dimâmica

    despesas.forEach(d => {
        //console.log(d)

        //criando a linha (tr)
        linha = listaDespesas.insertRow()
        //criando as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'; break
            case '2': d.tipo = 'Educação'; break
            case '3': d.tipo = 'Lazer'; break
            case '4': d.tipo = 'Saúde'; break
            case '5': d.tipo = 'Transporte'; break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar o botão de exclusão
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            //remover despesa

            let id = this.id.replace('id_despesa_', '')
            //alert(id)

            bd.remover(id)
        
        }
        linha.insertCell(4).append(btn)
    })
}   
//essa função vai filtra os dados da página consulta.html
function pesquisarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value,
                              mes.value,
                              dia.value,
                              tipo.value,
                              descricao.value,
                              valor.value)

    let despesas = Array()

    despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)

    
}
