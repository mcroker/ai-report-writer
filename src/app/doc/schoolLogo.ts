import { Paragraph, ImageRun, AlignmentType } from 'docx';
import { getStorage, getBytes, ref } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyA0QqVjEEkgZa5aQ4WgpmmzPD87x8JtPeU",
    authDomain: "reportmaster-c0e2m.firebaseapp.com",
    projectId: "reportmaster-c0e2m",
    storageBucket: "reportmaster-c0e2m.firebasestorage.app",
    messagingSenderId: "747142594637",
    appId: "1:747142594637:web:6e840ee57fd9c90ed15c04"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();
const pathReference = ref(storage, 'logo.gif');
const logo = await getBytes(pathReference);

const imageWidth = 300;

export function schoolLogo(): Paragraph {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: logo,
            transformation: {
                width: imageWidth,
                height: imageWidth * 0.70,
            },
          })
        ]
      })
}