"use strict";
// setup the DOM
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartDOM = document.querySelector(".cart");
const addToCartBtnsDOM = document.querySelectorAll(
	'[data-action="ADD_TO_CART"]'
);

// checking the cart
if (cart.length > 0) {
	cart.forEach((product) => {
		insertElementsInDOM(product);
		countCartTotal();
		addToCartBtnsDOM.forEach((addToCartBtnDOM) => {
			const productDOM = addToCartBtnDOM.parentNode;
			if (
				productDOM.querySelector(".product__name").textContent === product.name
			) {
				handleActionsOnBtns(addToCartBtnDOM, product);
			}
		});
	});
}

// interaction to the DOM
addToCartBtnsDOM.forEach((addToCartBtnDOM) => {
	addToCartBtnDOM.addEventListener("click", (_) => {
		const productDOM = addToCartBtnDOM.parentNode;
		const product = {
			img: productDOM.querySelector(".product__image").getAttribute("src"),
			name: productDOM.querySelector(".product__name").textContent,
			price: productDOM.querySelector(".product__price").textContent,
			quantity: 1,
		};
		const isInCart =
			cart.filter((cartItem) => cartItem.name === product.name).length > 0;
		if (!isInCart) {
			// Add to shopping cart
			insertElementsInDOM(product);
			cart.push(product);
			saveCart();
			handleActionsOnBtns(addToCartBtnDOM, product);
		}
	});
});

// injecting html tags into the DOM
function insertElementsInDOM(product) {
	cartDOM.insertAdjacentHTML(
		"beforeend",
		`
<div class = "cart__item">
<img class = "cart__item__image" src = "${product.img}" alt = "${product.name}">
<h3 class = "cart__item__name">${product.name}</h3>
<h3 class = "cart__item__price">${product.price}</h3>
<button class="btn btn--primary btn--small ${
			product.quantity === 1 ? "btn--danger" : ""
		}" data-action="DECREASE_ITEM">&minus;</button>
<h3 class="cart__item__quantity">${product.quantity}</h3>
<button class="btn btn--primary btn--small" data-action="INCREASE_ITEM">&plus;</button>
<button class="btn btn--danger btn--small" data-action="REMOVE_ITEM">&times;</button>
</div>
`
	);
	addCartFooter();
}
// handling events
function handleActionsOnBtns(addToCartBtnDOM, product) {
	addToCartBtnDOM.disabled = true;
	addToCartBtnDOM.textContent = "In Cart";
	const cartItemsDOM = cartDOM.querySelectorAll(".cart__item");
	cartItemsDOM.forEach((cartItemDOM) => {
		if (
			cartItemDOM.querySelector(".cart__item__name").textContent ===
			product.name
		) {
			cartItemDOM
				.querySelector('[data-action="INCREASE_ITEM"]')
				.addEventListener("click", (_) => increaseItem(product, cartItemDOM));

			cartItemDOM
				.querySelector('[data-action="DECREASE_ITEM"]')
				.addEventListener("click", (_) =>
					decreaseItem(product, cartItemDOM, addToCartBtnDOM)
				);

			cartItemDOM
				.querySelector('[data-action="REMOVE_ITEM"]')
				.addEventListener("click", (_) =>
					removeItem(product, cartItemDOM, addToCartBtnDOM)
				);
		}
	});
}
// increase amount of item
function increaseItem(product, cartItemDOM) {
	cart.forEach((cartItem) => {
		if (cartItem.name === product.name) {
			cartItemDOM.querySelector(".cart__item__quantity").textContent =
				++cartItem.quantity;
			cartItemDOM
				.querySelector('[data-action="DECREASE_ITEM"]')
				.classList.remove("btn--danger");
			saveCart();
		}
	});
}
// decrease amount of item
function decreaseItem(product, cartItemDOM, addToCartBtnDOM) {
	cart.forEach((cartItem) => {
		if (cartItem.name === product.name) {
			if (cartItem.quantity > 1) {
				cartItemDOM.querySelector(".cart__item__quantity").textContent =
					--cartItem.quantity;
				saveCart();
			} else {
				removeItem(product, cartItemDOM, addToCartBtnDOM);
			}
			if (cartItem.quantity === 1) {
				cartItemDOM
					.querySelector('[data-action="DECREASE_ITEM"]')
					.classList.add("btn--danger");
			}
		}
	});
}
// remove one item
function removeItem(product, cartItemDOM, addToCartBtnDOM) {
	cartItemDOM.classList.add("cart__item--removed");
	setTimeout((_) => cartItemDOM.remove(), 250);
	cart = cart.filter((cartItem) => cartItem.name !== product.name);
	saveCart();
	addToCartBtnDOM.textContent = "Add To Cart";
	addToCartBtnDOM.disabled = false;
	if (cart.length < 1) {
		document.querySelector(".cart-footer").remove();
	}
}
// adding cart footer
function addCartFooter() {
	if (!document.querySelector(".cart-footer")) {
		cartDOM.insertAdjacentHTML(
			"afterend",
			`
<div class="cart-footer">
<button class="btn btn--danger" data-action="CLEAR_CART">Clear Cart</button>
<button class="btn btn--primary" data-action="CHECKOUT">Pay</button>
</div>
`
		);
		document
			.querySelector('[data-action="CLEAR_CART"]')
			.addEventListener("click", (_) => clearItems());
		document
			.querySelector('[data-action="CHECKOUT"]')
			.addEventListener("click", (_) => checkout());
	}
}
// clear all items
function clearItems() {
	cartDOM.querySelectorAll(".cart__item").forEach((cartItemDOM) => {
		cartItemDOM.classList.add("cart__item--removed");
		setTimeout((_) => cartItemDOM.remove(), 250);
	});
	cart = [];
	localStorage.removeItem("cart");
	if (cart.length < 1) {
		document.querySelector(".cart-footer").remove();
	}
	addToCartBtnsDOM.forEach((addToCartBtnDOM) => {
		addToCartBtnDOM.textContent = "Add To Cart";
		addToCartBtnDOM.disabled = false;
	});
}
// count total amount
function countCartTotal() {
	let initialCount = 0;
	cart.forEach((cartItem) => {
		initialCount += cartItem.quantity * cartItem.price;
	});
	document.querySelector(
		'[data-action="CHECKOUT"]'
	).textContent = `Pay $${initialCount}`;
}

function saveCart() {
	localStorage.setItem("cart", JSON.stringify(cart));
	countCartTotal();
}

// Scroll
$(function () {
	$("a.page-scroll").bind("click", function (event) {
		var $anchor = $(this);
		$("html, body")
			.stop()
			.animate(
				{
					scrollTop: $($anchor.attr("href")).offset().top,
				},
				1500,
				"easeInOutExpo"
			);
		event.preventDefault();
	});
});

// Highlight the top nav as scrolling occurs
$("body").scrollspy({
	target: ".navbar-fixed-top",
});

// Closes the Responsive Menu on Menu Item Click
$(".navbar-collapse ul li a").click(function () {
	$(".navbar-toggle:visible").click();
});

//
var swiper = new Swiper(".mySwiper", {
	effect: "coverflow",
	grabCursor: true,
	centeredSlides: true,
	loop: true,
	slidesPerView: "1",
	coverflowEffect: {
		rotate: 0,
		stretch: 0,
		depth: 100,
		modifier: 4,
		slideShadows: false,
	},
	keyboard: {
		enabled: true,
	},
	mousewheel: {
		thresholdDelta: 70,
	},
	initialSlide: 0,
	on: {
		click(event) {
			swiper.slideTo(this.clickedIndex);
		},
	},
	breakpoints: {
		640: {
			slidesPerView: 2,
		},
	},
});
