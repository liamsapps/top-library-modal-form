const myLibrary = [];
const h1 = document.querySelector("h1");
const books = document.querySelector("#books");
const btnAdd = document.querySelector("#add");
const myForm = document.querySelector("#my_form");
const formMsg = document.querySelector("#message");
const bTitle = document.querySelector("#book_title");
const bAuthor = document.querySelector("#book_author");
const bPages = document.querySelector("#book_pages");
const bRead = document.querySelector("#book_read");
const btnSubmit = document.querySelector("#submit");
const btnCancel = document.querySelector("#cancel");
const dialog = document.querySelector("#formDialog");

document.addEventListener("DOMContentLoaded", (event) => {    
    loadBooks();
});

btnAdd.addEventListener('click', () => {
    dialog.showModal();    
    // disable button ("Add to Collection") 
    formDisplay();
});

btnCancel.addEventListener("click", () => {    
    dialog.close();    
    // enable button ("Add to Collection") 
    formDisplay();
    formReset();
});

dialog.addEventListener('submit', (event) => {    
    event.preventDefault();
    
    if (myForm.checkValidity()) {
        // Form is valid
        const bookCheck = addBookToLibrary(bTitle.value, bAuthor.value, bPages.value, bRead.value);

        // books already exists
        if (bookCheck) {
            // enable use of margin in CSS to better separate message from label (book title)
            formMsg.style.cssText = "display: inline-block; margin-bottom: 1rem;";
            formMsg.textContent = `${bTitle.value} by ${bAuthor.value} already exists. Try again.`;
        }
        else {
            // if new book added OR cancelled
            formReset();

            // enable button ("Add to Collection") 
            formDisplay();
        
            loadBooks(); 

            dialog.close();
        }    
    }       
});

function GenerateGuid() {
    if (self && self.crypto && typeof self.crypto.randomUUID === 'function') {
        const uuid = self.crypto.randomUUID();         
        return uuid;
    } else {
        console.log("self.crypto not available");
    }
}

function Book(title, author, pages, read) {
    this.id = GenerateGuid();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {        
        console.log(`ID: ${this.id}`);
        console.log(`${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "read": "not read yet"}`);        
    }
}

Book.prototype.toggleRead = function() {
    this.read = this.read === 'yes' ? 'no' : 'yes';
}

function addBookToLibrary(title, author, pages, read) {
    const bookFound = myLibrary.findIndex(book => book.title === title && book.author === author);
    if (bookFound !== -1) {
        return true;
    }
    else {
        myLibrary.unshift(new Book(title, author, pages, read));  
        return false;      
    }
}

function removeBookFromLibrary(event, bookID) {    
    const bookIndex = myLibrary.findIndex(book => book.id === bookID);
    myLibrary.splice(bookIndex, 1);
    
    loadBooks();
}

function formDisplay() {    
    if (btnAdd.disabled === false) {        
        btnAdd.disabled = true; 
        document.body.classList.toggle("dim");        
        h1.style.cssText = "color: white";        
    }
    else {
        btnAdd.disabled = false;
        document.body.classList.toggle("dim");        
        h1.style.cssText = "color: black";        
    }    
}

function formReset() {
    // reset span to prevent added space between empty message and label (book title)    
    formMsg.style.cssText = "display: inline;";
    formMsg.textContent = "";
    bTitle.value = "";
    bAuthor.value = "";
    bPages.value = "";
    bRead.value = "";
}

function loadBooks() {
    while (books.hasChildNodes()) {
        books.removeChild(books.firstChild);
    }

    myLibrary.forEach((item) => {            
        const bookCard = document.createElement("div");
        bookCard.className = "card";

        const listHolder = document.createElement("div");
        listHolder.className = "book_list";
        const list = document.createElement("ul");

        // const bookID = document.createElement("li");
        // bookID.textContent = item.id;
        
        const bookTitle = document.createElement("li");
        bookTitle.textContent = item.title;

        const bookAuthor = document.createElement("li");
        bookAuthor.textContent = item.author;

        const bookPages = document.createElement("li");
        bookPages.textContent = item.pages;

        const bookRead = document.createElement("li");        
        bookRead.textContent = (item.read === "yes") ? "read" : "not read"; 
        bookRead.className = (item.read === "yes") ? "book_read" : "book_not_read";      
        
        const items = [bookTitle, bookAuthor, bookPages, bookRead];        
        items.forEach(item => list.appendChild(item));

        listHolder.appendChild(list);
        bookCard.appendChild(listHolder);        

        const buttonHolder = document.createElement("div");
        buttonHolder.className = "book_buttons";
                
        const bookBtnRead = document.createElement("button");
        bookBtnRead.textContent = "Read ?";
        bookBtnRead.addEventListener("click", () => {
            item.toggleRead()
            loadBooks();
        });        

        const bookBtnDelete = document.createElement("button");
        bookBtnDelete.textContent = "Delete";        
        bookBtnDelete.addEventListener("click", (event) => removeBookFromLibrary(event, item.id));      
        
        buttonHolder.appendChild(bookBtnRead);
        buttonHolder.appendChild(bookBtnDelete);
        bookCard.appendChild(buttonHolder);

        books.appendChild(bookCard);        
    });
}

// test data
addBookToLibrary("Utopia", "Sir Thomas More", 359, "yes");
addBookToLibrary("Pillars of the Earth", "Ken Follett", 806, "yes");
addBookToLibrary("The Catcher in the Rye", "J.D. Salinger", 277, "no");
addBookToLibrary("1984", "George Orwell", 328, "yes");
addBookToLibrary("A Canticle for Leibowitz", "Walter M. Miller Jr.", 320, "yes");
addBookToLibrary("Animal Farm", "George Orwell", 122, "yes");
addBookToLibrary("War and Peace", "Leo Tolstoy", 1225, "no");
addBookToLibrary("Brave New World", "Aldous Huxley", 268, "yes");
addBookToLibrary("Moby Dick", "Herman Melville", 635, "no");

// addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, "yes");
// addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180, "yes");
// addBookToLibrary("Lord of the Flies", "William Golding", 224, "no");







