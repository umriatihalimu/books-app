const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const yearNon = document.getElementById("inputBookYear").value; //yearNon itu year yg tipe datanya masih string, sebentar diubah ke year number

  const checkboxIsComplete = document.getElementById("inputBookIsComplete");

  // Menentukan apakah checkbox belum dicentang
  const isNotComplete = !checkboxIsComplete.checked;

  // Mengatur nilai variabel inputIsComplete sesuai dengan kondisi checkbox
  const isComplete = isNotComplete ? false : true;

  const generateID = generateId();

  const bookObject = generateBookObject(
    generateID,
    title,
    author,
    yearNon,
    isComplete
  );

  //   simpan ke array books
  books.push(bookObject);
  bookSaved();
  document.dispatchEvent(new Event(RENDER_EVENT));
}
// untuk id unik
function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, yearNon, isComplete) {
  const year = Number(yearNon);
  return { id, title, author, year, isComplete };
}

document.addEventListener(RENDER_EVENT, function () {
  //   console.log(books);
  const uncompletedReadBook = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedReadBook.innerText = "";

  const completedReadBook = document.getElementById("completeBookshelfList");
  completedReadBook.innerText = "";

  // looping untuk lihat buku blm & sdh dibaca
  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      uncompletedReadBook.append(bookElement);
    } else {
      completedReadBook.append(bookElement);
    }
  }
});

// makeBook(bookItem) adalah pemanggilan fungsi makeBook dengan argumen bookItem.

// Fungsi makeBook parameternya bookObject. Parameter ini hanya merupakan nama variabel lokal yang digunakan di dalam fungsi, dan ia tidak harus memiliki nama yang sama dengan variabel yang digunakan saat memanggil fungsi.
function makeBook(bookObject) {
  const title = document.createElement("h3");
  const author = document.createElement("p");
  const year = document.createElement("p");

  //   untuk elemen button

  const btnDeleteBook = document.createElement("button");
  btnDeleteBook.classList.add("red");

  // div pembungkus button
  const btnContainer = document.createElement("div");
  btnContainer.classList.add("action");

  //   masukkan isi dari tiap elemen
  title.innerText = bookObject.title;
  author.innerText = bookObject.author;
  year.innerText = bookObject.year;

  //   pembungkus article
  const bookList = document.createElement("article");
  bookList.classList.add("book_item");
  bookList.append(title, author, year, btnContainer);

  // const containerBookList = document.createElement("div");
  // containerBookList.classList.add("book_list");
  // containerBookList.append(bookList);

  // pengecakan untuk button
  if (bookObject.isComplete) {
    const btnReadingNotDone = document.createElement("button");
    btnReadingNotDone.innerText = "Belum selesai dibaca";
    btnReadingNotDone.classList.add("green");

    btnReadingNotDone.addEventListener("click", function () {
      addFromList(bookObject.id);
    });

    const btnDeleteBook = document.createElement("button");
    btnDeleteBook.classList.add("red");
    btnDeleteBook.innerText = "Hapus buku";
    btnDeleteBook.addEventListener("click", function () {
      removeFromTrashList(bookObject.id);
    });
    btnContainer.append(btnReadingNotDone, btnDeleteBook);
  } else {
    const btnReadingDone = document.createElement("button");
    btnReadingDone.classList.add("green");
    btnReadingDone.innerText = "Sudah dibaca";
    btnReadingDone.addEventListener("click", function () {
      undoFromTrashList(bookObject.id);
    });

    const btnDeleteBook = document.createElement("button");
    btnDeleteBook.classList.add("red");
    btnDeleteBook.innerText = "Hapus buku";
    btnDeleteBook.addEventListener("click", function () {
      removeFromTrashList(bookObject.id);
    });

    btnContainer.append(btnReadingDone, btnDeleteBook);
  }

  //   jgn lupa klo apa yg mau ditampilkan dilayar pake return
  return bookList;
}

// fungsi hapus dari daftar book (array books)
function removeFromTrashList(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  // hapus 1 array
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  bookSaved();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// fungsi kembalikan ke daftar belum dibaca /sdh dibaca
function undoFromTrashList(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) {
    return;
  }
  // set bookTargetnya
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  bookSaved();
}

function addFromList(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) {
    return;
  }
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  bookSaved();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      // console.log(bookItem);
      return bookItem;
    }
  }
  return null;
}

//  LOCAL STORAGE
// buat key unik
const STORAGE_KEY = "book-key";
const SAVE_EVENT = "save-book";

function isStorageExist() {
  if (typeof Storage == undefined) {
    alert("browser kamu tidak mendukung");
    return false;
  }
  return true;
}

function bookSaved() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVE_EVENT));
  }
}
// jika eventnya diklik
document.addEventListener(SAVE_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
