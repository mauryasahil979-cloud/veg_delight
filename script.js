let cart = [];
const DELIVERY_FEE = 40;


const loginBtn = document.getElementById("loginBtn");
const loginBox = document.getElementById("loginBox");

if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        if (loginBox.style.display === "block") {
            loginBox.style.display = "none";
        } else {
            loginBox.style.display = "block";
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

// Place Order
const placeOrder = document.querySelector(".place-order");

if (placeOrder) {

    placeOrder.addEventListener("click", () => {

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;

        }

        const orderHistory = document.getElementById("orderHistory");

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


updateCart();
loadOrders();