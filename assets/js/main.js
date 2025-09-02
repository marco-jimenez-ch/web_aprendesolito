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

// --- DINERO CLP ---
window.currencyCL = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

// --- Carrito ---
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
  const all = await window.loadAllCourses();
  const course = all.find(c => String(c.id) === String(id));
  if (course) window.addToCartByCourse(course);
  else alert('Curso no encontrado.');
};

// --- Cursos: base ---
window.loadAllCourses = async function () {
  let base = [];
  try {
    const res = await fetch('data/courses.json');
    base = await res.json();
  } catch { base = []; }

  let custom = [];
  try { custom = JSON.parse(localStorage.getItem('courses_custom') || '[]'); }
  catch { custom = []; }

  // De-duplicar por id (si hay mismo id, prioriza custom)
  const map = new Map(base.map(c => [String(c.id), c]));
  for (const c of custom) map.set(String(c.id), c);
  return Array.from(map.values());
};

window.saveCustomCourse = function (course) {
  const list = JSON.parse(localStorage.getItem('courses_custom') || '[]');
  const idx = list.findIndex(c => String(c.id) === String(course.id));
  if (idx >= 0) list[idx] = course;
  else list.push(course);
  localStorage.setItem('courses_custom', JSON.stringify(list));
};

window.generateCourseId = async function () {
  const all = await window.loadAllCourses();
  const maxId = all.reduce((m, c) => Math.max(m, Number(c.id) || 0), 100);
  return maxId + 1;
};
