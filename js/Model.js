import db from "./getDbCon";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const saveMessage = async (message, id) => {
  if (!id) {
    try {
      await addDoc(collection(db, "messages"), message);
      alert("mensagem salva com sucesso!");
    } catch (e) {
      alert("ocorreu um erro ao salvar " + e.message);
    }
  } else {
    try {
      await setDoc(doc(db, "messages", id), message);
      alert("mensagem editada com sucesso");
    } catch (e) {
      alert("ocorreu um erro ao editar " + e.message);
    }
  }
};

export const getAllCategories = async (array) => {
  try {
    const categoryRef = collection(db, "category");
    const q = query(categoryRef, orderBy("priority", "asc"));
    const categories = await getDocs(q);
    categories.forEach((doc) => {
      array.push({ ...doc.data(), id: doc.id });
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const getAllMessages = async (array) => {
  const collectionRef = collection(db, "messages");
  const messages = await getDocs(collectionRef);
  messages.forEach((doc) => {
    array.push({ ...doc.data(), id: doc.id });
  });
};

export const getMessagesByCategory = async (array, id) => {
  try {
    const messageRef = collection(db, "messages");
    const q = query(messageRef, where("category.id", "==", id));
    const messages = await getDocs(q);
    messages.forEach((doc) => {
      array.push({ ...doc.data(), id: doc.id });
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const deleteMessage = async (docRef) => {
  try {
    await deleteDoc(doc(db, "messages", docRef));
  } catch (e) {
    console.log("erro ao deletar documento " + e.message);
  }
};

export const getMessage = async (id) => {
  try {
    const docRef = doc(db, "messages", id);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) return { ...docSnap.data(), messageId: doc.id };
  } catch (e) {
    console.log("erro ao buscar documento " + e.message);
  }
};
