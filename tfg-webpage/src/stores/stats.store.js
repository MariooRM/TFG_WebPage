import { defineStore } from "pinia";
import { getFirestore, collection, onSnapshot, getDoc, doc } from "firebase/firestore";

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
   * @property {Array} killsRanking - An array containing the top 5 users based on kills.
   * @property {Array} deathsRanking - An array containing the top 5 users based on deaths.
   * @property {Array} headshotsRanking - An array containing the top 5 users based on headshots.
   * @property {Array} kdRanking - An array containing the top 5 users based on KD.
   * @property {Function|null} subscription - The unsubscribe function for the Firestore snapshot listener.
   */
  state: () => ({
    totalGames: parseInt(localStorage.getItem('totalGames')) || 0,
    gamesData: JSON.parse(localStorage.getItem('gamesData')) || {},
    killsRanking: localStorage.getItem('killsRanking') || [],
    deathsRanking: localStorage.getItem('deathsRanking') || [],
    headshotsRanking: localStorage.getItem('headshotsRanking') || [],
    kdRanking: localStorage.getItem('kdRanking') || [],
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
    },

    /**
     * @function fetchKillsLeaderboard
     * @description Fetches the top 5 users based on kills from Firestore and updates the state with the retrieved
     * @returns {void}
     */
    async fetchKillsLeaderboard() {
      try {
        const db = getFirestore();
        const docRef = doc(db, 'leaderboard', 'kills');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.killsRanking = docSnap.data().leaderboard;
          localStorage.setItem('killsRanking', this.killsRanking);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },

    /**
     * @function fetchDeathsLeaderboard
     * @description Fetches the top 5 users based on deaths from Firestore and updates the state with the retrieved
     * @returns {void}
     */
    async fetchDeathsLeaderboard() {
      try {
        const db = getFirestore();
        const docRef = doc(db, 'leaderboard', 'deaths');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.deathsRanking = docSnap.data().leaderboard;
          localStorage.setItem('deathsRanking', this.deathsRanking);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },

    /**
     * @function fetchHeadshotsLeaderboard
     * @description Fetches the top 5 users based on headshots from Firestore and updates the state with the retrieved
     * @returns {void}
     */
    async fetchHeadshotsLeaderboard() {
      try {
        const db = getFirestore();
        const docRef = doc(db, 'leaderboard', 'headshots');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.headshotsRanking = docSnap.data().leaderboard;
          localStorage.setItem('headshotsRanking', this.headshotsRanking);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },

    /**
     * @function fetchKDLeaderboard
     * @description Fetches the top 5 users based on KD from Firestore and updates the state with the retrieved
     * @returns {void}
     */
    async fetchKDLeaderboard() {
      try {
        const db = getFirestore();
        const docRef = doc(db, 'leaderboard', 'kd');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.kdRanking = docSnap.data().leaderboard;
          localStorage.setItem('kdRanking', this.kdRanking);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },

  }
});
