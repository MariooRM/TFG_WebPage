const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Function to update the leaderboard with the top 5 users based on KILLS
 */
exports.updateLeaderboardKills = functions.pubsub.schedule('0 0 * * 1').onRun(async (context) => {
  const db = admin.firestore();
  
  try {
    // Your logic to fetch and process user data

    // Example: Fetch user data and calculate kills
    const usersSnapshot = await db.collection('users').get();
    const leaderboard = [];

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const gamesSnapshot = await db.collection(`users/${userId}/games`).get();

      let totalKills = 0;
      for (const gameDoc of gamesSnapshot.docs) {
        const gameData = gameDoc.data();
        if (gameData.kills) {
          totalKills += gameData.kills;
        }
      }

      // Prepare leaderboard data
      const userData = userDoc.data();
      const userProfileImage = userData.profileImg || 'https://firebasestorage.googleapis.com/v0/b/tfg-mariorodrigomarcos.appspot.com/o/profile_images%2FProfile-icon.jpg?alt=media&token=92a5ee1e-7cbe-44cc-8f9d-46610b213b4f'; // Default to empty string if undefined

      leaderboard.push({
        rank: 0, // Placeholder rank
        username: userData.username,
        profileImg: userProfileImage,
        kills: totalKills
      });
    }

    // Sort by kills and take the top 5
    leaderboard.sort((a, b) => b.kills - a.kills);
    leaderboard.forEach((user, index) => {
        user.rank = index + 1; // Assign a rank to each user
      });
    const top5 = leaderboard.slice(0, 5);

    // Update Firestore with the top 5 leaderboard
    await db.collection('leaderboard').doc('kills').set({ leaderboard: top5 });

    console.log('Leaderboard updated successfully');
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
});


/**
 * Function to update the leaderboard with the top 5 users based on DEATHS
 */
exports.updateLeaderboardDeaths = functions.pubsub.schedule('0 0 * * 1').onRun(async (context) => {
  const db = admin.firestore();
  
  try {
    const usersSnapshot = await db.collection('users').get();
    const leaderboard = [];

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const gamesSnapshot = await db.collection(`users/${userId}/games`).get();

      let totalDeaths = 0;
      for (const gameDoc of gamesSnapshot.docs) {
        const gameData = gameDoc.data();
        if (gameData.deaths) {
          totalDeaths += gameData.deaths;
        }
      }

      const userData = userDoc.data();
      const userProfileImage = userData.profileImg || 'https://firebasestorage.googleapis.com/v0/b/tfg-mariorodrigomarcos.appspot.com/o/profile_images%2FProfile-icon.jpg?alt=media&token=92a5ee1e-7cbe-44cc-8f9d-46610b213b4f'; // Default image

      leaderboard.push({
        rank: 0, 
        username: userData.username,
        profileImg: userProfileImage,
        deaths: totalDeaths
      });
    }

    
    leaderboard.sort((a, b) => a.deaths - b.deaths);
    leaderboard.forEach((user, index) => {
      user.rank = index + 1; 
    });
    const top5 = leaderboard.slice(0, 5);
    await db.collection('leaderboard').doc('deaths').set({ leaderboard: top5 });
    console.log('Leaderboard updated successfully');
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
});


/**
 * Function to update the leaderboard with the top 5 users based on HEADSHOTS
 */
exports.updateLeaderboardHeadshots = functions.pubsub.schedule('0 0 * * 1').onRun(async (context) => {
  const db = admin.firestore();
  
  try {
   
    const usersSnapshot = await db.collection('users').get();
    const leaderboard = [];

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const gamesSnapshot = await db.collection(`users/${userId}/games`).get();

      let totalHeadshots = 0;
      for (const gameDoc of gamesSnapshot.docs) {
        const gameData = gameDoc.data();
        if (gameData.headshots) {
          totalHeadshots += gameData.headshots;
        }
      }

      const userData = userDoc.data();
      const userProfileImage = userData.profileImg || 'https://firebasestorage.googleapis.com/v0/b/tfg-mariorodrigomarcos.appspot.com/o/profile_images%2FProfile-icon.jpg?alt=media&token=92a5ee1e-7cbe-44cc-8f9d-46610b213b4f'; // Default to empty string if undefined

      leaderboard.push({
        rank: 0, 
        username: userData.username,
        profileImg: userProfileImage,
        headshots: totalHeadshots
      });
    }

    leaderboard.sort((a, b) => b.headshots - a.headshots);
    leaderboard.forEach((user, index) => {
        user.rank = index + 1; 
      });
    const top5 = leaderboard.slice(0, 5);

   
    await db.collection('leaderboard').doc('headshots').set({ leaderboard: top5 });

    console.log('Leaderboard updated successfully');
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
});


/**
 * Function to update the leaderboard with the top 5 users based on the highest KD
 */
exports.updateLeaderboardKd = functions.pubsub.schedule('0 0 * * 1').onRun(async (context) => {
  const db = admin.firestore();
  
  try {
    // Fetch all user data
    const usersSnapshot = await db.collection('users').get();
    const leaderboard = [];

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const gamesSnapshot = await db.collection(`users/${userId}/games`).get();

      // Initialize a variable to track the highest KD
      let highestKd = 0;

      for (const gameDoc of gamesSnapshot.docs) {
        const gameData = gameDoc.data();

        // Update highest KD if the current KD is higher
        if (gameData.kd && gameData.kd > highestKd) {
          highestKd = gameData.kd;
        }
      }

      // Prepare leaderboard data
      const userData = userDoc.data();
      const userProfileImage = userData.profileImg || 'https://firebasestorage.googleapis.com/v0/b/tfg-mariorodrigomarcos.appspot.com/o/profile_images%2FProfile-icon.jpg?alt=media&token=92a5ee1e-7cbe-44cc-8f9d-46610b213b4f'; // Default image

      leaderboard.push({
        rank: 0, 
        username: userData.username,
        profileImg: userProfileImage,
        kd: highestKd 
      });
    }

    // Sort by KD in descending order (highest KD first)
    leaderboard.sort((a, b) => b.kd - a.kd);
    leaderboard.forEach((user, index) => {
      user.rank = index + 1; // Assign ranks based on the sorted list
    });

    const top5 = leaderboard.slice(0, 5);
    await db.collection('leaderboard').doc('kd').set({ leaderboard: top5 });
    console.log('Leaderboard updated successfully');
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
});
