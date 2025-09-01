(function(){
  const form = document.getElementById('form-curso');
  if(!form) return;

  const alertErr = document.getElementById('alert-errores');
  const alertOk  = document.getElementById('alert-exito');
  const wrapLecciones = document.getElementById('lecciones');
  const btnAddLesson = document.getElementById('btn-add-lesson');

  function limpiarErrores(){
    alertErr.classList.add('d-none'); alertErr.textContent='';
    ['titulo','categoria','nivel','precio','imagen','lecciones'].forEach(id => {
      const el = document.getElementById('err-'+id);
      if(el) el.textContent='';
    });
  }

  function valTexto(valor, min=3, max=100){
    const v = (valor||'').trim();
    return v.length >= min && v.length <= max;
  }

  function getLecciones(){
    return Array.from(document.querySelectorAll('.lesson'))
      .map(i => i.value.trim())
      .filter(v => v.length>0);
  }

  function reindexLecciones(){
    Array.from(wrapLecciones.querySelectorAll('.input-group')).forEach((grp, idx)=>{
      const tag = grp.querySelector('.input-group-text');
      if(tag) tag.textContent = String(idx+1);
    });
  }

  // Agregar lección dinámica
  btnAddLesson.addEventListener('click', ()=>{
    const grp = document.createElement('div');
    grp.className = 'input-group mt-1';
    grp.innerHTML = `
      <span class="input-group-text">?</span>
      <input type="text" class="form-control lesson" placeholder="Nueva lección">
      <button class="btn btn-outline-danger quitar" type="button">&times;</button>
    `;
    wrapLecciones.appendChild(grp);
    reindexLecciones();
  });

  // Quitar lección
  wrapLecciones.addEventListener('click', (e)=>{
    const btn = e.target.closest('.quitar');
    if(!btn) return;
    const groups = wrapLecciones.querySelectorAll('.input-group');
    if(groups.length <= 1) return; // deja al menos 1
    btn.closest('.input-group').remove();
    reindexLecciones();
  });

  // Guardar curso
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    limpiarErrores();
    alertOk.classList.add('d-none');

    const titulo   = document.getElementById('titulo').value;
    const categoria= document.getElementById('categoria').value;
    const nivel    = document.getElementById('nivel').value;
    const precio   = Number(document.getElementById('precio').value);
    const imagen   = document.getElementById('imagen').value;
    const lecciones= getLecciones();

    const errores = [];

    if(!valTexto(titulo, 3, 100)){ document.getElementById('err-titulo').textContent='Título entre 3 y 100 caracteres.'; errores.push('Título'); }
    if(!valTexto(categoria, 3, 50)){ document.getElementById('err-categoria').textContent='Categoría requerida.'; errores.push('Categoría'); }
    if(!nivel){ document.getElementById('err-nivel').textContent='Selecciona un nivel.'; errores.push('Nivel'); }
    if(isNaN(precio) || precio < 0){ document.getElementById('err-precio').textContent='Precio debe ser número ≥ 0.'; errores.push('Precio'); }
    if(!valTexto(imagen, 3, 200)){ document.getElementById('err-imagen').textContent='URL/Ruta de imagen requerida.'; errores.push('Imagen'); }
    if(lecciones.length < 3){ document.getElementById('err-lecciones').textContent='Agrega al menos 3 lecciones.'; errores.push('Lecciones'); }

    if(errores.length){
      alertErr.classList.remove('d-none');
      alertErr.textContent = 'Por favor corrige: ' + errores.join(' · ');
      return;
    }

    // Crear curso
    const id = await window.generateCourseId();
    const curso = {
      id, titulo: titulo.trim(), categoria: categoria.trim(), nivel,
      precio, imagen: imagen.trim(), instructor: 'Instructor (tú)',
      lecciones
    };

    window.saveCustomCourse(curso);

    alertOk.classList.remove('d-none');
    form.reset();
    // rearmar 3 lecciones por defecto
    wrapLecciones.innerHTML = '';
    for(let i=1;i<=3;i++){
      const grp = document.createElement('div');
      grp.className = 'input-group';
      grp.innerHTML = `
        <span class="input-group-text">${i}</span>
        <input type="text" class="form-control lesson" placeholder="Lección ${i}">
        <button class="btn btn-outline-danger quitar" type="button">&times;</button>
      `;
      wrapLecciones.appendChild(grp);
    }
  });
})();
