import { defineStore } from "pinia";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

/**
 * @module Stores/StatsStore
 * @description This is the store used for managing user stats information from Firestore.
 * @author Mario Rodrigo Marcos @MariooRM on GitHub
 */
export const useStatsStore = defineStore({
  id: 'stats',

  /**
   * Defines the initial state of the stats store.
   * @typedef {Object} UserStatsState
   * @property {number} totalGames - The total number of games associated with the user.
   * @property {Object} gamesData - An object containing data for each game, keyed by game ID.
   * @property {Function|null} subscription - The unsubscribe function for the Firestore snapshot listener.
   */
  state: () => ({
    totalGames: parseInt(localStorage.getItem('totalGames')) || 0,
    gamesData: JSON.parse(localStorage.getItem('gamesData')) || {},
    killsRanking: [],
    subscription: null
  }),

  actions: {
    /**
     * @function fetchUserGamesDocs
     * @description Fetches user game documents from Firestore and updates the state with the retrieved data. Sets up a real-time listener for game data changes.
     * @param {string} userUID - The unique identifier of the user whose game data is to be fetched.
     * @returns {void}
     */
    fetchUserGamesDocs(userUID) {
      const db = getFirestore();
      const gamesRef = collection(db, `users/${userUID}/games`);

      // Handle previous subscription
      if (this.subscription) {
        this.subscription();
        this.subscription = null;
      }

      // Set up new subscription
      this.subscription = onSnapshot(gamesRef, (snapshot) => {
        this.totalGames = snapshot.size;
        this.gamesData = snapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});

        // Save to localStorage
        localStorage.setItem('totalGames', this.totalGames.toString());
        localStorage.setItem('gamesData', JSON.stringify(this.gamesData));
      }, (error) => {
        console.error("Error fetching games data: ", error);
      });
    },

    /**
     * @function clearData
     * @description Clears game data from local storage and unsubscribes from Firestore updates. Resets state to initial values.
     * @returns {void}
     */
    clearData() {
      localStorage.removeItem('totalGames');
      localStorage.removeItem('gamesData');
      this.totalGames = 0;
      this.gamesData = {};

      // Unsubscribe from Firestore updates
      if (this.subscription) {
        this.subscription();
        this.subscription = null;
      }
    }
  }
});
