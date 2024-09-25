import React, { useState, useEffect, useCallback } from 'react';
import '../FQA/stylesF/FQA.css';
import {fetchProblems, addProblem, updateProblem, deleteProblem } from './FQAAPI';
import Modal from 'react-modal';
import axios from 'axios';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { useAuth } from '../../Login/AuthContext';
import NotificationTray from '../BotonesMenu/NotificationTray/NotificationTray.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useQuery,  useMutation , useQueryClient } from 'react-query';


const FQA = ({ isOpen, onClose }) => {
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedApp, setSelectedApp] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalData, setModalData] = useState({ aplicacion: '', descripcion: '', solucion: '' });
  const [isSecondaryModalOpen, setIsSecondaryModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [enhancedViewData, setEnhancedViewData] = useState(null);
  const [isEnhancedViewModalOpen, setIsEnhancedViewModalOpen] = useState(false);
  // const [pendingComments,setPendingComments]=useState({});
  const [comments, setComments] = useState([]); // Estado para los comentarios existentes
  const [newComment, setNewComment] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const isAdmin =user?.role === 'admin';

  const aplicativos = ['Efinet', 'Efiwiki', 'Intranet', 'Smartflex'];


  // const [notifications,setNotifications]=useState([]);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    message: '',
    descripcion: '',
    solucion: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const { data: problems = [], isLoading, error } = useQuery(
    ['problems',selectedApp],
     async () =>  await fetchProblems(selectedApp),
    {
      enabled: !!selectedApp,
      staleTime: 5*60*100, //5mins
      cacheTime: 60*60*100 , //1 hora
      onError: (error) => {
        toast.error('Error al cargar los problemas : '+ error.message); 
      }
    }
  );




const filterProblems = useCallback(() => {
  // Si no hay aplicación seleccionada o no hay problemas cargados, limpiar la lista
  if (!selectedApp || !problems) {
    // Solo actualizamos el estado si realmente hay un cambio
    setFilteredProblems(prevFiltered => {
      if (prevFiltered.length > 0) {
        return []; // Limpiar solo si antes había problemas filtrados
      }
      return prevFiltered; // Mantener el estado anterior si ya estaba vacío
    });
    return;
  }

  // Filtrar problemas por la aplicación seleccionada
  let filtered = problems.filter(problem => problem.aplicacion === selectedApp);

  // Si hay un query de búsqueda, aplicar el filtro adicional
  if (searchQuery) {
    filtered = filtered.filter(problem =>
      problem.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.solucion.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Actualizar el estado solo si los problemas filtrados han cambiado
  setFilteredProblems(prevFiltered => {
    // Evitar actualizar si los problemas filtrados son los mismos
    if (JSON.stringify(prevFiltered) === JSON.stringify(filtered)) {
      return prevFiltered; // No hacer nada si no ha cambiado el resultado
    } else {
      return filtered; // Actualizamos si los resultados son diferentes
    }
  });
}, [selectedApp, problems, searchQuery]);

// useEffect para ejecutar el filtro cuando cambian los problemas o el query
useEffect(() => {
  filterProblems(); // Llamar a la función de filtrado cuando cambian las dependencias
}, [filterProblems, problems, searchQuery]);


  const validateSpelling = async (fieldName, text) => {
    try {
      const response = await axios.post('https://svc.webspellchecker.net/spellcheck31/script/ssrv.fcgi', {
        cmd: 'check_spelling',
        text: text,
        lang: 'es_ES', // Cambia a 'en_US' para inglés u otro código de idioma según tus necesidades
      });

      if (response.data && response.data.spellCheck) {
        const spellingErrors = response.data.spellCheck.reduce((errors, error) => {
          errors[error.word] = error.suggestions.join(', ');
          return errors;
        }, {});
        setFormErrors(prevErrors => ({
          ...prevErrors,
          [fieldName]: spellingErrors,
        }));
        toast.error(`Errores de ortografía en el campo ${fieldName}`);
      }

    } catch (error) {
      console.error('Error checking spelling:', error);
    }
  };

  const validateForm = async (fieldName, value) => {
    let errors = { ...formErrors };
    let spellingCheckRequired = false;

    switch (fieldName) {
      case 'aplicacion':
        errors.aplicacion = value ? '' : 'Debe seleccionar una aplicación';
        break;
      case 'descripcion':
      case 'solucion':
        if (value.length < 10) {
          errors[fieldName] = 'El campo debe tener al menos 10 caracteres';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          errors[fieldName] = 'El campo solo debe contener letras y espacios';
          toast.error(`el campo ${fieldName} solo debe contener letras  y espacios`);
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

  // const handleCommentChange = (problemId, value) => {
  //   setPendingComments(prevComments => ({
  //     ...prevComments,
  //     [problemId]: value
  //   }));
  // };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Prevenir la recarga de la página

    // Validación: Verificar si el comentario está vacío
    if (!newComment.trim()) {
      toast.error('El comentario no puede estar vacío.');
      return;
    }
  
    const problemId = enhancedViewData?.id || enhancedViewData?.id;
    const newCommentObject = {
      problemId: problemId,
      content: newComment.trim(),
      userId: user.id,
      userName: user.username,
      timestamp: new Date().toISOString(),
    };
  
    // Guardar el comentario en localStorage
    const storedComments = JSON.parse(localStorage.getItem('adminComments') || '[]');
    localStorage.setItem('adminComments', JSON.stringify([...storedComments, newCommentObject]));
  
    // Actualizar el estado local de comentarios
    setComments([...comments, newCommentObject]);
  
    // Notificación al administrador
    const newNotification = {
      id: new Date().getTime(),
      message: `Nuevo comentario en el problema ${problemId} por ${user.username}`,
      timestamp: new Date().toISOString(),
      role: 'admin',
    };
    
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify([...storedNotifications, newNotification]));
    
    // Disparar evento para actualización de notificaciones
    window.dispatchEvent(new Event('localStorageNotificationChange'));
  
    // Limpiar el campo de comentario
    setNewComment('');
    toast.success('Comentario enviado exitosamente.');
  };

  const handleOpenEnhancedView = (problem) => {
    setEnhancedViewData(problem);
    setIsEnhancedViewModalOpen(true);
  };
  
  const closeEnhancedViewModal = () => {
    setIsEnhancedViewModalOpen(false);
    setEnhancedViewData(null);
  };
  const handleAppChange = (e) => {
    setSelectedApp(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalData(prevData => ({ ...prevData, [name]: value }));
    validateForm(name, value);
  };

  const sendNotification = async (message) => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = {
      id: Date.now(), // Añade un id único
      message: message,
      timestamp: new Date().toISOString(),
    };
    notifications.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Disparar un evento personalizado para que NotificationTray se actualice
    window.dispatchEvent(new Event('localStorageNotificationChange'));
  };


  // Cargar comentarios cuando se abre la vista mejorada
useEffect(() => {
  if (isEnhancedViewModalOpen) {
    const storedComments = JSON.parse(localStorage.getItem('adminComments') || '[]');
    const filteredComments = storedComments.filter(comment => comment.problemId === enhancedViewData.id);
    setComments(filteredComments);
  }
}, [isEnhancedViewModalOpen, enhancedViewData]);


const addProblemMutation = useMutation(addProblem, {
  onSuccess: () => {
    queryClient.invalidateQueries(['problems', selectedApp]);
    toast.success('Nuevo problema agregado exitosamente.');
    sendNotification('Un nuevo problema ha sido agregado.');
  },
  onError: (error) => {
    toast.error('Error al agregar el problema: ' + error.message);
  }
});

// Update problem mutation
const updateProblemMutation = useMutation(
  ({ id, problemData }) => {

    // const { id:_, activo:__, ...dataTosend } = problemData; 
    return updateProblem(id, problemData);
    },
    {
    onSuccess: (response) => {
      console.log('Respuesta del servidor:', response);
      queryClient.invalidateQueries(['problems', selectedApp]);
      toast.success(response.message || 'Problema actualizado exitosamente.');
      closeSecondaryModal();
    },
    onError: (error) => {
      console.error('Error en la mutación:', error);
      toast.error(`Error: ${error.message}`);
    }
  }
);

// Delete problem mutation
const deleteProblemMutation = useMutation(deleteProblem, {
  onSuccess: () => {
    queryClient.invalidateQueries(['problems', selectedApp]);
    toast.success('Problema eliminado exitosamente.');
  },
  onError: (error) => {
    toast.error('Error al eliminar el problema: ' + error.message);
  }
});

// Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();
  console.log('Datos del modal', modalData);

  // // Verificar errores de validación
  // if (Object.keys(formErrors).some((key) => formErrors[key])) {
  //   toast.error('Por favor, corrija los errores del formulario antes de enviarlo.');
  //   return;
  // }

  // Determinar si se está creando un nuevo problema o actualizando uno existente
  const isNewProblem = modalType === 'newProblem';

  let actionParams;
  if (isNewProblem) {
    actionParams = modalData;
  } else {
    // Verificar si currentProblem existe y tiene un _id
    if (!currentProblem || !currentProblem.id) {
      toast.error('No se pudo identificar el problema a actualizar.');
      return;
    }

    // const{...problemData} = modalData;
    actionParams = { 
      id:currentProblem.id, // Incluir el ID del problema para la actualización
      problemData:modalData
    };
  }

  const action = isNewProblem ? addProblemMutation.mutateAsync : updateProblemMutation.mutateAsync;
  const actionMessage = isNewProblem
    ? '¿Estás seguro de que deseas agregar este nuevo problema?'
    : '¿Estás seguro de que deseas actualizar este problema?';

  // Configurar y abrir la ventana de confirmación
  setConfirmationModal({
    isOpen: true,
    message: actionMessage,
    onConfirm: async () => {
      try {
        await action(actionParams);
        queryClient.invalidateQueries(['problems', selectedApp]);  // Refrescar la lista de problemas
        toast.success(isNewProblem ? 'Problema agregado exitosamente.' : 'Problema actualizado exitosamente.');
        closeSecondaryModal();  // Cerrar el modal
      } catch (err) {
        console.error('Error en la solicitud:', err);
        toast.error(`Error al ${isNewProblem ? 'agregar' : 'actualizar'} el problema: ${err.message}`);
      } finally {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    },
    onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
  });
};
// Handle problem deletion
const handleDelete = async (id) => {
  setConfirmationModal({
    isOpen: true,
    message: '¿Estás seguro de que deseas eliminar este problema?',
    onConfirm: async () => {
      try {
        await deleteProblemMutation.mutateAsync(id);
      } finally {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    },
    onCancel: () => {
      setConfirmationModal(prev => ({ ...prev, isOpen: false }));
    }
  });
};

  const handleOpenSecondaryModal = (type, problem = null) => {
    setModalType(type);
    setCurrentProblem(problem);
    setModalData(problem || { aplicacion: '', descripcion: '', solucion: '' });
    setIsSecondaryModalOpen(true);
  };

  const closeSecondaryModal = () => {
    setIsSecondaryModalOpen(false);
    setModalType(null);
    setCurrentProblem(null);
    setModalData({ aplicacion: '', descripcion: '', solucion: '' });
    setFormErrors({});
  };

  // const de  paginacion //
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProblems.slice(indexOfFirstItem, indexOfLastItem);
 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="FQA"
        className="faq-Modal"
        overlayClassName="faq-Overlay"
      >
        <div className="faq-container">
          <header className="faq-header">
            <h1>FQA</h1>
            <button onClick={onClose} className="close-modal">X</button>
            <div className="search-bar">
              <select value={selectedApp} onChange={handleAppChange}>
                <option value="">Seleccionar Aplicativo...</option>
                {aplicativos.map((aplicacion, index) => (
                  <option key={index} value={aplicacion}>{aplicacion}</option>
                ))}
              </select>
              <input
                type='text'
                className='input-group mb-3'
                placeholder='Buscar problemas..'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </header>

          <div className="faq-main">
            {error && <p className="alert alert-danger">{error}</p>}
            {isLoading ? (
              <p>Cargando problemas...</p>
            ) : (
          <div  className='table-responsive'>
           <table className='table table-striped table-hover'>   
            <thead className="table-dark">
              <tr>
                <th>Aplicación</th>
                <th>Descripción</th>
                <th>Solución</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(problem => (
                <tr key={problem.id}>
                  <td>{problem.aplicacion}</td>
                  <td>{problem.descripcion}</td>
                  <td>{problem.solucion}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-info btn-sm" onClick={() => handleOpenEnhancedView(problem)}>Ver Más</button>
                      {isAdmin && (
                        <>
                          <button className="btn btn-primary btn-sm" onClick={() => handleOpenSecondaryModal('editProblem', problem)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(problem.id)}>Eliminar</button>
   
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                {Array.from({ length: Math.ceil(filteredProblems.length / itemsPerPage) }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                  </li>
                ))}
              </ul>
            </nav>

          {isAdmin && (
            <div className='Addproblem-container'>
              <button className=" Addproblem-button" onClick={() => handleOpenSecondaryModal('newProblem')}>Agregar Problema</button>
            </div>
            )}
          </div>
        </div>
      </Modal>
      
      {isAdmin && (
          <NotificationTray/>
        )} 

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onConfirm={confirmationModal.onConfirm}
        onCancel={confirmationModal.onCancel}
        message={confirmationModal.message}
        description={confirmationModal.descripcion}
        solucion={confirmationModal.solucion}
      />

      {isSecondaryModalOpen && (
        <Modal
          isOpen={isSecondaryModalOpen}
          onRequestClose={closeSecondaryModal}
          contentLabel={modalType === 'newProblem' ? 'Agregar Nuevo Problema' : 'Editar Problema'}
          className="secondary-modal"
          overlayClassName="secondary-modal-overlay"
        >
          <div className="faq-content">
            <h2>{modalType === 'newProblem' ? 'Agregar Nuevo Problema' : 'Editar Problema'}</h2>
            <button onClick={closeSecondaryModal} className="close-secondary-modal">X</button>
            <form onSubmit={handleSubmit} className="faq-content">
              <div className="form-group">
                <label>
                  Aplicación:
                  <select
                    name="aplicacion"
                    value={modalData.aplicacion}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar Aplicativo...</option>
                    {aplicativos.map((aplicacion, index) => (
                      <option key={index} value={aplicacion}>{aplicacion}</option>
                    ))}
                  </select>
                  {formErrors.aplicacion && <span className="error-message">{formErrors.aplicacion}</span>}
                </label>
              </div>
              <div className="form-group">
                <label>
                  Descripción:
                  <textarea
                    name="descripcion"
                    placeholder="Descripción"
                    value={modalData.descripcion}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.description && <span className="error-message">{formErrors.description}</span>}
                </label>
              </div>
              <div className="form-group">
                <label>
                  Solución:
                  <textarea
                    name="solucion"
                    placeholder="Solución"
                    value={modalData.solucion}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.solucion && <span className="error-message">{formErrors.solucion}</span>}
                </label>
                <button type="submit" className="submit-button">{modalType === 'newProblem' ? 'Agregar Problema' : 'Actualizar Problema'}</button>
                <button className="canceledAddProblem-button"type="button" onClick={closeSecondaryModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </Modal>
    )}
    {/*  Modal para Visualización Mejorada */}
    {isEnhancedViewModalOpen && (
  <Modal
    isOpen={isEnhancedViewModalOpen}
    onRequestClose={closeEnhancedViewModal}
    contentLabel="Visualización Mejorada"
    className="enhanced-view-modal"
    overlayClassName="enhanced-view-overlay"
  >
    <div className='enhanced-view-content'>
      <h2>Detalles del Problema</h2>
      <button onClick={closeEnhancedViewModal} className='close-view-modal'>X</button>
      {enhancedViewData ? (
        <div>
          <h3>{enhancedViewData.aplicacion}</h3>
          <p><strong>Descripción:</strong> {enhancedViewData.descripcion}</p>
          <p><strong>Solución:</strong> {enhancedViewData.solucion}</p>

          {/* Sección de comentarios */}
          <div className="comments-section">
            <h4>Comentarios</h4>
            {comments.length > 0 ? (
              <ul>
                {comments.map(comment => (
                  <li key={comment.id}>
                    <strong>{comment.userId}</strong> dijo: {comment.comment} <em>({new Date(comment.date).toLocaleString()})</em>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay comentarios aún.</p>
            )}

            {/* Formulario para enviar un nuevo comentario */}

          {!isAdmin &&(
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario aquí..."
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">Enviar Comentario</button>
            </form>
            )}
          </div>
        </div>
      ) : (
        <p>No hay detalles disponibles.</p>
      )}
    </div>
  </Modal>
)}

      {confirmationModal.isOpen && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onConfirm={confirmationModal.onConfirm}
          onCancel={confirmationModal.onCancel}
          message={confirmationModal.message}
          descripcion={confirmationModal.descripcion}
          solucion={confirmationModal.solucion}
        />
      )}


      <ToastContainer />
    </>
  );
}

export default FQA;
