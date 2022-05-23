// import { DateTime } from './luxon.js';
const { DateTime } = window.luxon;
class Book {
  static books = [];

  constructor(title, author) {
    this.title = title;
    this.author = author;
  }

  static addBook(book) {
    this.books.push(book);
  }

  static rmvBook(rmvBook) {
    this.books = this.books.filter((book) => book !== rmvBook);
  }
}

const form = document.querySelector('#form');
const title = form.elements[0];
const author = form.elements[1];
const addBtn = document.querySelector('#add-btn');
const bookList = document.querySelector('#book-list');
const listNav = document.querySelector('#list-nav-item');
const addNav = document.querySelector('#add-nav-item');
const contactNav = document.querySelector('#contact-nav-item');
const navItems = [listNav, addNav, contactNav];
const listSection = document.querySelector('#list-section');
const addSection = document.querySelector('#add-section');
const contactSection = document.querySelector('#contact-section');
const sections = [listSection, addSection, contactSection];
const date = document.querySelector('#date');
const sucessMsg = document.querySelector('#success-msg');

function saveBooksLocally() {
  localStorage.setItem('books', JSON.stringify(Book.books));
}

function saveActiveNavItemLocally(id) {
  localStorage.setItem('activeNavItem', id);
}

const appendBook = (book, index) => {
  const bookElement = document.createElement('tr');
  const td = document.createElement('td');
  td.classList.add('border-0', 'd-flex', 'justify-content-end');
  const rmvBtn = document.createElement('button');
  rmvBtn.classList.add('remove-button', 'btn', 'btn-danger', 'btn-sm');
  rmvBtn.innerText = 'Remove';

  td.appendChild(rmvBtn);

  bookElement.innerHTML = `<td class="align-middle border-0">"${book.title}" by ${book.author}</td>`;
  bookElement.appendChild(td);

  bookList.appendChild(bookElement);
  saveBooksLocally();

  const rmvBook = Book.books[index];
  rmvBtn.addEventListener('click', () => {
    bookElement.remove();
    Book.rmvBook(rmvBook);
    saveBooksLocally();
  });
};

function appendAllBooks() {
  Book.books.forEach((book, index) => {
    appendBook(book, index);
  });
}

function updateDate() {
  date.innerHTML = DateTime.now().toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
}

function displaySection(id) {
  sections.forEach((section) => {
    if (section.id === id) {
      section.classList.remove('d-none');
    } else {
      section.classList.add('d-none');
    }
  });
}

function activateNavItem(id) {
  navItems.forEach((navItem) => {
    if (navItem.id === id) {
      navItem.classList.add('active');
    } else {
      navItem.classList.remove('active');
    }
  });
}

function getSectionId(navItemId) {
  let sectionId;
  switch (navItemId) {
    case 'list-nav-item':
      sectionId = 'list-section';
      break;
    case 'add-nav-item':
      sectionId = 'add-section';
      break;
    case 'contact-nav-item':
      sectionId = 'contact-section';
      break;
    default:
      sectionId = '';
  }
  return sectionId;
}

window.addEventListener('load', () => {
  updateDate();
  const navItemId = localStorage.getItem('activeNavItem');
  const sectionId = getSectionId(navItemId);
  displaySection(sectionId);
  activateNavItem(navItemId);
  Book.books = JSON.parse(localStorage.getItem('books'));
  if (Book.books) {
    appendAllBooks();
  } else {
    Book.books = [];
  }
});

addBtn.addEventListener('click', () => {
  sucessMsg.innerText = '';
  if (title.value.length !== 0 && author.value.length !== 0) {
    const newBook = new Book(title.value, author.value);
    Book.addBook(newBook);
    appendBook(newBook, Book.books.length - 1);
    sucessMsg.innerText = `"${title.value}" by ${author.value} added`;
  }
  title.value = '';
  author.value = '';
});

listNav.addEventListener('click', () => {
  displaySection(listSection.id);
  activateNavItem(listNav.id);
  saveActiveNavItemLocally(listNav.id);
});

addNav.addEventListener('click', () => {
  displaySection(addSection.id);
  activateNavItem(addNav.id);
  saveActiveNavItemLocally(addNav.id);
});

contactNav.addEventListener('click', () => {
  displaySection(contactSection.id);
  activateNavItem(contactNav.id);
  saveActiveNavItemLocally(contactNav.id);
});

setInterval(() => {
  updateDate();
}, 1000);
