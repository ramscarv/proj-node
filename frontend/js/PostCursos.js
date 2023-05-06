const add = document.querySelector('#salvar')

add.addEventListener('click', () => {
  // Capturar Dados do form
  const curso = getDadosForm()
  // ENVIAR DADOS PARA API
  APIfetch(curso)
})

function getDadosForm() {
  const inputNome = document.querySelector('#nome')
  const inputCh = document.querySelector('#ch')
  if (inputNome.value === null || inputCh.value === null) {
    console.log('campos vazios')
    return
  }

  const curso = {
    nome: inputNome.value,
    ch: inputCh.value
  }
  return curso
}

async function APIfetch(curso) {
  try {
    const resposta = await fetch('http://localhost:3000/cursos/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(curso)
    })
    if (resposta.status === 201) {
      Clean()
      window.location.href = 'index.html'
    } else {
      const msg = await resposta.json()
      console.log('Erro ao adicionar curso', msg)
    }
  } catch (erro) {
    console.error(erro)
  }
}

function Clean() {
  document.querySelector('#nome').value = ''
  document.querySelector('#ch').value = ''
}