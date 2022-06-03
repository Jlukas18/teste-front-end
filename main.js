/*  abre e fecha o menu quando clicar no icone: hamburguer e x */
const nav = document.querySelector('#header nav')
const toggle = document.querySelectorAll('nav .toggle')
const form = document.querySelector('#form-container')
const btnSalvar = document.querySelector('#btn-submit-student')
const studentName = document.querySelector('#student-name')
const studentEmail = document.querySelector('#student-email')
const studentCpf = document.querySelector('#student-cpf')
const studentCurso = document.querySelector('#student-curso')
const tableBody = document.querySelector('#table-body')


let students = [];
let id

for (const element of toggle) {
  element.addEventListener('click', function () {
    nav.classList.toggle('show')
  })
}

/* quando clicar em um item do menu, esconder o menu */
const links = document.querySelectorAll('nav ul li a')

for (const link of links) {
  link.addEventListener('click', function () {
    nav.classList.remove('show')
  })
}

/* mudar o header da página quando der scroll */
const header = document.querySelector('#header')
const navHeight = header.offsetHeight

function changeHeaderWhenScroll() {
  if (window.scrollY >= navHeight) {
    // scroll é maior que a altura do header
    header.classList.add('scroll')
  } else {
    // menor que a altura do header
    header.classList.remove('scroll')
  }
}

/* Testimonials carousel slider swiper */
const swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  pagination: {
    el: '.swiper-pagination'
  },
  mousewheel: true,
  keyboard: true,
  breakpoints: {
    767: {
      slidesPerView: 2,
      setWrapperSize: true
    }
  }
})

/* ScrollReveal: Mostrar elementos quando der scroll na página */
const scrollReveal = ScrollReveal({
  origin: 'top',
  distance: '30px',
  duration: 700,
  reset: true
})

scrollReveal.reveal(
  `#home .image, #home .text,
  #about .image, #about .text,
  #services header, #services .card,
  #testimonials header, #testimonials .testimonials
  #contact .text, #contact .links,
  footer .brand, footer .social
  `,
  { interval: 100 }
)

/* Botão voltar para o topo */
const backToTopButton = document.querySelector('.back-to-top')

function backToTop() {
  if (window.scrollY >= 560) {
    backToTopButton.classList.add('show')
  } else {
    backToTopButton.classList.remove('show')
  }
}

/* Menu ativo conforme a seção visível na página */
const sections = document.querySelectorAll('main section[id]')
function activateMenuAtCurrentSection() {
  const checkpoint = window.pageYOffset + (window.innerHeight / 8) * 4

  for (const section of sections) {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute('id')

    const checkpointStart = checkpoint >= sectionTop
    const checkpointEnd = checkpoint <= sectionTop + sectionHeight

    if (checkpointStart && checkpointEnd) {
      document
        .querySelector('nav ul li a[href*=' + sectionId + ']')
        .classList.add('active')
    } else {
      document
        .querySelector('nav ul li a[href*=' + sectionId + ']')
        .classList.remove('active')
    }
  }
}

/* When Scroll */
window.addEventListener('scroll', function () {
  changeHeaderWhenScroll()
  backToTop()
  activateMenuAtCurrentSection()
})



/* save students logic start*/

btnSalvar.onclick = e => {
  e.preventDefault()

  console.log("CHAMOU")
  checkInputsForSaveStudent()
}

function checkInputsForSaveStudent() {
  const studentNameValue = studentName.value;
  const studentEmailValue = studentEmail.value;
  const studentCpfValue = studentCpf.value;
  const studentCursoValue = studentCurso.value;

  if (studentNameValue === "") {
    setErrorFor(studentName, "O nome é obrigatório.");
  } else {
    setSuccessFor(studentName);
  }

  if (studentEmailValue === "") {
    setErrorFor(studentEmail, "O email é obrigatório.");
  } else if (!checkEmail(studentEmailValue)) {
    setErrorFor(studentEmail, "Por favor, insira um email válido.");
  } else {
    setSuccessFor(studentEmail);
  }

  if (studentCpfValue === "") {
    setErrorFor(studentCpf, "O CPF é obrigatório.");
  } else if (!checkCpf(studentCpfValue)) {
    setErrorFor(studentCpf, "O CPF informado é inválido.");
  } else if(checkIfExistStudentCpf(studentCpfValue)){
    setErrorFor(studentCpf, "O CPF informado já existe.");
  }
   else {
    setSuccessFor(studentCpf);  
  }

  if (studentCursoValue === "") {
    setErrorFor(studentCurso, "O nome do curso é obrigatório.");
  } else {
    setSuccessFor(studentCurso);
  }

  const formControls = form.querySelectorAll(".form-item");

  const formIsValid = [...formControls].every((formControl) => {
    return formControl.className === "form-item success";
  });

  if (formIsValid) {
    saveUserInDB()
  }
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  small.innerText = message;

  formControl.className = "form-item error";
}

function setSuccessFor(input) {
  const formControl = input.parentElement;

  formControl.className = "form-item success";
}

function checkEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

function checkIfExistStudentCpf(strCPF) {
  var existe = false;
  students.forEach((student, index) => {
    if(strCPF == student.cpf) {
      existe = true
    }
  })
  return existe
}

function checkCpf(strCPF) {
  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF == "00000000000") return false;

  for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}

function saveUserInDB() {
  students.push({
    'nome': studentName.value,
    'email': studentEmail.value,
    'cpf': studentCpf.value,
    'curso': studentCurso.value
  })
  saveStudentsDB()
  alert('Aluno cadastrado com sucesso!')
  loadStudents()
}

function loadStudents() {
  students = getStudentsDB()
  tableBody.innerHTML = ''
  students.forEach((student, index) => {
    insertStudent(student, index)
  })
}

function insertStudent(student, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${student.nome}</td>
    <td>${student.email}</td>
    <td>${student.cpf}</td>
    <td>${student.curso}</td>
    <td class="acao">
      <button onclick="deleteStudent(${index})"><i class="fa fa-trash-o" style="font-size:24px;color:red"></i></button>
    </td>
  `
  tableBody.appendChild(tr)
}

function deleteStudent(index) {
  students.splice(index, 1)
  saveStudentsDB()
  loadStudents()
  alert('Estudante excluido com sucesso!')
}

/* data base actions */
const saveStudentsDB = () => localStorage.setItem('abc', JSON.stringify(students))
const getStudentsDB = () => JSON.parse(localStorage.getItem('abc')) ?? []

loadStudents()