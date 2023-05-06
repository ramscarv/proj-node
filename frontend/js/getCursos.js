const divCursos = document.querySelector("#cursos");
const submitForm = document.querySelector("#add-course form")

async function VerCursos() {
    const response = await fetch('http://localhost:3000/cursos');
    const cursos = await response.json();
    Telas(cursos);
}

async function VerCurso(id){
    const response = await fetch(`http://localhost:3000/cursos/${id}`);
    const curso = await response.json();

    return curso[0];
}

async function removerCurso(id) {
    const response = await fetch(`http://localhost:3000/cursos/delete/${id}`, {
        method: "DELETE",
    });
    VerCursos();
}

async function UpdateCurso(id, data) {
    const response = await fetch(`http://localhost:3000/cursos/update/${id}`, {
        method: "PUT",
        body: JSON.stringify({nome: data.nome, ch: data.ch}),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    VerCursos();
}


function Telas(cursos) {
    divCursos.innerHTML = "";
    cursos.forEach((curso) => {
        const novoCursoHTML = `
        <div id="curso${curso.id}" class="cursos">
            <button class="btn" onclick="removerCurso(${curso.id})">
                <i class="fa fa-trash"></i>
            </button>
            <button class="btn" onclick="EditCurso(${curso.id})">
                <i class="fa fa-pencil"></i>
            </button>
            <h3>${curso.nome}</h3>
            <p>Carga Horária: ${curso.ch} h</p>
        </div>
    `;
        divCursos.innerHTML = divCursos.innerHTML + novoCursoHTML;
    });
}

async function EditCurso(id) {
    const curso = await VerCurso(id);
    const cursoParaEditar = document.querySelector(`#curso${id}`);

    const novoCursoHTML = `
    <div id="curso${curso.id}-inner" class="edit-curso">
        <form id="form${curso.id}">
        <div class="info-form">
            Nome: <input id="nome" type="text" placeholder="${curso.nome}" value="${curso.nome}">
            <br> <br>
            Carga horária: <input id="ch" type="number" placeholder="${curso.ch}" value="${curso.ch}">
            <br> <br>
        </div>
            <div class="submit">
                <button type="submit">Atualizar</button>
            </div>
        </form>
      </div>
    `;

    cursoParaEditar.innerHTML = novoCursoHTML;

    const submitForm = document.querySelector(`#form${curso.id}`);

    submitForm.addEventListener("submit", (event) => {
        event.preventDefault();

        UpdateCurso(curso.id, {
            nome: event.target[0].value,
            ch: event.target[1].value,
        });
    });
}

VerCursos();