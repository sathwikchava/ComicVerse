let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping_cart");

let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculate = () => {
  let cartIcon = document.getElementById("cart_amount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculate();

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id,name,price,item,img } = x;
        return `
      <div class="cart_item" id=prodcut-id-${id}>
                <p>${name}</p>
          <div class='cart_item_img'>
            <img width="100" src=${img} alt="" />
          </div>
                <p >$ ${price}</p>
      
        <button  class='rmv_btn'  onclick="removeItem(${id})">Remove</button>
      </div>
      `;
      }).join(""));
  } else {
    ShoppingCart.innerHTML = `<h3>Shopping cart is empty</h3>`;
  }
};
generateCartItems();

let removeItem = (id) => {
  basket = basket.filter((x) => x.id != id);
  localStorage.setItem("data", JSON.stringify(basket));
  calculate();
  generateCartItems();
  Total_amount();
};

let Total_amount = () => {
  let total_amount = 0;
  basket.map((item) => {
    total_amount += item.item * item.price;
  });
  if (basket.length !== 0) {
    label.innerHTML = `
      <div class='checkout_area'>
         <h2>Total Price : $ ${total_amount} </h2>
         <button class='update' onClick=window.location.reload()>
           Update cart
         </button>
         <button class='checkout' onclick="checkout()">Checkout</button>
       </div>
    `;
  } else {
    label.innerHTML = "";
  }
};

Total_amount();

let checkout = async () => {
  const token = typeof getClerkToken === 'function' ? await getClerkToken() : localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  if (!token || !user) {
    alert('Please log in to proceed to checkout.');
    window.location.href = 'login.html?redirect=cart.html';
    return;
  }

  if (basket.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  const backendUrl = localStorage.getItem('BACKEND_URL') || 'http://localhost:5000';

  try {
    const response = await fetch(`${backendUrl}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items: basket })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order.');
    }

    var options = {
      "key": data.keyId,
      "amount": data.amount,
      "currency": data.currency,
      "name": "ComicVerse",
      "description": "Purchase Comic Books",
      "image": "https://res.cloudinary.com/de27xvxon/image/upload/v1715758978/OIP_tzwkgk.jpg",
      "order_id": data.orderId,
      "handler": async function (verifyResponse) {
        try {
          const verifyResult = await fetch(`${backendUrl}/api/payment/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: verifyResponse.razorpay_order_id,
              razorpay_payment_id: verifyResponse.razorpay_payment_id,
              razorpay_signature: verifyResponse.razorpay_signature
            })
          });

          const verifyData = await verifyResult.json();
          if (verifyResult.ok) {
            localStorage.setItem('lastOrder', JSON.stringify({
              orderId: verifyData.orderId,
              items: basket
            }));
            window.location.href = 'success.html';
          } else {
            alert(verifyData.message || 'Payment verification failed.');
          }
        } catch (err) {
          console.error(err);
          alert('Error verifying payment.');
        }
      },
      "prefill": {
        "name": user.name,
        "email": user.email
      },
      "theme": {
        "color": "#adff2f"
      }
    };

    var rzp = new Razorpay(options);
    rzp.on('payment.failed', function (paymentFailedResponse) {
      console.error(paymentFailedResponse.error);
      window.location.href = 'cancel.html';
    });
    rzp.open();

  } catch (error) {
    console.error(error);
    alert(error.message || 'Error creating payment checkout.');
  }
};
