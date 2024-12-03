import { Injectable, inject, signal } from "@angular/core";
import { Auth, UserCredential, browserSessionPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from "@angular/fire/auth";
import { Observable, from } from "rxjs";
import { UserInterface } from "../interfaces/user.interface";
import { doc, Firestore, getDoc } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  firestore = inject(Firestore)
  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth)
  currentUserSignal = signal<UserInterface | null | undefined>(undefined)

  register(email: string, username: string, password: string): Observable<UserCredential> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
    .then(response => {
      return updateProfile(response.user, { displayName: username }).then(() => response)
    })

    return from(promise)
  }

  login(email: string, password: string): Observable<void> {
    const promise = this.firebaseAuth.setPersistence(browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(
          this.firebaseAuth,
          email,
          password
        )
      })
      .then(() => {})
  
    return from(promise)
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth)
    return from(promise)
  }

  async fetchCoreUserData(): Promise<any> {
    const auth = this.firebaseAuth.currentUser

    if (auth) {
      const uid = auth.uid
      const userRef = doc(this.firestore, `users/${uid}`)
      const userDocSnap = await getDoc(userRef)

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        return userData
      } else {
        return null
      }
    } else {
      return null
    }
  }
}