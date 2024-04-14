document.addEventListener("DOMContentLoaded", function() {
    const listPanel = document.getElementById('list-panel');
    const showPanel = document.getElementById('show-panel');

    // Function to render book details
    function renderBookDetails(book) {
        const usersList = book.users.map(user => `<li>${user.username}</li>`).join('');
        showPanel.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.img_url}" alt="${book.title}">
            <p>${book.description}</p>
            <h3>Users who liked this book:</h3>
            <ul>${usersList}</ul>
            <button class="like-btn" data-book-id="${book.id}">Like</button>
        `;
    }

    // Function to fetch book details by ID
    function fetchBookDetails(bookId) {
        return fetch(`http://localhost:3000/books/${bookId}`)
            .then(response => response.json())
            .catch(error => console.error('Error fetching book details:', error));
    }

    // Fetch and display list of books
    fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(books => {
            const list = document.getElementById('list');
            books.forEach(book => {
                const listItem = document.createElement('li');
                listItem.textContent = book.title;
                listItem.addEventListener('click', () => renderBookDetails(book));
                list.appendChild(listItem);
            });
        });

    // Event listener for like button
    showPanel.addEventListener('click', event => {
        if (event.target.classList.contains('like-btn')) {
            const bookId = event.target.dataset.bookId;
            fetchBookDetails(bookId)
                .then(book => {
                    const likedUsers = book.users;
                    const currentUserId = 1; // Assuming current user's ID is 1
                    if (!likedUsers.some(user => user.id === currentUserId)) {
                        likedUsers.push({ id: currentUserId, username: 'pouros' });
                        fetch(`http://localhost:3000/books/${bookId}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ users: likedUsers }),
                        })
                            .then(response => response.json())
                            .then(updatedBook => renderBookDetails(updatedBook))
                            .catch(error => console.error('Error updating liked users:', error));
                    } else {
                        // User already liked the book
                        console.log('You already liked this book.');
                    }
                })
                .catch(error => console.error('Error fetching book details:', error));
        }
    });
});
