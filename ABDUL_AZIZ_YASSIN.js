
var cartButtons = document.querySelectorAll(".pro .cart");

cartButtons.forEach(function (button) {
    button.parentElement.addEventListener("click", function () {
        var card = button.closest(".pro");

        var item = {
            name: card.querySelector(".desc span").textContent + " - " + card.querySelector(".desc h5").textContent,
            price: parseFloat(card.querySelector(".desc h4").textContent.replace("RM", "")),
            img: card.querySelector("img").getAttribute("src")
        };

        var cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
    });
});


var cartList = document.getElementById("cart-list");
var orderDone = false;   // becomes true after the customer submits

if (cartList) {
    showCart();
}

function showCart() {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var total = 0;
    var rows = "";

    for (var i = 0; i < cart.length; i++) {
        total = total + cart[i].price;

        rows = rows +
            "<tr>" +
            "<td><img src='" + cart[i].img + "' width='70'></td>" +
            "<td>" + cart[i].name + "</td>" +
            "<td>RM" + cart[i].price.toFixed(2) + "</td>" +
            "<td><button onclick='removeItem(" + i + ")'>Remove</button></td>" +
            "</tr>";
    }

    cartList.innerHTML = rows;
    document.getElementById("cart-total").textContent = "Total: RM" + total.toFixed(2);


    if (cart.length === 0) {
        document.getElementById("empty-text").style.display = "block";
        document.querySelector(".carttable").style.display = "none";
        document.getElementById("cart-total").style.display = "none";
    } else {
        document.getElementById("empty-text").style.display = "none";
        document.querySelector(".carttable").style.display = "table";
        document.getElementById("cart-total").style.display = "block";
    }

    if (cart.length === 0 && !orderDone) {
        document.getElementById("order-summary").style.display = "none";
    } else {
        document.getElementById("order-summary").style.display = "block";
    }
}

function removeItem(index) {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
}


var orderForm = document.getElementById("order-form");

if (orderForm) {
    orderForm.addEventListener("submit", function (event) {
        event.preventDefault();   // stops the page from reloading

        var name = document.getElementById("cust-name").value.trim();
        var phone = document.getElementById("cust-phone").value.trim();
        var address = document.getElementById("cust-address").value.trim();
        var error = document.getElementById("form-error");

        if (name === "") {
            error.textContent = "Please enter your name.";
            return;
        }
        if (!/^[0-9+\- ]{9,15}$/.test(phone)) {
            error.textContent = "Please enter a valid phone number.";
            return;
        }
        if (address === "") {
            error.textContent = "Please enter your address.";
            return;
        }
        error.textContent = "";

        var cart = JSON.parse(localStorage.getItem("cart")) || [];
        var total = 0;
        for (var i = 0; i < cart.length; i++) {
            total = total + cart[i].price;
        }

        var orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push({
            name: name,
            phone: phone,
            address: address,
            items: cart,
            total: total,
            date: new Date().toLocaleString()
        });
        localStorage.setItem("orders", JSON.stringify(orders));

        localStorage.removeItem("cart");
        orderDone = true;
        orderForm.reset();
        orderForm.style.display = "none";
        document.querySelector(".ordersummary h2").style.display = "none";
        document.getElementById("order-message").textContent =
            "Thank you, " + name + "! Your order (RM" + total.toFixed(2) + ") has been received. We will contact you at " + phone + ".";
        showCart();
    });
}