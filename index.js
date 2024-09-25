
require('dotenv').config();

const express = require ('express');
const expressStaticGzip =  require('express-static-gzip');
const cors = require ('cors');
const axios = require ('axios');
const compression = require ('compression');
const helmet = require ('helmet');
const https =require('https');
const path = require('path');



const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
// Este middleware debe ir después de todas tus rutas definidas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
}));
app.use(compression());
app.use(express.json());

const allowedOrigins = ['http://localhost:8000','http://localhost:3000'];
app.use(cors({
  origin: function(origin, callback) {
    // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
    if (!origin) return callback(null, true);
    
    // Comprobar si el origen está en la lista de permitidos
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'El origen de la solicitud no está permitido por la política CORS.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'Auth'], // Cabeceras permitidas
  credentials: true, // Permitir envío de cookies
  optionsSuccessStatus: 200 // Para navegadores antiguos que no manejan bien el 204
}));

// Función para configurar las cabeceras de caché
const setCacheHeaders = (res, filePath) => {
  console.log(`Serving file: ${filePath}`);
  
  const fileName = path.basename(filePath);

  if (filePath.endsWith('.html')) {
    res.setHeader('Cache-Control', 'public, max-age=0');
  } else if (
    fileName.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|PNG)$/) ||
    fileName.includes('chunk.js') ||
    fileName.includes('vendors-') ||
    fileName.includes('bundle.js') ||
    fileName.includes('src_Prote') ||
    fileName.includes('Login_Login') ||
    fileName.includes('Maincontent')
  ) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    console.log(`Applied long-term caching to: ${filePath}`);
  } else {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    console.log(`Applied default caching to: ${filePath}`);
  }
};

// Configuración para servir archivos estáticos
const staticOptions = {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  setHeaders: setCacheHeaders,
  serveStatic: {
    extensions: ['html', 'js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'ico', 'svg', 'webp', 'PNG'],
    index: false,
  }
};

// Servir archivos desde múltiples directorios
['public', 'src', 'build', 'dist'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  app.use('/', expressStaticGzip(dirPath, staticOptions));
  console.log(`Serving static files from: ${dirPath}`);
});

// Middleware para loguear todas las solicitudes
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Ruta catch-all para SPA
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Crear una instancia de Axios con verificación SSL desactivada
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

function checkEnvVariables() {
  return new Promise((resolve, reject) => {
    const requiredEnvVars = ['REACT_APP_API_URL', 'REACT_APP_API_AUTH', 'REACT_APP_API_AUTHORIZATION'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

    console.log('Comprobando variables de entorno:');
    requiredEnvVars.forEach(varName => {
      console.log(`${varName}: ${process.env[varName] ? '[CONFIGURADO]' : '[NO CONFIGURADO]'}`);
    });

    if (missingEnvVars.length > 0) {
      reject(new Error(`Faltan las siguientes variables de entorno: ${missingEnvVars.join(', ')}`));
    } else {
      resolve();
    }
  });
}



// Rutas

app.get('/api/problems', async (req, res) => {
  try {
     
    const aplicacion = req.query.aplicacion;

    if (!aplicacion) {
      return res.status(400).json({ error: 'Se requiere especificar una aplicación' });
    }

    console.log(`Haciendo petición a la API para la aplicación: ${aplicacion}`);
    
    const apiUrl = `${process.env.REACT_APP_API_URL}?aplicacion=${encodeURIComponent(aplicacion)}`;


    const response = await axiosInstance.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Auth': process.env.REACT_APP_API_AUTH,
        'Authorization': `Bearer ${process.env.REACT_APP_API_AUTHORIZATION}`
      },
    });

    console.log('Respuesta de la API recibida');

    if (response.data && Array.isArray(response.data.data)) {
      const transformedData = response.data.data
        .filter(problem => problem.activo)
        .map(problem => ({
          id: problem._id,
          aplicacion: problem.aplicacion,
          descripcion: problem.descripcion,
          solucion: problem.solucion,
          activo: problem.activo,
        }));

      console.log('Datos transformados:', JSON.stringify(transformedData, null, 2));
      res.json(transformedData);
    } else {
      throw new Error('Formato de respuesta inesperado');
    }
  } catch (err) {
    console.error('Error detallado:', err);
    res.status(500).json({ error: 'Error al cargar los problemas. Por favor, intenta de nuevo más tarde.' });
  }
});

app.put('/api/problems/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const { id:_, activo:__, ...problemData } = req.body;


    const response = await axiosInstance.put(`${process.env.REACT_APP_API_URL}/${id}`, problemData, {
      headers: {
        'Content-Type': 'application/json',
        'Auth': process.env.REACT_APP_API_AUTH,
        'Authorization': `Bearer ${process.env.REACT_APP_API_AUTHORIZATION}`
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Error al actualizar el problema:', err.response ? err.response.data : err.message);
    res.status(err.response ? err.response.status : 500).json({ 
      error: err.response ? err.response.data : 'Error al actualizar el problema. Por favor, intenta de nuevo más tarde.' 
    });
  }
});

app.post('/api/problems', async (req, res) => {
  try {
    const response = await axiosInstance.post(process.env.REACT_APP_API_URL, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Auth': process.env.REACT_APP_API_AUTH,
        'Authorization': `Bearer ${process.env.REACT_APP_API_AUTHORIZATION}`
      }
    });
    res.status(201).json(response.data);
  } catch (err) {
    console.error('Error al crear el problema:', err);
    res.status(500).json({ error: 'Error al crear el problema. Por favor, intenta de nuevo más tarde.' });
  }
});

app.delete('/api/problems/:id', async (req, res) => {
  try {
    const response = await axiosInstance.delete(`${process.env.REACT_APP_API_URL}/${req.params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Auth': process.env.REACT_APP_API_AUTH,
        'Authorization': `Bearer ${process.env.REACT_APP_API_AUTHORIZATION}`
      },
      data: { activo: false }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Error al eliminar el problema:', err);
    res.status(500).json({ error: 'Error al eliminar el problema. Por favor, intenta de nuevo más tarde.' });
  }
});



// Iniciar servidor
checkEnvVariables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error en la configuración de variables de entorno:', error.message);
    process.exit(1);
  });