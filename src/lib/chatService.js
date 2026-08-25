import { 
  db 
} from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  updateDoc 
} from 'firebase/firestore';

/**
 * Listen in real time to messages for a specific chat/user
 */
export function subscribeChatMessages(chatId, callback) {
  if (!chatId) return () => {};

  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    callback(messages);
  }, (err) => {
    console.warn('Chat messages subscription notice:', err.message);
  });
}

/**
 * Listen in real time to all active chats (for Admin DM Hub)
 */
export function subscribeAllChats(callback) {
  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, orderBy('updatedAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    callback(chats);
  }, (err) => {
    console.warn('All chats subscription notice:', err.message);
  });
}

/**
 * Send a message from a User to Admin
 */
export async function sendUserChatMessage(user, text) {
  if (!user || !user.uid || !text.trim()) return;

  const chatId = user.uid;
  const chatDocRef = doc(db, 'chats', chatId);
  const messagesColRef = collection(db, 'chats', chatId, 'messages');

  const messageData = {
    senderId: user.uid,
    senderName: user.displayName || user.email?.split('@')[0] || 'User',
    senderPhoto: user.photoURL || '',
    senderEmail: user.email || '',
    text: text.trim(),
    isAdmin: false,
    reactions: {},
    createdAt: serverTimestamp()
  };

  // 1. Add to messages subcollection
  await addDoc(messagesColRef, messageData);

  // 2. Update chat metadata
  await setDoc(chatDocRef, {
    userId: user.uid,
    userName: user.displayName || user.email?.split('@')[0] || 'User',
    userPhoto: user.photoURL || '',
    userEmail: user.email || '',
    lastMessage: text.trim(),
    lastSenderId: user.uid,
    unreadByAdmin: true,
    unreadByUser: false,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

/**
 * Send a message from Admin to a User
 */
export async function sendAdminChatMessage(chatId, text, adminName = 'Bhavesh Patil') {
  if (!chatId || !text.trim()) return;

  const chatDocRef = doc(db, 'chats', chatId);
  const messagesColRef = collection(db, 'chats', chatId, 'messages');

  const messageData = {
    senderId: 'admin',
    senderName: adminName,
    senderPhoto: '/assets/bhavesh-profile.png',
    senderEmail: 'bhaveshpatil4251@gmail.com',
    text: text.trim(),
    isAdmin: true,
    reactions: {},
    createdAt: serverTimestamp()
  };

  // 1. Add to messages subcollection
  await addDoc(messagesColRef, messageData);

  // 2. Update chat metadata
  await updateDoc(chatDocRef, {
    lastMessage: text.trim(),
    lastSenderId: 'admin',
    unreadByUser: true,
    unreadByAdmin: false,
    updatedAt: serverTimestamp()
  });
}

/**
 * Toggle heart/emoji reaction on a message
 */
export async function toggleMessageReaction(chatId, messageId, emoji, userId) {
  if (!chatId || !messageId || !emoji || !userId) return;

  const msgRef = doc(db, 'chats', chatId, 'messages', messageId);
  const snap = await getDoc(msgRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const currentReactions = data.reactions || {};
  const usersForEmoji = currentReactions[emoji] || [];

  let newUsersForEmoji;
  if (usersForEmoji.includes(userId)) {
    newUsersForEmoji = usersForEmoji.filter((id) => id !== userId);
  } else {
    newUsersForEmoji = [...usersForEmoji, userId];
  }

  const updatedReactions = { ...currentReactions, [emoji]: newUsersForEmoji };
  if (newUsersForEmoji.length === 0) {
    delete updatedReactions[emoji];
  }

  await updateDoc(msgRef, { reactions: updatedReactions });
}
