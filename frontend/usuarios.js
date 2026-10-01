const api = '/api'
const token = localStorage.getItem('token')

if (!token) {
  window.location.href = '/'
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  window.location.href = '/'
}

async function listarUsuarios() {
  const resposta = await fetch(`${api}/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (resposta.status === 401 || resposta.status === 403) {
    logout()
    return
  }

  const usuarios = await resposta.json()
  const div = document.getElementById('usuarios')
  div.innerHTML = ''

  usuarios.forEach(usuario => {
    div.innerHTML += `
      <article class="user-item">
        <div class="user-info">
          <div class="avatar">${usuario.nome.charAt(0).toUpperCase()}</div>
          <div>
            <strong>${usuario.nome}</strong>
            <span>${usuario.email}</span>
            <small>${usuario.tipo}</small>
          </div>
        </div>

        <div class="actions">
          <button
            class="secondary small"
            onclick="editarUsuario('${usuario._id}', '${usuario.nome}', '${usuario.email}', '${usuario.tipo}')"
          >
            Editar
          </button>

          <button
            class="danger small"
            onclick="removerUsuario('${usuario._id}')"
          >
            Excluir
          </button>
        </div>
      </article>
    `
  })
}

async function criarUsuario() {
  const body = {
    nome: document.getElementById('nomeNovo').value,
    email: document.getElementById('emailNovo').value,
    senha: document.getElementById('senhaNovo').value,
    tipo: document.getElementById('tipoNovo').value
  }

  const resposta = await fetch(`${api}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })

  if (resposta.status === 401 || resposta.status === 403) {
    document.getElementById('statusCrud').innerText =
      'Apenas administradores podem criar usuários'

    return
  }

  document.getElementById('nomeNovo').value = ''
  document.getElementById('emailNovo').value = ''
  document.getElementById('senhaNovo').value = ''
  document.getElementById('tipoNovo').value = 'paciente'

  document.getElementById('statusCrud').innerText =
    'Usuário criado com sucesso'

  listarUsuarios()
}

async function editarUsuario(id, nomeAtual, emailAtual, tipoAtual) {
  const nome = prompt('Nome', nomeAtual)
  const email = prompt('E-mail', emailAtual)
  const tipo = prompt('Tipo (paciente, medico ou admin)', tipoAtual)

  const resposta = await fetch(`${api}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      nome,
      email,
      tipo
    })
  })

  if (resposta.status === 401 || resposta.status === 403) {
    document.getElementById('statusCrud').innerText =
      'Apenas administradores podem editar usuários'

    return
  }

  listarUsuarios()
}

async function removerUsuario(id) {
  const resposta = await fetch(`${api}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (resposta.status === 401 || resposta.status === 403) {
    document.getElementById('statusCrud').innerText =
      'Apenas administradores podem excluir usuários'

    return
  }

  listarUsuarios()
}

listarUsuarios()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}