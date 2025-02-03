/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';
  
  /** ✨ CONSTANTS ✨ **/
  const select = {
    templateOf: {
      book: "#template-book",
    },
    containerOf: {
      booksList: ".books-list",
      filters: ".filters",
    },
    all: {
      inputs: ".filters input",
    },
    book: {
      image: ".book__image",
      rating: ".book__rating",
      ratingFill: ".book__rating__fill",
    },
  };
  
  const classnames = {
    bookFavorite: "favorite",
    hidden: "hidden",
  };
  
  const settings = {
    ratingMax: 10,
  };
  
  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };
  
  /** 🎨 CLASS FOR BOOKS APP **/
  
  class BooksApp {
    constructor() {
      const thisBooksApp = this;
      thisBooksApp.initData();
      thisBooksApp.render();
      thisBooksApp.initActions();
    }
  
    /** 📚 Pobieranie danych książek */
    initData() {
      const thisBooksApp = this;
      thisBooksApp.data = dataSource.books;
      thisBooksApp.filters = [];
      thisBooksApp.favoriteBooks = [];
    }
  
    /** 🎨 Renderowanie książek na stronie */
    render() {
      const thisBooksApp = this;
      const booksListContainer = document.querySelector(select.containerOf.booksList);
  
      for (let book of thisBooksApp.data) {
        // Obliczanie wartości ratingWidth
        const ratingWidth = (book.rating / settings.ratingMax) * 100;
        // Ustalenie odpowiedniego tła dla paska ocen
        const ratingBgc = thisBooksApp.determineRatingBgc(book.rating);

        // Przekazanie nowych zmiennych do szablonu
        const generatedHTML = templates.book({
            id: book.id,
            name: book.name,
            author: book.author,
            genre: book.genre,
            image: book.image,
            rating: book.rating,
            ratingWidth: ratingWidth,
            ratingBgc: ratingBgc,
          });

        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
        booksListContainer.appendChild(generatedDOM);
      }
    }
    
    // Funkcja do określania tła paska w zależności od wartości ratingu
    determineRatingBgc(rating) {
      if (rating < 6) {
        return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      } else if (rating >= 6 && rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
      }
    }
    /** 🎯 Dodawanie interakcji */
    initActions() {
      const thisBooksApp = this;
      const booksListContainer = document.querySelector(select.containerOf.booksList);
      const filtersForm = document.querySelector(select.containerOf.filters);
      
      // Nasłuchiwacz na kliknięcia checkboxów w formularzu
      filtersForm.addEventListener('click', (event) => {
        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
          const filterValue = event.target.value;

          if (event.target.checked) {
            thisBooksApp.filters.push(filterValue); // Dodajemy do filtrów
          } else {
            const index = thisBooksApp.filters.indexOf(filterValue);
            if (index !== -1) {
              thisBooksApp.filters.splice(index, 1); // Usuwamy z filtrów
            }
          }

          console.log('Aktualne filtry:', thisBooksApp.filters);
          thisBooksApp.filterBooks(); // Wywołanie funkcji filtrującej książki
        }
      });

      // Nasłuchiwacz na kliknięcia książek (dodawanie do ulubionych)
      booksListContainer.addEventListener("dblclick", function (event) {
        event.preventDefault();

        // Szukamy najbliższego rodzica z klasą .book__image (bo klikamy w img)
        const clickedElement = event.target.closest(select.book.image);

        if (clickedElement) {
          const bookId = clickedElement.getAttribute("data-id");

          if (thisBooksApp.favoriteBooks.includes(bookId)) {
            // Jeśli książka już jest w ulubionych → usuń
            thisBooksApp.favoriteBooks.splice(thisBooksApp.favoriteBooks.indexOf(bookId), 1);
            clickedElement.classList.remove(classnames.bookFavorite);
            console.log(`Książka o ID ${bookId} została usunięta z ulubionych.`, thisBooksApp.favoriteBooks);
          } else {
            // Jeśli książki nie ma → dodaj
            thisBooksApp.favoriteBooks.push(bookId);
            clickedElement.classList.add(classnames.bookFavorite);
            console.log(`Książka o ID ${bookId} została dodana do ulubionych.`, thisBooksApp.favoriteBooks);
          }
        }
      });
    }
    
    /** 🎯 Funkcja filtrująca książki */
    filterBooks() {
      const thisBooksApp = this;
      // Przechodzimy po wszystkich książkach
      thisBooksApp.data.forEach((book) => {
        let shouldBeHidden = false; // Na początku zakładamy, że książka nie powinna być ukryta
  
        // Sprawdzamy, czy książka spełnia warunki filtrów
        for (const filter of thisBooksApp.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true; // Jeśli filtr nie pasuje, ukrywamy książkę
            break; // Jeśli już nie pasuje, przerywamy dalsze sprawdzanie
          }
        }
  
        // Znajdowanie książki po jej ID
        const bookImage = document.querySelector(`.book__image[data-id="${book.id}"]`);
          
        // Ukrywanie książki, jeśli warunek spełniony
        if (shouldBeHidden) {
          bookImage.classList.add(classnames.hidden);
        } else {
          bookImage.classList.remove(classnames.hidden);
        }
      });
    }

    
  }
  
  new BooksApp(); // Uruchomienie aplikacji
}
  
