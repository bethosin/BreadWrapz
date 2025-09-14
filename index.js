let cart = 0;
let total = 0;
let orders = [];

const updateCart = () => {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.innerHTML = cart;
  localStorage.setItem("orderData", JSON.stringify({ cart, total, orders }));
};

const addToCart = (price, name) => {
  cart += 1;
  total += price;
  orders.push({ name, price });
  updateCart();
  alert(`${name} added! Total now: ₦${total}`);
};

const attachMenuButtons = () => {
  const btns = [
    ["jollofBtn", 5000, "Jollof Rice & Chicken/Turkey"],
    ["riceBeansBtn", 4000, "Rice and Beans with Beef"],
    ["friedBtn", 5000, "Fried Rice & Chicken/Turkey"],
    ["yamBtn", 3500, "Yam and Scrambled Eggs"],
    ["nativePastaBtn", 4000, "Native Pasta and Fish"],
    ["nativeRiceBtn", 4000, "Native Rice and Beef"],
    ["ewaBtn", 3500, "Ewa Agoyin with Plantain"],
    ["moiMoiBtn", 3000, "MoiMoi and Fresh Bread"],
    ["efoBtn", 3000, "Efo Riro with Semovita"],
    ["breadWrapz", 3000, "Breadwrapz (TOAST)"],
    ["porridgeBtn", 4000, "Porridge"],
    ["ofadaBtn", 3500, "Ofada Rice and Ayamase"],
  ];

  btns.forEach(([id, price, name]) => {
    if (document.getElementById(id)) {
      document.getElementById(id).onclick = () => addToCart(price, name);
    }
  });
};

const showOrders = () => {
  const savedData = localStorage.getItem("orderData");
  if (savedData) {
    const { cart: c, total: t, orders: o } = JSON.parse(savedData);
    cart = c;
    total = t;
    orders = o || [];
    updateCart();

    const orderList = document.getElementById("orderList");
    const orderTotal = document.getElementById("orderTotal");

    if (orderTotal) orderTotal.innerHTML = total;
    if (orderList) {
      orderList.innerHTML = "";
      orders.forEach((item, i) => {
        orderList.innerHTML += `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                ${i + 1}. ${item.name} <span>₦${item.price}</span>
              </li>`;
      });
    }
  }
};

const clearOrder = () => {
  cart = 0;
  total = 0;
  orders = [];
  updateCart();
  showOrders();
};

const payWithPaystack = () => {
  const publicKey = "pk_test_75d273cdb82d8ba9e492afa7990f621d3511745a"; // Replace with your real key
  if (!publicKey) return alert("Paystack public key is missing!");
  if (total <= 0) return alert("Your cart is empty!");

    let email = document.getElementById("userEmail").value;
  const handler = PaystackPop.setup({
    key: publicKey,
    email: email,
    amount: total * 100,
    currency: "NGN",
    ref: "BWZ" + Math.floor(Math.random() * 1000000000 + 1),
    onClose: () => alert("Transaction was not completed."),
    callback: (response) => {
      alert(`Payment complete! Reference: ${response.reference}`);
      clearOrder();
    },
  });

  handler.openIframe();
};

window.onload = () => {
  attachMenuButtons();
  showOrders();
};
