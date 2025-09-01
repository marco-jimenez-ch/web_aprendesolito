// Formato de moneda CLP
window.currencyCL = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

// Carrito (localStorage)
window.getCart = function () {
  try { return JSON.parse(localStorage.getItem('carrito') || '[]'); }
  catch { return []; }
};
window.saveCart = function (c) { localStorage.setItem('carrito', JSON.stringify(c)); };

window.addToCartByCourse = function (course) {
  const cart = window.getCart();
  if (cart.find(i => String(i.id) === String(course.id))) {
    alert('El curso ya está en el carrito.');
    return;
  }
  cart.push({ ...course, cantidad: 1 });
  window.saveCart(cart);
  alert('Curso agregado al carrito.');
};

window.addToCartById = async function (id) {
  const res = await fetch('data/courses.json');
  const all = await res.json();
  const course = all.find(c => String(c.id) === String(id));
  if (course) window.addToCartByCourse(course);
  else alert('Curso no encontrado.');
};
