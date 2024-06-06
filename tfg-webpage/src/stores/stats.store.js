import { defineStore } from "pinia";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

export const useStatsStore = defineStore({
  id: 'stats',
  state: () => ({
    totalGames: localStorage.getItem('totalGames') || 0,
    gamesData: JSON.parse(localStorage.getItem('gamesData')) || {}, 
    suscription: null, 
  }),

  actions: {

    //Get user's games stats when logging in
    fetchUserGamesDocs(userUID) {
      const db = getFirestore();
      const gamesRef = collection(db, `users/${userUID}/games`);

      // Manage previous suscription
      if (this.suscription) {
        this.suscription();
        this.suscription = null;
      }

      // Configure new suscription
      this.suscription = onSnapshot(gamesRef, (snapshot) => {
        this.totalGames = snapshot.size;
        localStorage.setItem('totalGames', this.totalGames);
        
        this.gamesData = snapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});
        
        localStorage.setItem('gamesData', JSON.stringify(this.gamesData));
      }, (error) => {
        console.error("Error fetching games data: ", error);
      });
    },

    // Clear data when logging out
    clearData() {
      localStorage.removeItem('totalGames');
      localStorage.removeItem('gamesData');
      this.totalGames = 0;
      this.gamesData = {};

      // Desuscribe from Firebase
      if (this.suscription) {
        this.suscription();
        this.suscription = null;
      }
    }
  }
});
