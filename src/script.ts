const modal = document.getElementById("modal") as HTMLElement;
const openBtn = document.getElementById("openModal") as HTMLButtonElement;
const closeBtn = document.getElementById("closeModal") as HTMLButtonElement;
const usersBlock = document.getElementById("users") as HTMLElement;

// Відкрити модальне
openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Закрити модальне
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Scroll event
window.addEventListener("scroll", () => {
    console.log("Сторінку прокручено!");
});

// Fetch API
async function loadUsers(): Promise<void> {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users: Array<{ id: number; name: string }> = await response.json();

    usersBlock.innerHTML = users
        .map(user => `<p>${user.id}. ${user.name}</p>`)
        .join("");
}

loadUsers();
