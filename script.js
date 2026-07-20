let cart = [];
const DELIVERY_FEE = 40;
const loginBtn = document.getElementById("loginBtn");
const loginBox = document.getElementById("loginBox");
const signupBox = document.getElementById("signupBox");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        if (loginBox.style.display === "block" || signupBox.style.display === "block") {
            loginBox.style.display = "none";
            signupBox.style.display = "none";
        } else {
            loginBox.style.display = "block";
            signupBox.style.display = "none";
        }
    });
}

if (showSignup) {
    showSignup.addEventListener("click", (e) => {
        e.preventDefault();
        loginBox.style.display = "none";
        signupBox.style.display = "block";
    });
}

if (showLogin) {
    showLogin.addEventListener("click", (e) => {
        e.preventDefault();
        signupBox.style.display = "none";
        loginBox.style.display = "block";
    });
}

const submitSignup = document.getElementById("submitSignup");
if (submitSignup) {
    submitSignup.addEventListener("click", () => {
        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const mobile = document.getElementById("signupMobile").value.trim();
        const password = document.getElementById("signupPassword").value;

        if (!name || !email || !mobile || !password) {
            alert("Please fill in all fields (Name, Email, Mobile, and Password).");
            return;
        }

        let users = JSON.parse(localStorage.getItem("vegUsers")) || [];
     
        const exists = users.find(u => u.email === email || u.mobile === mobile);
        if (exists) {
            alert("User already registered with this Email or Mobile number!");
            return;
        }

        users.push({ name, email, mobile, password });
        localStorage.setItem("vegUsers", JSON.stringify(users));
        alert("Registration Successful! Please login.");
        
        signupBox.style.display = "none";
        loginBox.style.display = "block";
    });
}

const submitLogin = document.getElementById("submitLogin");
if (submitLogin) {
    submitLogin.addEventListener("click", () => {
        const identifier = document.getElementById("loginInput").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!identifier || !password) {
            alert("Please enter your Email/Mobile and Password.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("vegUsers")) || [];
        const user = users.find(u => (u.email === identifier || u.mobile === identifier) && u.password === password);

        if (user) {
            alert(`Welcome back, ${user.name}!`);
            loginBox.style.display = "none";
            loginBtn.textContent = user.name.split(" ")[0]; // Update button text to user's first name
        } else {
            alert("Invalid Email/Mobile or Password.");
        }
    });
}

function addToCart(name, price) {
    const item = cart.find(food => food.name === name);

    if (item) {
        item.qty++;
    } else {
        cart.push({
            name: name,
            price: price,
            qty: 1
        });
    }

    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const quantity = document.getElementById("quantity");
    const subtotal = document.getElementById("subtotal");
    const gst = document.getElementById("gst");
    const total = document.getElementById("total");

    cartItems.innerHTML = "";

    let sub = 0;
    let qty = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>No items added.</p>";
    } else {
        cart.forEach((item, index) => {
            sub += item.price * item.qty;
            qty += item.qty;

            cartItems.innerHTML += `
            <div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0;border-bottom:1px solid #ddd;padding-bottom:8px;">
                <span>${item.name} x ${item.qty}</span>
                <span>
                    ₹${item.price * item.qty}
                    <button onclick="removeItem(${index})"
                    style="margin-left:10px;background:red;color:white;border:none;padding:4px 8px;border-radius:5px;cursor:pointer;">
                    X
                    </button>
                </span>
            </div>
            `;
        });
    }

    const gstValue = sub * 0.05;
    const finalTotal = sub + gstValue + DELIVERY_FEE;

    quantity.textContent = qty;
    subtotal.textContent = "₹" + sub.toFixed(2);
    gst.textContent = "₹" + gstValue.toFixed(2);

    if (qty === 0) {
        total.textContent = "₹0.00";
    } else {
        total.textContent = "₹" + finalTotal.toFixed(2);
    }
}

function removeItem(index) {
    if (cart[index].qty > 1) {
        cart[index].qty--;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

const search = document.getElementById("search");
if (search) {
    search.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {
            const name = card.querySelector("h3").textContent.toLowerCase();
            if (name.includes(value)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}

document.querySelectorAll(".buy").forEach(button => {
    button.addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Please add at least one item to the cart.");
            return;
        }
        alert("Fast Order Successful!");
    });
});

const placeOrder = document.querySelector(".place-order");
if (placeOrder) {
    placeOrder.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const order = {
            date: new Date().toLocaleString(),
            items: cart
        };

        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        loadOrders();
        alert("Order Placed Successfully!");
        cart = [];
        updateCart();
    });
}

function loadOrders() {
    const orderHistory = document.getElementById("orderHistory");
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (!orderHistory) return;

    if (orders.length === 0) {
        orderHistory.innerHTML = "No Previous Orders";
        return;
    }

    orderHistory.innerHTML = "";

    orders.forEach((order, i) => {
        let foods = "";
        order.items.forEach(item => {
            foods += `${item.name} (${item.qty})<br>`;
        });

        orderHistory.innerHTML += `
        <div style="background:#f5f5f5;padding:15px;margin-bottom:15px;border-radius:10px;">
            <b>Order ${i + 1}</b><br>
            ${foods}
            <small>${order.date}</small>
        </div>
        `;
    });
}
window.onload = function() {
    loadOrders();
};
