const lista = document.querySelector('.lista')
const input = document.getElementById('inputInserir')
const contentTarefas = lista.querySelectorAll('.contentTarefa')
const tarefas = lista.querySelectorAll('.tarefa')
const btnInserir = document.querySelector('.btnInserir')

const getLocalStorage = () => JSON.parse(localStorage.getItem('bancoDeDados')) ?? []
const setLocalStorage = (parametroBancoDeDados) => localStorage.setItem('bancoDeDados', JSON.stringify(parametroBancoDeDados))

const excluiTarefa = (indice) => {
    const arrayLocalStorage = getLocalStorage()
    arrayLocalStorage[indice].estado = 'delete'
    const estado = arrayLocalStorage[indice].estado
    editaClassEstado(indice, estado)
    setTimeout(() => {
        arrayLocalStorage.splice(indice, 1)
        lista.removeChild(lista.children[indice + 1])
        setLocalStorage(arrayLocalStorage)
    }, 1000)

    console.log('Tarefa removida: ', lista.children[indice + 1])
}

const editaTarefa = (indice, estado) => {
    const arrayLocalStorage = getLocalStorage()
    arrayLocalStorage[indice].estado = estado
    setLocalStorage(arrayLocalStorage)
    editaClassEstado(indice)

    console.log('Editando tarefa: ', arrayLocalStorage[indice])
}

const editaClassEstado = (indice) => {
    const arrayLocalStorage = getLocalStorage()
    const estado = arrayLocalStorage[indice].estado
    const tarefas = document.querySelectorAll('.tarefa')
    tarefas[indice].removeAttribute('class')
    tarefas[indice].firstElementChild.innerText = estado//icone tarefa ok
    tarefas[indice].classList.add('tarefa', estado, 'ativoComFlex')
}

const criaTarefa = (descricao) => {
    const dadosDaTarefa = { descricao, estado: 'priority' }
    const arrayLocalStorage = getLocalStorage()
    arrayLocalStorage.push(dadosDaTarefa)
    setLocalStorage(arrayLocalStorage)
}

const montaTarefa = (elemento, index) => {
    const arrayLocalStorage = getLocalStorage()
    lista.innerHTML += `
    <div class="contentTarefa">
        <div class="tarefa ${arrayLocalStorage[index].estado} ativoComFlex">
            <span class="material-symbols-outlined">${arrayLocalStorage[index].estado}</span>
            <p>${arrayLocalStorage[index].descricao}</p>
        </div>
        <nav class="opcoes oculto">
            <span class="priority material-symbols-outlined">priority</span>
            <span class="verified material-symbols-outlined">verified</span>
            <span class="priority_high material-symbols-outlined">priority_high</span>
            <span class="delete material-symbols-outlined">delete</span>
        </nav>
    </div> 
    `
}

const exibeTarefas = () => getLocalStorage().forEach(montaTarefa)

const mostraTarefa = () => {
    const tarefas = document.querySelectorAll('.tarefa')
    tarefas.forEach(tarefa => {
        tarefa.classList.remove('animaOcultar')
        tarefa.classList.add('ativoComFlex')
        tarefa.classList.remove('oculto')
    })
}

const ocultaTarefa = (indice) => {
    const contentTarefas = document.querySelectorAll('.contentTarefa')
    contentTarefas[indice].firstElementChild.classList.add('animaOcultar')
    setTimeout(() => {
        contentTarefas[indice].firstElementChild.classList.remove('ativoComFlex')
        contentTarefas[indice].firstElementChild.classList.add('oculto')
    }, 200)
}

const limpaDados = () => {
    lista.querySelectorAll('.contentTarefa')
        .forEach(tarefa => tarefa.parentNode
            .removeChild(tarefa))
}

const exibeOpcoes = (indice) => {
    const contentTarefas = document.querySelectorAll('.contentTarefa')
    contentTarefas[indice].lastElementChild.classList.add('ativoComFlex', 'animaMostrar')
    contentTarefas[indice].lastElementChild.classList.remove('oculto')
}

const ocultaOpcoes = () => {
    const opcoes = document.querySelectorAll('.opcoes')
    opcoes.forEach(opcao => {
        opcao.classList.remove('ativoComFlex')
        opcao.classList.add('oculto')
    })
}

const adicionarTarefa = () => {
    if (input.value != '') {
        criaTarefa(input.value)
        limpaDados()
        exibeTarefas()
        input.value = ''
        setTimeout(() => {
            location.reload()
        }, 100)
    } else {
        console.log('campo vazio. Precisa ser preenchido!')
    }
}

exibeTarefas()

// EVENTOS:

btnInserir.addEventListener('click', (e) => {
    e.preventDefault()
    btnInserir.classList.add('animaPulsar')
    setTimeout(() => {
        btnInserir.classList.remove('animaPulsar')
    }, 500)
    adicionarTarefa()
})

document.addEventListener('keydown', (e) => {
    if (input.value != '') {
        e.code === 'Enter' ? adicionarTarefa() : console.log('não foi possível adicionar')
    }
})

document.querySelectorAll('.tarefa')
    .forEach((tarefa, index) => {
        tarefa.addEventListener('click', (e) => {
            mostraTarefa()
            ocultaTarefa(index)
            ocultaOpcoes()
            exibeOpcoes(index)
        })
    })

document.querySelectorAll('.opcoes')
    .forEach((opcao, index) => {
        opcao.addEventListener('click', (e) => {
            if (e.target) {
                opcao.classList.remove('animaMostrar')
                ocultaOpcoes()
            }
            const tarefa = e.target.parentNode.parentNode.firstElementChild
            if (e.target.className === 'verified material-symbols-outlined') {
                editaTarefa(index, 'verified')
            }
            else if (e.target.className === 'priority_high material-symbols-outlined') {
                editaTarefa(index, 'priority_high')
            }
            else if (e.target.className === 'priority material-symbols-outlined') {
                editaTarefa(index, 'priority')
            }
            else if (e.target.className === 'delete material-symbols-outlined') {
                editaTarefa(index, 'delete')
                excluiTarefa(index)
            }
        })
    })

document.addEventListener('click', (e) => {
    if (e.target.localName !== 'div') {
        ocultaOpcoes()
        mostraTarefa()
    }
})

const mostrarLegenda = document.querySelector('.legenda h4')
const legendaUl = document.querySelector('.legenda ul')

mostrarLegenda.onclick = (e) => {
    legendaUl.classList.toggle('oculto')
}