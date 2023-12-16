
const userData = require('../model/account/accountModel')

//const saltRounds = 10

async function updateUserProfile(userId, avatarPath, userData, con) {
  try {
    const { fullname, email, username, phone } = userData;

    // Update user profile in the database
    await con.execute(
      'UPDATE users SET fullname = ?, email = ?, avatar = ?, username = ?, phone = ? WHERE user_id = ?',
      [fullname, email, avatarPath, username, phone, userId]
    );

    console.log('User profile updated successfully.');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// async function validateCurrentPassword(userId, currentPassword, con) {
//   const [rows, fields] = await con.execute(
//       'SELECT * FROM users WHERE user_id = ?',
//       [userId]
//   );

//   if (rows.length > 0) {
//       const user = rows[0];
//       return await bcrypt.compare(currentPassword, user.password);
//   }

//   return false;
// }

// async function updatePassword(userId, newPassword, con) {
//   // Hash the new password before updating
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   await con.execute(
//       'UPDATE users SET password = ? WHERE user_id = ?',
//       [hashedPassword, userId]
    
//   );
//   console.log('...........')  
// }
// const bcrypt = require('bcrypt');
// const con = require('../database/db');

// async function validateCurrentPassword(userId, currentPassword, con) {
//   const [rows, fields] = await con.execute(
//     'SELECT * FROM users WHERE user_id = ?',
//     [userId]
//   );

//   if (rows.length > 0) {
//     const user = rows[0];
//     return await bcrypt.compare(currentPassword, user.password);
//   }

//   return false;
// }

// async function updatePassword(userId, newPassword) {
//   console.log('Updating password for user ID:', userId);
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   console.log('Hashed Password:', hashedPassword);
//   await con.execute(
//     'UPDATE users SET password = ? WHERE user_id = ?',
//     [hashedPassword, userId]
//   );
//   console.log('Password updated successfully.');
// }

// module.exports = { validateCurrentPassword, updatePassword };
module.exports = { updateUserProfile };

