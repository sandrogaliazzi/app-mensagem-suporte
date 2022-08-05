import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  authDomain: "suporte-conectnet.firebaseapp.com",
  projectId: "suporte-conectnet",
  storageBucket: "suporte-conectnet.appspot.com",
  messagingSenderId: "991344199304",
  appId: "1:991344199304:web:2280f3edcde868f8aec13d",
};

// inicia o firebase
const app = initializeApp(firebaseConfig);

// inicia o banco de dados firestore e retorna a referencia do banco
const db = getFirestore(app);

export default db;
