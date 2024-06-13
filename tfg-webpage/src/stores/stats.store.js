import { defineStore } from "pinia";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

export const useStatsStore = defineStore({
  id: 'stats',
  state: () => ({
    totalGames: parseInt(localStorage.getItem('totalGames')) || 0,
    gamesData: JSON.parse(localStorage.getItem('gamesData')) || {}, 
    subscription: null
  }),

  actions: {
    // Obtener las estadísticas de los juegos del usuario al iniciar sesión
    fetchUserGamesDocs(userUID) {
      const db = getFirestore();
      const gamesRef = collection(db, `users/${userUID}/games`);

      // Manejar suscripción previa
      if (this.subscription) {
        this.subscription();
        this.subscription = null;
      }

      // Configurar nueva suscripción
      this.subscription = onSnapshot(gamesRef, (snapshot) => {
        this.totalGames = snapshot.size;
        this.gamesData = snapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});

        // Guardar en localStorage
        localStorage.setItem('totalGames', this.totalGames.toString());
        localStorage.setItem('gamesData', JSON.stringify(this.gamesData));
      }, (error) => {
        console.error("Error fetching games data: ", error);
      });
    },

    // Limpiar datos al cerrar sesión
    clearData() {
      localStorage.removeItem('totalGames');
      localStorage.removeItem('gamesData');
      this.totalGames = 0;
      this.gamesData = {};

      // Desuscribirse de Firebase
      if (this.subscription) {
        this.subscription();
        this.subscription = null;
      }
    }
  }
});
