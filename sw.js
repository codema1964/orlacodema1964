// Importar scripts de Firebase compatibles con Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configuración de Firebase (necesaria en el SW también)
const firebaseConfig = {
  apiKey: "AIza" + "SyAZgttBrxRAeeRELVA-3j71hQZ4NbxoeNo",
  authDomain: "orlageneracion64.firebaseapp.com",
  projectId: "orlageneracion64",
  storageBucket: "orlageneracion64.firebasestorage.app",
  messagingSenderId: "550229291802",
  appId: "1:550229291802:web:1907dc83e4c3c0facc32a3"
};

// Inicializar Firebase en el Service Worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Manejador de mensajes en segundo plano (cuando la app está cerrada)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje en segundo plano recibido ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './Orla-Codema64.ico' // Icono de la notificación
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


// --- LÓGICA DE CACHÉ EXISTENTE (PWA) ---
const CACHE_NAME = 'orla-codema-v1';
const urlsToCache = [
  './',
  './index.html',
  './Orla-Codema64.ico'
];

// Instalar el Service Worker y cachear contenido
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Estrategia de respuesta: primero red, si falla, caché
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});