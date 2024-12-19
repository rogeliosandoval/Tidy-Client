import { Injectable, inject, signal } from '@angular/core'
import { Auth, UserCredential, browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth'
import { Observable, from } from 'rxjs'
import { UserInterface } from '../interfaces/user.interface'
import { doc, Firestore, getDoc } from '@angular/fire/firestore'
import { Storage, getDownloadURL, ref } from '@angular/fire/storage'

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  storage = inject(Storage)
  firestore = inject(Firestore)
  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth)
  currentUserSignal = signal<UserInterface | null | undefined>(undefined)
  coreUserData = signal<any>(undefined)
  coreBusinessData = signal<any>(undefined)
  userAvatar = signal<string | null>('')
  businessAvatar = signal<string | null>('')

  register(email: string, username: string, password: string): Observable<UserCredential> {
    const promise = this.firebaseAuth.setPersistence(browserSessionPersistence)
      .then(() => {
        return createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      })
      .then(async(response: UserCredential) => {
        await updateProfile(response.user, { displayName: username })
        return response
      })

    return from(promise)
  }

  loginWithSessionPersistence(email: string, password: string): Observable<void> {
    const promise = this.firebaseAuth.setPersistence(browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(this.firebaseAuth, email, password)
      })
      .then(() => {})
    
    return from(promise)
  }

  loginWithLocalPersistence(email: string, password: string): Observable<void> {
    const promise = this.firebaseAuth.setPersistence(browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(this.firebaseAuth, email, password)
      })
      .then(() => {})
    
    return from(promise)
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth)
    return from(promise)
  }

  async fetchCoreUserData(): Promise<void> {
    const auth = this.firebaseAuth.currentUser

    if (auth) {
      const uid = auth.uid
      const userRef = doc(this.firestore, `users/${uid}`)
      const userDocSnap = await getDoc(userRef)

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        this.coreUserData.set(userData)
      } else {
        this.coreUserData.set(null)
      }
    } else {
      this.coreUserData.set(null)
    }
  }

  async fetchCoreBusinessData(): Promise<void> {
    const auth = this.firebaseAuth.currentUser

    if (auth) {
      const uid = auth.uid
      const userRef = doc(this.firestore, `users/${uid}`)
      const userDocSnap = await getDoc(userRef)

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()

        if (userData['business_id']) {
          const businessId = userData['business_id']
          const businessRef = doc(this.firestore, `businesses/${businessId}`)
          const businessDocSnap = await getDoc(businessRef)

          if (businessDocSnap.exists()) {
            const businessData = businessDocSnap.data()
            this.coreBusinessData.set(businessData)
          } else {
            this.coreBusinessData.set(null)
          }
        } else {
          this.coreBusinessData.set(null)
        }
      } else {
        this.coreBusinessData.set(null)
      }
    } else {
      this.coreBusinessData.set(null)
    }
  }

  async fetchProfileAvatar(): Promise<void> {
    const filePath = `users/${this.coreUserData()?.uid}/avatar`
    const storageRef = ref(this.storage, filePath)

    try {
      const url = await getDownloadURL(storageRef)
      this.userAvatar.set(url)
    } catch {
      this.userAvatar.set(null)
    }
  }

  async fetchBusinessAvatar(): Promise<void> {
    const filePath = `businesses/${this.coreUserData()?.business_id}/avatar`
    const storageRef = ref(this.storage, filePath)

    try {
      const url = await getDownloadURL(storageRef)
      this.businessAvatar.set(url)
    } catch {
      this.businessAvatar.set(null)
    }
  }
}