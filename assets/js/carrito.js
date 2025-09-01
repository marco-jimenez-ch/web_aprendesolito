(function(){
  const body = document.getElementById('carrito-body');
  const totalEl = document.getElementById('carrito-total');
  const tabla = document.getElementById('tabla-carrito');
  const vacio = document.getElementById('estado-vacio');

  function calcTotal(cart){
    return cart.reduce((acc, it) => acc + Number(it.precio || 0) * (Number(it.cantidad)||1), 0);
  }

  function removeItem(id){
    const cart = getCart().filter(it => String(it.id) !== String(id));
    saveCart(cart);
    renderCarrito();
  }

  function renderCarrito(){
    const cart = getCart();

    if(!cart.length){
      tabla.classList.add('d-none');
      vacio.classList.remove('d-none');
      totalEl.textContent = currencyCL.format(0);
      return;
    }
    tabla.classList.remove('d-none');
    vacio.classList.add('d-none');

    body.innerHTML = cart.map(it => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${it.imagen}" alt="${it.titulo}" width="64" height="64" class="rounded" style="object-fit:cover">
            <div>
              <div class="fw-semibold">${it.titulo}</div>
              <div class="text-muted small">${it.categoria} • ${it.nivel}</div>
            </div>
          </div>
        </td>
        <td class="text-end">${currencyCL.format(it.precio)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" data-remove="${it.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');

    totalEl.textContent = currencyCL.format(calcTotal(cart));
  }

  function vaciar(){
    saveCart([]);
    renderCarrito();
  }

  function simularPago(){
    const cart = getCart();
    if(!cart.length){ alert('Tu carrito está vacío.'); return; }

    // merge sin duplicados en "misCursos"
    const actuales = JSON.parse(localStorage.getItem('misCursos') || '[]');
    const map = new Map(currentesToPairs(actuales)); // helper
    for(const it of cart) map.set(String(it.id), it);
    const nuevos = Array.from(map.values());
    localStorage.setItem('misCursos', JSON.stringify(nuevos));

    // limpiar carrito y redirigir
    saveCart([]);
    location.href = 'exito.html';
  }

  function currentesToPairs(arr){ return arr.map(x => [String(x.id), x]); }

  // Listeners
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if(btn){ removeItem(btn.getAttribute('data-remove')); }
  });
  const btnVaciar = document.getElementById('btn-vaciar');
  const btnPagar  = document.getElementById('btn-pagar');
  btnVaciar && btnVaciar.addEventListener('click', vaciar);
  btnPagar  && btnPagar.addEventListener('click', simularPago);

  // init
  renderCarrito();
})();
