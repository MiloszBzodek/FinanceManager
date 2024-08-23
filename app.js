document.addEventListener('DOMContentLoaded', function() {
    // Klasa reprezentująca pojedynczą transakcję
    class Transaction {
        constructor(description, amount) {
            this.description = description; // Opis transakcji
            this.amount = amount; // Kwota transakcji
        }

        // Metoda sprawdzająca, czy transakcja jest dochodem
        isIncome() {
            return this.amount > 0;
        }

        // Metoda sprawdzająca, czy transakcja jest wydatkiem
        isExpense() {
            return this.amount < 0;
        }
    }

    // Klasa do zarządzania finansami (transakcjami)
    class FinanceManager {
        constructor() {
            this.transactions = []; // Tablica przechowująca wszystkie transakcje
        }

        // Dodawanie nowej transakcji do listy
        addTransaction(transaction) {
            this.transactions.push(transaction);
        }

        // Obliczanie całkowitego salda na podstawie transakcji
        getBalance() {
            return this.transactions.reduce((total, transaction) => total + transaction.amount, 0);
        }

        // Zwracanie listy wszystkich transakcji
        getTransactions() {
            return this.transactions;
        }
    }

    // Klasa reprezentująca pojedynczą subskrypcję
    class Subscription {
        constructor(description, amount, date) {
            this.description = description; // Opis subskrypcji
            this.amount = amount; // Kwota subskrypcji
            this.startDate = new Date(date); // Data rozpoczęcia subskrypcji
            this.subscriptionLength = 31; // Długość subskrypcji w dniach (domyślnie 31 dni)
        }

        // Obliczanie liczby dni pozostałych do końca subskrypcji
        getRemainingDays() {
            const currentDate = new Date(); // Aktualna data
            const elapsedDays = Math.floor((currentDate - this.startDate) / (1000 * 60 * 60 * 24)); // Liczba dni, które minęły od rozpoczęcia subskrypcji

            const remainingDays = this.subscriptionLength - elapsedDays;
            return remainingDays > 0 ? remainingDays : 0; // Zwróć liczbę dni (nie mniej niż 0)
        }

        // Odnawianie subskrypcji (resetowanie daty rozpoczęcia)
        renewSubscription() {
            this.startDate = new Date(); // Resetowanie daty subskrypcji do aktualnej daty
        }
    }

    // Klasa do zarządzania wszystkimi subskrypcjami
    class SubscriptionManager {
        constructor() {
            this.subscriptions = []; // Tablica przechowująca wszystkie subskrypcje
        }

        // Dodawanie nowej subskrypcji
        addSubscription(subscription) {
            this.subscriptions.push(subscription);
        }

        // Usuwanie subskrypcji z listy
        removeSubscription(index) {
            this.subscriptions.splice(index, 1); // Usunięcie subskrypcji na podstawie indeksu
        }

        // Zwracanie listy wszystkich subskrypcji
        getSubscriptions() {
            return this.subscriptions;
        }

        // Sprawdzanie, czy któraś z subskrypcji wygasła i jej automatyczne odnowienie
        checkAndRenewSubscriptions(financeManager) {
            this.subscriptions.forEach(subscription => {
                if (subscription.getRemainingDays() === 0) {
                    subscription.renewSubscription(); // Odnowienie subskrypcji
                    const renewalTransaction = new Transaction(`Odnowienie subskrypcji: ${subscription.description}`, -subscription.amount); // Dodanie transakcji związanej z odnowieniem
                    financeManager.addTransaction(renewalTransaction); // Dodanie transakcji do finansów
                }
            });
        }
    }

    // Inicjalizacja obiektu do zarządzania finansami
    const financeManager = new FinanceManager();
    const transactionForm = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const balanceElement = document.querySelector('.balance');

    // Funkcja do aktualizacji salda na ekranie
    function updateBalance() {
        const balance = financeManager.getBalance();
        balanceElement.textContent = `Saldo: ${balance.toFixed(2)} PLN`;
    }

    // Funkcja do aktualizacji listy transakcji na ekranie
    function updateTransactionList() {
        transactionList.innerHTML = ''; // Czyszczenie listy przed aktualizacją

        financeManager.getTransactions().forEach(transaction => {
            const listItem = document.createElement('li');
            listItem.classList.add('transaction-item');

            // Dodawanie odpowiedniej klasy dla dochodu lub wydatku
            if (transaction.isIncome()) {
                listItem.classList.add('income');
            } else if (transaction.isExpense()) {
                listItem.classList.add('expense');
            }

            listItem.textContent = `${transaction.description}: ${transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)} PLN`;

            transactionList.appendChild(listItem);
        });
    }

    // Obsługa formularza dodawania nowej transakcji
    transactionForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Zapobiega domyślnemu przesłaniu formularza

        const description = document.getElementById('description').value; // Pobranie opisu
        const amount = parseFloat(document.getElementById('amount').value); // Pobranie kwoty

        const transaction = new Transaction(description, amount); // Tworzenie nowej transakcji
        financeManager.addTransaction(transaction); // Dodanie transakcji do menedżera finansów

        updateTransactionList(); // Aktualizacja listy transakcji
        updateBalance(); // Aktualizacja salda

        transactionForm.reset(); // Czyszczenie formularza
    });

    // Inicjalna aktualizacja salda i listy transakcji
    updateBalance();
    updateTransactionList();

    // Inicjalizacja obiektu do zarządzania subskrypcjami
    const subscriptionManager = new SubscriptionManager();
    const subscriptionForm = document.getElementById("subscription-form");
    const subscriptionList = document.getElementById("subscription-list");

    // Funkcja do aktualizacji listy subskrypcji na ekranie
    function updateSubscriptionList() {
        subscriptionList.innerHTML = ""; // Czyszczenie listy przed aktualizacją

        subscriptionManager.getSubscriptions().forEach((subscription, index) => {
            const listSubItem = document.createElement("li");
            listSubItem.classList.add("subscription-item");

            // Wyświetlanie informacji o subskrypcji
            listSubItem.textContent = `${subscription.description}: ${subscription.amount.toFixed(2)} PLN, Pozostałe dni: ${subscription.getRemainingDays()}`;

            // Dodanie przycisku do usunięcia subskrypcji
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Usuń";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", function() {
                subscriptionManager.removeSubscription(index); // Usuwanie subskrypcji
                updateSubscriptionList(); // Aktualizacja listy po usunięciu
            });

            listSubItem.appendChild(deleteButton); // Dodanie przycisku do elementu listy
            subscriptionList.appendChild(listSubItem); // Dodanie subskrypcji do listy na ekranie
        });
    }

    // Obsługa formularza dodawania nowej subskrypcji
    subscriptionForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Zapobiega domyślnemu przesłaniu formularza

        const description = document.getElementById("subDescription").value; // Pobranie opisu subskrypcji
        const amount = parseFloat(document.getElementById('subAmount').value); // Pobranie kwoty subskrypcji
        const date = document.getElementById("subDate").value; // Pobranie daty subskrypcji

        const subscription = new Subscription(description, amount, date); // Tworzenie nowej subskrypcji
        subscriptionManager.addSubscription(subscription); // Dodanie subskrypcji do menedżera subskrypcji

        // Tworzenie transakcji związanej z dodaniem subskrypcji
        const subscriptionTransaction = new Transaction(`Subskrypcja: ${description}`, -amount);
        financeManager.addTransaction(subscriptionTransaction); // Dodanie transakcji do menedżera finansów

        updateSubscriptionList(); // Aktualizacja listy subskrypcji
        updateTransactionList(); // Aktualizacja listy transakcji
        updateBalance(); // Aktualizacja salda

        subscriptionForm.reset(); // Czyszczenie formularza
    });

    // Funkcja do okresowego sprawdzania i odnawiania subskrypcji
    setInterval(function() {
        subscriptionManager.checkAndRenewSubscriptions(financeManager); // Sprawdzanie i odnawianie subskrypcji
        updateSubscriptionList(); // Aktualizacja listy subskrypcji
        updateTransactionList(); // Aktualizacja listy transakcji
        updateBalance(); // Aktualizacja salda
    }, 1000 * 60 * 60 * 24); // Sprawdzenie codziennie (co 24 godziny)

    // Inicjalna aktualizacja listy subskrypcji
    updateSubscriptionList();
});
