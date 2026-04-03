class FirebaseAuthService {
    constructor() {
        this.listeners = [];
        this.currentUser = null; 
    }

    onAuthStateChanged(callback) {
        this.listeners.push(callback);
        
        authInstance.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch the custom role data from Firestore
                try {
                    const userDoc = await db.collection("users").doc(firebaseUser.uid).get();
                    if (userDoc.exists) {
                        const data = userDoc.data();
                        this.currentUser = { 
                            email: firebaseUser.email, 
                            role: data.role, 
                            name: data.name,
                            uid: firebaseUser.uid,
                            classId: data.classId
                        };
                    } else {
                        // The user's document was deleted by Admin! Reject login securely.
                        console.error("Access Restricted: Profile document does not exist.");
                        await authInstance.signOut();
                        this.currentUser = null;
                        this.notifyListeners();
                        return;
                    }
                } catch (err) {
                    console.error("Error fetching user role", err);
                    this.currentUser = { email: firebaseUser.email, role: 'student', name: 'Data Load Error' };
                }
            } else {
                this.currentUser = null;
            }
            this.notifyListeners();
        });
    }

    notifyListeners() {
        this.listeners.forEach(cb => cb(this.currentUser));
    }

    async signIn(email, password) {
        try {
            await authInstance.signInWithEmailAndPassword(email, password);
        } catch (error) {
            throw new Error("Invalid username or password");
        }
    }

    async signOut() {
        return authInstance.signOut();
    }

    async registerNewAccount(userId, password, role, name, classId = "", mobile = "", aadhar = "", address = "") {
        try {
            const email = userId.includes('@') ? userId : `${userId}@vidya.edu`;
            const userCredential = await authSecondary.createUserWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;
            
            // Store permanent role securely in Firestore
            await db.collection("users").doc(uid).set({
                name: name,
                role: role,
                classId: classId,
                mobile: mobile,
                aadhar: aadhar,
                address: address,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Sign out the secondary instance immediately so it doesn't cross-pollinate
            await authSecondary.signOut();
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

// Instantiate the globally available auth service 
const auth = new FirebaseAuthService();
