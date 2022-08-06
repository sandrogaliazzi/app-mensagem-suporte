import {
  deleteMessage,
  saveMessage,
  getMessagesByCategory,
  getAllCategories,
  getMessage,
  getAllMessages,
} from "./Model";

import { Modal } from "bootstrap";

// container onde serão injetadas as mensagens
const containerRef = document.querySelector("#messages-container");

// Modal com fommulário para adicionar/editar nova mensagem
const modalRef = document.querySelector("#addMessageModal");

// referência do <form> do modal
const formRef = document.querySelector("#modalForm");

// inputs do formulário
const inputTitleField = document.querySelector("#messageTitle");
const inputMessageField = document.querySelector("#messageContent");
const inputIdField = document.querySelector("#messageId");
const categoryListField = document.querySelectorAll("#category > option");

// modal com as mensagens rápidas adicionadas
const quickMessagesList = document.querySelector("#quickMessagesList");
const quickMessagesModal = document.querySelector("#quickMessages");

// modal com o form de pesquisa para buscar mensagens
const searchModal = document.querySelector("#searchModal");
const searchBar = document.querySelector("#searchBar");
const searchResultsContainer = document.querySelector("#searchList");

// array com todas as mensagens armazenadas
const storeMessages = [];

// instancias dos modais de pesquisa e mensagens rápidas
const searchModalInstace = new Modal(searchModal);
const quickMessagesModalInstance = new Modal(quickMessagesModal);

// função que transforma a primeira lentra em maiúscula
const capitalize = (word) => {
  const lower = word.toLowerCase();
  return word.charAt(0).toUpperCase() + lower.slice(1);
};

// função para renderizar a lista de mensagens rápidas dentro do modal
const renderQuickMessages = () => {
  const quickMessages = storeMessages.filter((message) => message.quickMessage);
  quickMessages.forEach((message) => {
    let lisItem = `<li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold">${message.messageTitle}</div>
      <p style="white-space: pre-line; user-select:all;">${message.messageContent}</p>
    </div>
  </li>`;

    quickMessagesList.innerHTML += lisItem;
  });
};

const sliceTxt = (txt, id) => {
  const txtToArray = txt.split(" ");

  const textDiplay = txtToArray.slice(0, 60).join(" ");

  const textHide = txtToArray.slice(60).join(" ");

  return `${textDiplay}<span id="txtHide-${id}" class="d-none txt-hide">${textHide}</span>
  <button type="button" class="btn btn-link" data-id="${id}" data-action-type="readMore">...Ler mais</button>`;
};

//função que rendereiza os cards com as mensagens
const renderCards = (array) => {
  let cards = "";

  for (let i = 0; i < array.length; i++) {
    const { messageTitle, messageContent, id } = array[i];

    let textSize = messageContent.split(" ").length;

    cards += `<div class="card my-card">
    <div class="card-body d-flex flex-column justify-content-between">
      <div>
        <h5 class="card-title d-block">${messageTitle}</h5>
        <p class="card-text overflow-auto" style="white-space: pre-line;">${
          textSize > 60 ? sliceTxt(messageContent, id) : messageContent
        }</p>
      </div>
      <button data-action-type="copy" data-id="${id}" 
        class="btn btn-primary btn-copy align-self-start mt-3">
          copiar
      </button>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <button
        class="btn btn-sm btn-outline-danger mx-3 btn-delete"
        data-action-type="delete" data-id="${id}"
      >
        <i class="bi bi-trash-fill"></i>
        Excluir
      </button>
      <button class="btn btn-sm btn-outline-info btn-update" 
        data-action-type="update" data-id="${id}"
        data-bs-toggle="modal"
        data-bs-target="#addMessageModal"
      ">
        <i class="bi bi-pencil-fill"></i>
        Editar
      </button>
    </div>
  </div>`;
  }

  return cards;
};

//renderiza os cards com as mensagens organizadas por seções
const renderMessages = (array) => {
  containerRef.innerHTML = "";

  for (let i = 0; i < array.length; i++) {
    let { section, messages } = array[i];

    containerRef.innerHTML += `<h4 class="pt-4">${capitalize(section)}#</h4>
    <hr>
    <section class="p-4 section-container" id="${section
      .replace(" ", "-")
      .toLocaleLowerCase()}">
      ${renderCards(messages)}  
    </section>`;
  }

  setEventHandlers();
  renderQuickMessages();
};

// organiza as seções por categoria e chama a função renderMessages
const renderSectionsByCategory = async () => {
  let categories = [];

  await getAllCategories(categories);
  await getAllMessages(storeMessages);

  let orderedMessages = [];
  let categoryCounter = categories.length;

  categories.forEach(async (category) => {
    let messages = [];

    await getMessagesByCategory(messages, category.priority);

    if (messages.length != 0) {
      orderedMessages.push({
        section: category.name,
        messages,
      });
    }

    categoryCounter--;

    if (categoryCounter == 0) {
      renderMessages(orderedMessages);
      return;
    }
  });
};

const setCopyEventOnBtn = (btn, id) => {
  btn.addEventListener("click", () => {
    copyTextToClipBoard(id);

    toggleBtnClass(btn);

    setTimeout(() => {
      toggleBtnClass(btn);
    }, 2000);
  });
};

const setDeleteEventOnBtn = (btn, id) => {
  btn.addEventListener("click", async () => {
    if (confirm("Deseja excluir permanentemente essa mensagem?")) {
      await deleteMessage(id);

      alert("mensagem excluida!");

      renderSectionsByCategory();
    }
  });
};

const setUpdateEventOnBtn = (btn, id) => {
  btn.addEventListener("click", async () => {
    const { messageTitle, messageContent, category } = await getMessage(id);

    inputIdField.value = id;

    inputTitleField.value = messageTitle;

    inputMessageField.value = messageContent;

    for (const item of categoryListField) {
      let categoryName = item.value.split("-")[0];
      categoryName == category.name
        ? item.setAttribute("selected", "selected")
        : item.removeAttribute("selected");
    }
  });
};

const setReadMoreOnBtn = (btn, id) => {
  btn.addEventListener("click", () => {
    const span = document.querySelector(`#txtHide-${id}`);

    span.classList.toggle("d-none");

    btn.innerText = span.classList.contains("d-none")
      ? "...Ler mais"
      : "Ler Menos";
  });
};

// adiciona o eventos e funções aos botões de ações dentro dos cards
const setEventHandlers = () => {
  const buttons = Array.from(document.getElementsByTagName("button")).filter(
    (button) =>
      button.classList.contains("btn-copy") ||
      button.classList.contains("btn-delete") ||
      button.classList.contains("btn-update") ||
      button.classList.contains("btn-link")
  );

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];

    let id = button.dataset.id;
    let action = button.dataset.actionType;

    switch (action) {
      case "copy":
        setCopyEventOnBtn(button, id);
        break;

      case "delete":
        setDeleteEventOnBtn(button, id);
        break;

      case "update":
        setUpdateEventOnBtn(button, id);
        break;

      case "readMore":
        setReadMoreOnBtn(button, id);
        break;
    }
  }
};

//copia o texto da mensagem para area de transferência recebendo o id da mensagem
const copyTextToClipBoard = (id) => {
  const message = storeMessages.find((message) => message.id == id);

  navigator.clipboard.writeText(message.messageContent);
};

//alterna a classe do botão de copiar
const toggleBtnClass = (btn) => {
  btn.classList.toggle("btn-primary");

  btn.classList.toggle("btn-success");

  btn.innerText = btn.classList.contains("btn-primary") ? "copiar" : "copiado";
};

//captura o evento de enviar do formulário e grava ou atualiza uma mensagem no banco
formRef.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(formRef);

  const id = formData.get("messageId");

  const message = {
    messageTitle: formData.get("messageTitle"),
    messageContent: formData.get("messageContent"),
    category: {
      id: parseInt(formData.get("category").split("-")[1]),
      name: formData.get("category").split("-")[0],
    },
  };

  !id ? saveMessage(message) : saveMessage(message, id);

  inputIdField.value = "";
  formRef.reset();

  Modal.getInstance(modalRef).hide();

  renderSectionsByCategory();
});

// captura o evento do formulário de pesquisa e filtra as mensagens com base no titulo renderizando a lista dentro do modal
searchBar.addEventListener("keyup", () => {
  const filterdMessages = storeMessages.filter(
    (message) =>
      message.messageTitle
        .toLowerCase()
        .indexOf(searchBar.value.toLocaleLowerCase()) > -1
  );

  searchResultsContainer.innerHTML = "";

  filterdMessages.forEach((message) => {
    let lisItem = `<li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold">${message.messageTitle}</div>
      <p style="white-space: pre-line; user-select:all;">${message.messageContent}</p>
    </div>
  </li>`;

    searchResultsContainer.innerHTML += lisItem;
  });
});

renderSectionsByCategory();

// abre o modal de pesquisa ou mensagem rápida com base no atalho do teclado
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLocaleLowerCase() === "f") {
    searchModalInstace.toggle();
  } else if (e.shiftKey && e.key.toLocaleLowerCase() === "d") {
    quickMessagesModalInstance.toggle();
  }
});

// reseta o formulário quando o modal é fechado
modalRef.addEventListener("hidden.bs.modal", () => {
  formRef.reset();
  inputIdField.value = "";
});
