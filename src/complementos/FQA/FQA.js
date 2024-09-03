import React, { useState, useEffect, useCallback } from 'react';
import '../FQA/stylesF/FQA.css';
import {fetchProblems, addProblem, updateProblem, deleteProblem } from './FQAAPI';
import Modal from 'react-modal';
import axios from 'axios';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { useAuth } from '../../Login/AuthContext';
import NotificationTray from '../NotificationTray/NotificationTray';
import 'bootstrap/dist/css/bootstrap.min.css';



const FQA = ({ isOpen, onClose }) => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [error, setError] = useState(null);
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


  // const [notifications,setNotifications]=useState([]);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    message: '',
    descripcion: '',
    solucion: '',
    onConfirm: () => {},
    onCancel: () => {},
  });



  const { user } = useAuth();
  const isAdmin =user?.role === 'admin';

  const aplicativos = ['Efinet', 'Efiwiki', 'Intranet', 'Smartflex'];



  const filterProblems = useCallback(() => {
    if (!selectedApp) {
      // Si no hay ninguna aplicación seleccionada, no mostrar nada
      setFilteredProblems([]);
      return;
    }
  
    let filtered = problems;
  
    // Filtrar por la aplicación seleccionada
    filtered = filtered.filter(problem => problem.aplicacion === selectedApp);
  
    if (searchQuery) {
      filtered = filtered.filter(problem =>
        problem.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.solucion.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    setFilteredProblems(filtered);
  }, [selectedApp, problems, searchQuery]);

  useEffect(() => {
    filterProblems();
  }, [selectedApp, problems,searchQuery,filterProblems]);

  const loadProblems = useCallback(async () => {
    try {
      //si no  hay ninguna aplicacion seleccionada no carga nada//
      if (!selectedApp){
        setProblems([]);
        setFilteredProblems([]);
        return;
    }
    const data = await fetchProblems(selectedApp);  // Pasamos selectedApp como parámetro
    const filteredByApp = data.filter(problem => problem.aplicacion === selectedApp);






      // Actualiza el estado con los problemas filtrados por la aplicación seleccionada
      setProblems(filteredByApp);
      setFilteredProblems(filteredByApp);
  
      toast.success('Problemas cargados exitosamente.');
    } catch (err) {
      setError('Error al cargar los problemas. Intenta de nuevo más tarde.');
      toast.error('Error al cargar los problemas.');
    }
  }, [selectedApp]);

  useEffect(() => {
    if (isOpen && selectedApp) {
      loadProblems();
    }
  }, [isOpen, selectedApp, loadProblems ]);

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
  
    const problemId = enhancedViewData.id;
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


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Validar todos los campos
      await validateForm('aplicacion', modalData.aplicacion);
      await validateForm('descripcion', modalData.descripcion);
      await validateForm('solucion', modalData.solucion);
  
      setConfirmationModal({
        isOpen: true,
        message: modalType === 'newProblem' ? "¿Estás seguro de que quieres agregar este problema?" : "¿Estás seguro de que quieres actualizar este problema?",
        descripcion: modalData.descripcion,
        solucion: modalData.solucion,
        onConfirm: async () => {
          try {
            let updatedProblems;
            console.log('Enviando solicitud al servidor...', modalData);
            if (isAdmin) {
              if (modalType === 'newProblem') {
                const newProblem = await addProblem(modalData);
                updatedProblems = [...problems, newProblem];
                toast.success('Nuevo problema agregado exitosamente.');
                sendNotification('Un nuevo problema ha sido agregado.');
              } else if (modalType === 'editProblem') {
                const { aplicacion, descripcion, solucion } = modalData;
                const updatedProblem = await updateProblem(currentProblem.id, { aplicacion, descripcion, solucion });
                if (updatedProblem) {
                  updatedProblems = problems.map(p => p.id === updatedProblem.id ? updatedProblem : p);
                  toast.success('Problema actualizado exitosamente.');
                  sendNotification('Un problema ha sido modificado.');
                } else {
                  throw new Error('No se recibieron datos actualizados del servidor');
                }
              }
            }
  
            if (updatedProblems) {
              setProblems(updatedProblems);
              filterProblems();
              closeSecondaryModal();
              console.log('Solicitud procesada exitosamente.');
            }
          } catch (err) {
            console.error('Error en la solicitud:', err);
            console.log('Datos enviados:', modalData);
            setError(err.message);
  
            if (err.response) {
              console.error('Error en la respuesta del servidor:', err.response.status, err.response.data);
              toast.error(`Error del servidor: ${err.response.status} - ${err.response.data.message || 'Verifica los datos enviados.'}`);
            } else if (err.request) {
              console.error('No se recibió respuesta del servidor:', err.request);
              toast.error('No se recibió respuesta del servidor. Verifica tu conexión a internet.');
            } else {
              console.error('Error al configurar la solicitud:', err.message);
              toast.error('Error al configurar la solicitud. Revisa la consola para más detalles.');
            }
          } finally {
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          }
        },
        onCancel: () => {
          console.log('Solicitud cancelada por el usuario.');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }
      });
  
    } catch (validationError) {
      console.error('Error de validación:', validationError);
      toast.error('Error en la validación del formulario. Corrige los errores y vuelve a intentarlo.');
    }
  };




  const handleDelete = async (id) => {
    setConfirmationModal({
      isOpen: true,
      message: '¿Estás seguro de que deseas eliminar este problema?',
      descripcion: '',
      solucion: '',
      onConfirm: async () => {
        try {
          await deleteProblem(id);
          const updatedProblems = problems.filter(p => p.id !== id);
          setProblems(updatedProblems);
          filterProblems();
          toast.success('Problema eliminado exitosamente.');
        } catch (err) {
          setError(err.message);
          toast.error('Error al intentar eliminar el problema.');
        } finally {
          setConfirmationModal(prev => ({ ...prev, isOpen: false })); // Close confirmation modal
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
