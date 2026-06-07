import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [titulo, setTitulo] = useState('');
  const [areaAcademica, setAreaAcademica] = useState('');
  const [dedicacion, setDedicacion] = useState('');
  const [aniosExperiencia, setAniosExperiencia] = useState(0);  

  const [registros, setRegistros] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    cargarDocentes();
  }, []);

  const cargarDocentes = async () => {
    try {
      const response = await fetch('http://localhost:3001/docentes');
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      alert('Error al cargar docentes');
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setCorreo('');
    setTelefono('');
    setTitulo('');
    setAreaAcademica('');
    setDedicacion('');
    setAniosExperiencia(0);
    setEditIndex(null);
  };

  const registrarDatos = async (e) => {
    e.preventDefault();

    const payload = {
      nombre,
      correo,
      telefono,
      titulo,
      area_academica: areaAcademica,
      dedicacion,
      anios_experiencia: parseInt(aniosExperiencia) || 0
    };

    if (editIndex !== null) {
      try {
        const docente = registros[editIndex];
        const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, { 
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const nuevosRegistros = [...registros];
          nuevosRegistros[editIndex] = { 
            ...docente,
            nombre,
            correo,
            telefono,
            titulo,
            area_academica: areaAcademica,
            dedicacion,
            anios_experiencia: aniosExperiencia
          };
          setRegistros(nuevosRegistros);
          alert('Docente actualizado correctamente');
        } else {
          const err = await response.json().catch(() => ({}));
          alert(err.error || 'Error al actualizar docente');
        }
      } catch(error) {
        alert('Error de conexión al actualizar docente');
      }
    } else {
      try {
        const response = await fetch('http://localhost:3001/docentes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
        });  
        const data = await response.json(); 
        
        if (response.ok) {
          setRegistros([...registros, data]);
          alert('Docente registrado correctamente');
        } else {
          alert(data.error || 'Error al registrar el docente');
        }
      } catch (error) {
        alert('Error de conexión al registrar docente');
      }
    }
    limpiarFormulario();
  };

  const eliminarRegistro = async (idx) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return;
    
    const docente = registros[idx]; 

    try {
      const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== idx));
        if (editIndex === idx) {
          limpiarFormulario();
        }
        alert('Docente eliminado correctamente');
      } else {
        alert('Error al eliminar docente');
      }
    } catch (error) {
      alert('Error de conexión al eliminar docente');
    }
  };

  const editarRegistro = (idx) => {
    const reg = registros[idx];
    setEditIndex(idx);
    setNombre(reg.nombre);
    setCorreo(reg.correo);
    setTelefono(reg.telefono);
    setTitulo(reg.titulo);
    setAreaAcademica(reg.area_academica);
    setDedicacion(reg.dedicacion);
    setAniosExperiencia(reg.anios_experiencia);  
  };

  return (
    <div className="contenedor-principal">
      <div className="panel-gestion">
        <header className="cabecera-seccion">
          <h1>Gestión de docentes universitarios</h1>
          <p>Registro de profesores: datos académicos y de contacto</p>
        </header>

        <form className="formulario-docente" onSubmit={registrarDatos}>
          <div className="fila-formulario">
            <div className="grupo-input ancho-2">
              <label>Nombre completo:</label>
              <input
                type="text"
                placeholder="Ej. María Fernanda López"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="grupo-input ancho-2">
              <label>Correo institucional:</label>
              <input
                type="email"
                placeholder="nombre@universidad.edu"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="grupo-input ancho-1">
              <label>Teléfono:</label>
              <input
                type="text"
                placeholder="Ej. +57 300 1234567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
          </div>

          <div className="fila-formulario">
            <div className="grupo-input ancho-2">
              <label>Título académico máximo:</label>
              <input
                type="text"
                placeholder="Ej. Doctorado, Maestría, Especialización"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div className="grupo-input ancho-2">
              <label>Área o programa académico:</label>
              <input
                type="text"
                placeholder="Ej. Ingeniería de Software, Pedagogía"
                value={areaAcademica}
                onChange={(e) => setAreaAcademica(e.target.value)}
              />
            </div>
          </div>

          <div className="fila-formulario">
            <div className="grupo-input ancho-2">
              <label>Dedicación:</label>
              <input
                type="text"
                placeholder="Ej. Tiempo completo, Medio tiempo, Cátedra"
                value={dedicacion}
                onChange={(e) => setDedicacion(e.target.value)}
              />
            </div>
            <div className="grupo-input ancho-2">
              <label>Años de experiencia docente:</label>
              <input
                type="number"
                min="0"
                value={aniosExperiencia}
                onChange={(e) => setAniosExperiencia(e.target.value)}
              />
            </div>
          </div>

          <div className="fila-acciones-formulario">
            <button type="submit" className="btn-primario">
              {editIndex !== null ? 'Actualizar Docente' : 'Registrar'}
            </button>
            {editIndex !== null && (
              <button type="button" className="btn-secundario" onClick={limpiarFormulario}>
                Cancelar Edición
              </button>
            )}
          </div>
        </form>

        <div className="contenedor-tabla">
          <table className="tabla-docentes">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Título</th>
                <th>Área académica</th>
                <th>Dedicación</th>
                <th>Años <br/>exp.</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 ? (
                <tr>
                  <td colSpan="8" className="tabla-vacia">No hay docentes registrados.</td>
                </tr>
              ) : (
                registros.map((docente, index) => (
                  <tr key={docente.id || index}>
                    <td>{docente.nombre}</td>
                    <td>{docente.correo}</td>
                    <td>{docente.telefono}</td>
                    <td>{docente.titulo}</td>
                    <td>{docente.area_academica}</td>
                    <td>{docente.dedicacion}</td>
                    <td className="celda-centrada">{docente.anios_experiencia}</td>
                    <td className="celda-acciones">
                      <button type="button" className="btn-editar" onClick={() => editarRegistro(index)}>Editar</button>
                      <button type="button" className="btn-eliminar" onClick={() => eliminarRegistro(index)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
  
export default App;