import React, {useState, useCallback, useEffect  } from 'react';
import axios from 'axios';
import { useAuth } from '../Login/AuthContext';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [modalData, setModalData] = useState({ app: '', description: '', solution: '' });
  const [formErrors, setFormErrors] = useState({});
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, action: null, data: null });
  const [selectedApp, setSelectedApp] = useState('');



  const filterProblems = useCallback(() => {
    if (selectedApp) {
      setFilteredProblems(problems.filter(problem => problem.app === selectedApp));
    } else {
      setFilteredProblems(problems);
    }
  }, [selectedApp, problems]);

  useEffect(() => {
    loadProblems();
  }, []);

  // Asegúrate de que 'filterProblems' esté en el array de dependencias
  useEffect(() => {
    filterProblems();
  }, [selectedApp, problems, filterProblems]);

  const loadProblems = async () => {
    try {
      const { data } = await axios.get('/api/problems'); // Ajusta la URL según tu API
      setProblems(data);
      setFilteredProblems(data);
      toast.success('Problemas cargados exitosamente.');
    } catch (err) {
      toast.error('Error al cargar los problemas.');
    }
  };



  const validateSpelling = async (fieldName, text) => {
    try {
      const response = await axios.post('https://svc.webspellchecker.net/spellcheck31/script/ssrv.fcgi', {
        cmd: 'check_spelling',
        text: text,
        lang: 'es_ES',
      });
      if (response.data && response.data.spellCheck) {
        const spellingErrors = response.data.spellCheck.reduce((errors, error) => {
          errors[error.word] = error.suggestions.join(', ');
          return errors;
        }, {});
        setFormErrors(prevErrors => ({ ...prevErrors, [fieldName]: spellingErrors }));
      }
    } catch (error) {
      console.error('Error checking spelling:', error);
    }
  };

  const validateForm = async (fieldName, value) => {
    let errors = { ...formErrors };
    let spellingCheckRequired = false;

    switch (fieldName) {
      case 'app':
        errors.app = value ? '' : 'Debe seleccionar una aplicación';
        break;
      case 'description':
      case 'solution':
        if (value.length < 10) {
          errors[fieldName] = 'El campo debe tener al menos 10 caracteres';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          errors[fieldName] = 'El campo solo debe contener letras y espacios';
        } else {
          spellingCheckRequired = true;
        }
        break;
      default:
        break;
    }
    if (spellingCheckRequired) {
      await validateSpelling(fieldName, value);
    }
    setFormErrors(errors);
  };

  const handleLike = async (id) => {
    try {
      const response = await axios.post(`/api/problems/like/${id}`);
      const updatedProblem = response.data;
      setProblems(problems.map(p => p.id === id ? updatedProblem : p));
    } catch (err) {
      console.error('Error liking problem:', err);
    }
  };

  const handleDislike = async (id) => {
    try {
      const response = await axios.post(`/api/problems/dislike/${id}`);
      const updatedProblem = response.data;
      setProblems(problems.map(p => p.id === id ? updatedProblem : p));
    } catch (err) {
      console.error('Error disliking problem:', err);
    }
  };

  const handleAppChange = (e) => {
    setSelectedApp(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description' || name === 'solution') {
      const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
      setModalData(prevData => ({ ...prevData, [name]: sanitizedValue }));
      validateForm(name, sanitizedValue);
    } else {
      setModalData(prevData => ({ ...prevData, [name]: value }));
      validateForm(name, value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await validateForm('app', modalData.app);
    await validateForm('description', modalData.description);
    await validateForm('solution', modalData.solution);

    if (Object.values(formErrors).some(error => error !== '')) {
      toast.error('Hubo un error al agregar el problema. Verifica los campos antes de enviarlos nuevamente.');
      return;
    }

    setConfirmationModal({
      isOpen: true,
      action: modalData.id ? 'edit' : 'add',
      data: modalData
    });
  };

  const handleDelete = (id) => {
    setConfirmationModal({
      isOpen: true,
      action: 'delete',
      data: { id }
    });
  };

  const handleConfirmation = async () => {
    try {
      if (confirmationModal.action === 'delete') {
        await axios.delete(`/api/problems/${confirmationModal.data.id}`);
        setProblems(problems.filter(p => p.id !== confirmationModal.data.id));
        filterProblems();
        toast.success('Problema eliminado exitosamente.');
      } else if (confirmationModal.action === 'add') {
        const newProblem = await axios.post('/api/problems', confirmationModal.data);
        setProblems([...problems, newProblem.data]);
        filterProblems();
        toast.success('Nuevo problema agregado exitosamente.');
      } else if (confirmationModal.action === 'edit') {
        const updatedProblem = await axios.put(`/api/problems/${modalData.id}`, confirmationModal.data);
        setProblems(problems.map(p => p.id === updatedProblem.data.id ? updatedProblem.data : p));
        filterProblems();
        toast.success('Problema actualizado exitosamente.');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error al procesar solicitud.');
    } finally {
      setConfirmationModal({ isOpen: false, action: null, data: null });
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      <p>Bienvenido, {user.username}</p>
      <div className="admin-actions">
        <div className="filter-app">
          <label>
            Filtrar por aplicación:
            <select value={selectedApp} onChange={handleAppChange}>
              <option value="">Todos</option>
              {/* Agrega opciones para aplicaciones según sea necesario */}
            </select>
          </label>
        </div>
        <div className="manage-problems">
          <h2>Agregar o Editar Problema</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Aplicación:
              <input
                type="text"
                name="app"
                value={modalData.app}
                onChange={handleChange}
              />
              {formErrors.app && <div className="error">{formErrors.app}</div>}
            </label>
            <label>
              Descripción:
              <textarea
                name="description"
                value={modalData.description}
                onChange={handleChange}
              />
              {formErrors.description && <div className="error">{formErrors.description}</div>}
            </label>
            <label>
              Solución:
              <textarea
                name="solution"
                value={modalData.solution}
                onChange={handleChange}
              />
              {formErrors.solution && <div className="error">{formErrors.solution}</div>}
            </label>
            <button type="submit">Guardar</button>
          </form>
        </div>
      </div>
      <div className="problem-list">
        <h2>Lista de Problemas</h2>
        <ul>
          {filteredProblems.map((problem) => (
            <li key={problem.id}>
              {problem.description}
              <button onClick={() => handleDelete(problem.id)}>Eliminar</button>
              <button onClick={() => setModalData(problem)}>Editar</button>
              <button onClick={() => handleLike(problem.id)}>Me gusta</button>
              <button onClick={() => handleDislike(problem.id)}>No me gusta</button>
            </li>
          ))}
        </ul>
      </div>
      {confirmationModal.isOpen && (
        <div className="confirmation-modal">
          <p>{`¿Estás seguro de que deseas ${confirmationModal.action} este problema?`}</p>
          <button onClick={handleConfirmation}>Confirmar</button>
          <button onClick={() => setConfirmationModal({ isOpen: false, action: null, data: null })}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;