import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { INITIAL_STUDENTS, INITIAL_POSTS, INITIAL_ADMIN_PROFILE } from '../data/seedData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('cc_theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cc_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('cc_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [profileRequests, setProfileRequests] = useState([]);
  const [moderatorIds, setModeratorIds] = useState([]);
  const [cloudConnected, setCloudConnected] = useState(false);

  const [adminProfile, setAdminProfile] = useState(() => {
    const saved = localStorage.getItem('cc_admin_profile');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_PROFILE;
  });

  const [adminAuth, setAdminAuth] = useState(() => {
    const saved = localStorage.getItem('cc_admin_auth');
    return saved ? JSON.parse(saved) : { email: 'admin@campusconnect.edu', password: 'admin123' };
  });

  const moderatorCreds = { email: 'mod@campusconnect.edu', password: 'mod123' };

  useEffect(() => {
    const unsubProfile = onSnapshot(
      doc(db, 'settings', 'admin_profile'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setAdminProfile(data);
          localStorage.setItem('cc_admin_profile', JSON.stringify(data));
        }
      },
      (err) => console.warn('Admin profile listener notice:', err)
    );

    // UPDATED (1/3): Listen to Firestore settings/admin_auth in real time across all devices
    const unsubAdminAuth = onSnapshot(
      doc(db, 'settings', 'admin_auth'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.email && data.password) {
            const syncedCreds = {
              email: String(data.email).trim().toLowerCase(),
              password: String(data.password).trim()
            };
            setAdminAuth(syncedCreds);
            localStorage.setItem('cc_admin_auth', JSON.stringify(syncedCreds));
          }
        }
      },
      (err) => console.warn('Admin auth listener notice:', err)
    );

    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snap) => {
        setCloudConnected(true);
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
          setStudents(list);
        }
      },
      (err) => {
        console.error('Firestore Students Listener Error:', err);
        setCloudConnected(false);
      }
    );

    const unsubPosts = onSnapshot(
      collection(db, 'posts'),
      (snap) => {
        setCloudConnected(true);
        const list = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
        list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setPosts(list);
      },
      (err) => {
        console.error('Firestore Posts Listener Error:', err);
        setCloudConnected(false);
      }
    );

    const unsubRequests = onSnapshot(
      collection(db, 'profile_requests'),
      (snap) => {
        const list = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
        setProfileRequests(list);
      },
      (err) => console.error('Profile Requests Listener Error:', err)
    );

    const unsubMods = onSnapshot(
      collection(db, 'moderators'),
      (snap) => {
        const ids = snap.docs.map((d) => d.id);
        setModeratorIds(ids);
      },
      (err) => console.error('Moderators Listener Error:', err)
    );

    return () => {
      unsubProfile();
      unsubAdminAuth();
      unsubStudents();
      unsubPosts();
      unsubRequests();
      unsubMods();
    };
  }, []);

  useEffect(() => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        isModerator: moderatorIds.includes(String(s.id))
      }))
    );
  }, [moderatorIds]);

  useEffect(() => {
    localStorage.setItem('cc_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cc_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('cc_admin_profile', JSON.stringify(adminProfile));
  }, [adminProfile]);

  useEffect(() => {
    localStorage.setItem('cc_admin_auth', JSON.stringify(adminAuth));
  }, [adminAuth]);

  const loginStudent = (identifier) => {
    const cleanInput = (identifier || '').trim().toLowerCase();
    const digitsOnly = (identifier || '').replace(/[^0-9]/g, '');

    const match = students.find((s) => {
      const studentDigits = (s.phone || '').replace(/[^0-9]/g, '');
      const phoneMatch = digitsOnly.length >= 10 && studentDigits.includes(digitsOnly);
      const codeMatch = s.dscCode && s.dscCode.toLowerCase() === cleanInput;
      return phoneMatch || codeMatch;
    });

    if (match) {
      const isMod = moderatorIds.includes(String(match.id));
      setCurrentUser({
        role: 'student',
        isModerator: isMod,
        data: { ...match, isModerator: isMod }
      });
      return { success: true };
    }

    return {
      success: false,
      message: 'No student matches this Mobile Number or DSC Code in the verified roll. Contact administration.'
    };
  };

  const loginModerator = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    if (cleanEmail === moderatorCreds.email && cleanPass === moderatorCreds.password) {
      setCurrentUser({
        role: 'moderator',
        isModerator: true,
        data: { name: 'Faculty Moderator', email: cleanEmail }
      });
      return { success: true };
    }
    return { success: false, message: 'Invalid Moderator email or password.' };
  };

  // UPDATED (2/3): Removed hardcoded default email/password fallback so old credentials stop working once changed
  const loginAdmin = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const storedEmail = (adminAuth?.email || 'admin@campusconnect.edu').trim().toLowerCase();
    const storedPass = (adminAuth?.password || 'admin123').trim();

    if (cleanEmail === storedEmail && cleanPass === storedPass) {
      setCurrentUser({
        role: 'admin',
        isModerator: true,
        data: { ...adminProfile, email: cleanEmail }
      });
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin email or password.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const submitPost = async (postData) => {
    const isPrivileged =
      currentUser?.role === 'admin' ||
      currentUser?.role === 'moderator' ||
      currentUser?.isModerator;

    const payload = {
      type: postData.type || 'material',
      title: (postData.title || '').trim(),
      category: postData.category || 'Lecture Notes',
      description: (postData.description || '').trim(),
      link: (postData.link || '').trim(),
      image: (postData.image || '').trim(),
      authorName: postData.authorName || currentUser?.data?.name || 'Classmate',
      authorIdentifier: postData.authorIdentifier || currentUser?.data?.dscCode || 'STUDENT',
      status: isPrivileged ? 'approved' : 'pending',
      date: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'posts'), payload);
      return isPrivileged;
    } catch (err) {
      console.error('FIRESTORE POST ERROR:', err);
      alert('Could not save post to cloud: ' + err.message);
      setPosts((prev) => [{ id: 'local_' + Date.now(), ...payload }, ...prev]);
      return isPrivileged;
    }
  };

  const approvePost = async (id) => {
    if (!id) return;
    const strId = String(id);
    setPosts((prev) =>
      prev.map((p) => (String(p.id) === strId ? { ...p, status: 'approved' } : p))
    );
    if (!strId.startsWith('local_')) {
      try {
        await updateDoc(doc(db, 'posts', strId), { status: 'approved' });
      } catch (err) {
        console.error('Error approving post:', err);
        alert('Firebase update error: ' + err.message);
      }
    }
  };

  const deletePost = async (id) => {
    if (!id) return;
    const strId = String(id);
    setPosts((prev) => prev.filter((p) => String(p.id) !== strId));
    if (!strId.startsWith('local_')) {
      try {
        await deleteDoc(doc(db, 'posts', strId));
      } catch (err) {
        console.error('Error deleting post in Firestore:', err);
        alert('Could not remove post from cloud: ' + err.message);
      }
    }
  };

  const rejectPost = deletePost;

  const addStudent = async (studentData) => {
    const newStudent = {
      id: 'std_' + Date.now(),
      isModerator: false,
      ...studentData
    };
    setStudents((prev) => [newStudent, ...prev]);
    try {
      await setDoc(doc(db, 'students', newStudent.id), newStudent);
    } catch (err) {
      console.error('Error adding single student to Firestore:', err);
    }
  };

  const importStudentsBatch = async (batchList) => {
    setStudents((prev) => [...prev, ...batchList]);
    try {
      for (let i = 0; i < batchList.length; i += 400) {
        const chunk = batchList.slice(i, i + 400);
        const batch = writeBatch(db);
        chunk.forEach((student) => {
          const ref = doc(db, 'students', String(student.id));
          batch.set(ref, student);
        });
        await batch.commit();
      }
      alert(`Cloud sync complete! ${batchList.length} students are now live across all devices.`);
    } catch (err) {
      console.error('Batch sync error:', err);
      alert('Local import worked, but cloud sync failed: ' + err.message);
    }
  };

  const deleteStudents = async (ids) => {
    const strIds = ids.map((id) => String(id));
    setStudents((prev) => prev.filter((s) => !strIds.includes(String(s.id))));
    try {
      const batch = writeBatch(db);
      ids.forEach((id) => {
        batch.delete(doc(db, 'students', String(id)));
      });
      await batch.commit();
    } catch (err) {
      console.error('Error deleting students from Firestore:', err);
    }
  };

  const requestProfileUpdate = async (studentId, changes) => {
    const cleanChanges = {};
    for (const [k, v] of Object.entries(changes || {})) {
      if (v !== undefined) {
        cleanChanges[k] = String(v || '').trim();
      }
    }

    const reqPayload = {
      studentId: String(studentId || ''),
      studentCode: currentUser?.data?.dscCode || '',
      studentName: currentUser?.data?.name || '',
      requestedChanges: cleanChanges,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'profile_requests'), reqPayload);
    } catch (err) {
      console.error('Error adding profile request:', err);
      setProfileRequests((prev) => [{ id: 'local_req_' + Date.now(), ...reqPayload }, ...prev]);
    }
  };

  const approveProfileUpdate = async (reqId) => {
    const req = profileRequests.find((r) => r.id === reqId);
    if (!req) return;

    setStudents((prev) =>
      prev.map((s) =>
        String(s.id) === String(req.studentId) || s.dscCode === req.studentCode
          ? { ...s, ...req.requestedChanges }
          : s
      )
    );

    if (currentUser?.data?.dscCode === req.studentCode) {
      setCurrentUser((prev) => ({
        ...prev,
        data: { ...prev.data, ...req.requestedChanges }
      }));
    }

    try {
      await updateDoc(doc(db, 'profile_requests', reqId), { status: 'approved' });
      await updateDoc(doc(db, 'students', String(req.studentId)), req.requestedChanges);
    } catch (err) {
      console.error('Error approving update:', err);
    }
  };

  const rejectProfileUpdate = async (reqId) => {
    try {
      await updateDoc(doc(db, 'profile_requests', reqId), { status: 'rejected' });
    } catch (err) {
      console.error('Error rejecting update:', err);
    }
  };

  const toggleStudentModerator = async (studentId) => {
    const strId = String(studentId);
    const exists = moderatorIds.includes(strId);
    try {
      if (exists) {
        await deleteDoc(doc(db, 'moderators', strId));
      } else {
        await setDoc(doc(db, 'moderators', strId), {
          appointedAt: serverTimestamp(),
          appointedBy: currentUser?.data?.email || 'admin'
        });
      }
    } catch (err) {
      console.error('Error toggling moderator:', err);
    }
  };

  const updateAdminProfileData = async (newProfile) => {
    setAdminProfile(newProfile);
    localStorage.setItem('cc_admin_profile', JSON.stringify(newProfile));
    try {
      await setDoc(doc(db, 'settings', 'admin_profile'), newProfile, { merge: true });
      alert('Admin Profile updated and synced across all devices live!');
    } catch (err) {
      console.error('Error saving admin profile to Firestore:', err);
    }
  };

  // UPDATED (3/3): Save new admin email & password directly to Firestore settings/admin_auth
  const updateAdminCredentials = async (email, password) => {
    const cleanCreds = {
      email: String(email || '').trim().toLowerCase(),
      password: String(password || '').trim()
    };
    setAdminAuth(cleanCreds);
    localStorage.setItem('cc_admin_auth', JSON.stringify(cleanCreds));

    if (currentUser?.role === 'admin') {
      setCurrentUser((prev) => ({
        ...prev,
        data: { ...prev.data, email: cleanCreds.email }
      }));
    }

    try {
      await setDoc(doc(db, 'settings', 'admin_auth'), cleanCreds, { merge: true });
      alert('Admin credentials updated and synced across all devices!');
    } catch (err) {
      console.error('Error saving admin credentials to Firestore:', err);
      alert('Saved locally, but cloud sync failed: ' + err.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        students,
        posts,
        profileRequests,
        adminProfile,
        adminAuth,
        cloudConnected,
        loginStudent,
        loginModerator,
        loginAdmin,
        logout,
        approvePost,
        rejectPost,
        deletePost,
        submitPost,
        requestProfileUpdate,
        approveProfileUpdate,
        rejectProfileUpdate,
        toggleStudentModerator,
        addStudent,
        importStudentsBatch,
        deleteStudents,
        updateAdminProfileData,
        updateAdminCredentials
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);