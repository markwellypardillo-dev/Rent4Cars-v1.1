import { useState, FormEvent, useRef, ChangeEvent, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, User, MapPin, Camera, Save, Loader2, Upload, FileText, Download, Car, MessageSquare, Shield, Activity, Users, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationService } from '../services/dataService';
import MyRentals from './MyRentals';
import AdminRentals from './AdminRentals';
import AdminFleetManager from './AdminFleetManager';
import DarkModeToggle from './DarkModeToggle';
import { useBackButton } from '../hooks/useBackButton';

interface UserProfileProps {
  user: any;
  onClose: () => void;
  onUpdate: (updatedUser: any) => void;
}

export default function UserProfile({ user, onClose, onUpdate }: UserProfileProps) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || user.displayName || '');
  const [location, setLocation] = useState(user.user_metadata?.location || 'Davao City, PH');
  const isAdmin = user.email === 'admin@rent4cars.com';
  const defaultAdminAvatar = 'https://i.postimg.cc/SR63SW90/Face-Id.jpg';
  const [avatarUrl, setAvatarUrl] = useState(user.user_metadata?.avatar_url || (isAdmin ? defaultAdminAvatar : ''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportHtml, setReportHtml] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);
  const [showRentals, setShowRentals] = useState(false);
  const [showAdminRentals, setShowAdminRentals] = useState(false);
  const [showFleetManager, setShowFleetManager] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // We only want the back button to close UserProfile if no inner modal is open
  useBackButton(!showRentals && !showAdminRentals && !showFleetManager, onClose);

  const fetchReport = async () => {
    setLoadingReport(true);
    try {
      const html = await NotificationService.getReportHtml(user.id);
      setReportHtml(html);
      setShowReport(true);
    } catch (err) {
      setError('Failed to load activity report.');
    } finally {
      setLoadingReport(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image too large. Please select an image under 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress significantly to avoid hitting payload size limits
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setAvatarUrl(compressedBase64);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');

      // If it's a mock user (Bypass Mode) or Supabase isn't configured, handle locally
      if (user.id?.includes('mock') || isPlaceholder) {
        const updatedUser = {
          ...user,
          user_metadata: {
            ...user.user_metadata,
            full_name: fullName,
            location: location,
            avatar_url: avatarUrl
          }
        };
        onUpdate(updatedUser);
        setSuccess(true);
        setTimeout(onClose, 1500);
        return;
      }

      const { data, error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          location: location,
          avatar_url: avatarUrl
        }
      });

      if (error) throw error;
      
      onUpdate(data.user);
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${isAdmin ? 'px-6 md:px-0 md:p-6' : 'px-6'}`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col ${
          isAdmin 
            ? 'max-w-md md:max-w-none md:w-full md:h-full rounded-[2.5rem] md:rounded-3xl max-h-[90vh] md:max-h-[calc(100vh-3rem)]' 
            : 'max-w-md rounded-[2.5rem] max-h-[90vh]'
        }`}
      >
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
          <button onClick={onClose} className="p-2 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-md rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-white/50 dark:border-gray-700/50">
            <X size={20} />
          </button>
        </div>

        <div className={`p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1 ${isAdmin ? 'md:flex md:flex-col md:items-center' : ''}`}>
          <div className={isAdmin ? 'md:w-full md:max-w-4xl md:pt-10' : ''}>
            <div className="mb-6 text-center mt-2 shrink-0">
            <div className="relative inline-block group">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 shrink-0 bg-white/50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto overflow-hidden border border-white/50 dark:border-gray-700/50 backdrop-blur-md shadow-lg relative"
                >
                    {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement?.classList.add('fallback-shown');
                          }}
                        />
                    ) : (
                        <User size={48} className="text-primary" />
                    )}
                    {avatarUrl && (
                        <div className="absolute inset-0 flex items-center justify-center -z-10 bg-primary/10">
                           <User size={48} className="text-primary" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={20} className="text-white" />
                    </div>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-4 border-white dark:border-gray-900 shadow-md cursor-pointer pointer-events-none">
                    <Camera size={14} />
                </div>
            </div>
            <h2 className="text-3xl font-display font-bold mt-4 text-gray-900 dark:text-white">
              {isAdmin ? 'Admin Workspace' : 'Profile Settings'}
            </h2>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.email}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full font-mono border border-gray-200 dark:border-gray-700">ID: {user.id}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            {isAdmin ? (
               <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-8">
                 <div className="grid grid-cols-2 gap-4 md:gap-6 md:col-span-3">
                    <div className="bg-primary/10 border-2 border-primary/20 rounded-3xl p-5 md:p-8 flex flex-col justify-center items-center text-center transition-transform hover:scale-[1.02]">
                       <Shield size={28} className="text-primary mb-3" />
                       <h4 className="text-[10px] md:text-xs font-bold uppercase text-primary tracking-widest leading-tight mb-1">Root Access</h4>
                       <p className="text-2xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">Admin</p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/30 border-2 border-white/50 dark:border-gray-700/50 backdrop-blur-sm rounded-3xl p-5 md:p-8 flex flex-col justify-center items-center text-center transition-transform hover:scale-[1.02]">
                       <Activity size={28} className="text-gray-900 dark:text-white mb-3" />
                       <h4 className="text-[10px] md:text-xs font-bold uppercase text-gray-500 tracking-widest leading-tight mb-1">System Status</h4>
                       <p className="text-2xl md:text-4xl font-display font-bold text-green-500">Online</p>
                    </div>
                 </div>

                 <button
                  type="button"
                  onClick={() => setShowAdminRentals(true)}
                  className="w-full p-6 md:p-8 bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-800/50 dark:border-gray-700/50 text-white rounded-3xl font-bold hover:bg-gray-800 dark:hover:bg-gray-700 transition-all flex md:flex-col items-center md:justify-center gap-4 md:gap-6 shadow-xl text-left md:text-center md:col-span-1 group"
                >
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-white/10 rounded-full flex flex-shrink-0 items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <Car size={24} className="text-white md:w-10 md:h-10" />
                  </div>
                  <div>
                    <div className="text-lg md:text-2xl font-display mb-1 md:mb-2">Manage Rentals</div>
                    <div className="text-xs md:text-sm text-gray-400 font-normal">Review and approve bookings, manage fleet availability, and resolve current rental statuses.</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShowFleetManager(true)}
                  className="w-full p-6 md:p-8 bg-white/50 dark:bg-gray-800/30 backdrop-blur-md border border-white/50 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-3xl font-bold hover:border-primary dark:hover:border-primary transition-all flex md:flex-col items-center md:justify-center gap-4 md:gap-6 shadow-sm text-left md:text-center group md:col-span-1"
                >
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-white/50 dark:bg-gray-800/50 border border-white/50 dark:border-gray-700/50 rounded-full flex flex-shrink-0 items-center justify-center group-hover:scale-110 group-hover:text-primary transition-all duration-300">
                    <Settings size={24} className="text-gray-400 md:w-10 md:h-10" />
                  </div>
                  <div>
                    <div className="text-lg md:text-2xl font-display mb-1 md:mb-2">Fleet Inventory</div>
                    <div className="text-xs md:text-sm text-gray-500 font-normal">Dynamically add, edit price and features, or remove cars from the database.</div>
                  </div>
                </button>

                <div className="flex flex-col gap-4 md:gap-6">
                  <button
                    type="button"
                    onClick={fetchReport}
                    disabled={loadingReport}
                    className="w-full p-6 bg-primary/10 border-2 border-primary/20 text-primary rounded-3xl font-bold hover:bg-primary/20 transition-all flex items-center md:flex-col md:text-center md:justify-center gap-4 shadow-sm text-left flex-1 group relative overflow-hidden"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex flex-shrink-0 items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                      {loadingReport ? <Loader2 size={24} className="animate-spin" /> : <FileText size={24} />}
                    </div>
                    <div className="relative z-10">
                      <div className="text-lg font-display">Activity Reports</div>
                      <div className="text-xs text-primary/70 font-normal mt-0.5">{loadingReport ? 'Generating XSLT...' : 'View XSLT logs'}</div>
                    </div>
                  </button>

                  <div className="space-y-1">
                    <label className="text-[10px] md:text-xs uppercase font-bold text-gray-400 px-1 dark:text-gray-500">System Config</label>
                    <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/30 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm rounded-3xl px-5 py-4 md:py-6">
                      <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                         <Settings size={18} className="text-gray-500" /> Theme
                      </span>
                      <DarkModeToggle />
                    </div>
                  </div>
                </div>
               </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 px-1 dark:text-gray-500">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mark Pardillo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/50 dark:bg-gray-800/30 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all relative z-0"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 px-1 dark:text-gray-500">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" size={18} />
                    <input
                      type="text"
                      placeholder="e.g. Davao City, PH"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white/50 dark:bg-gray-800/30 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all relative z-0"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Profile Photo URL</label>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] uppercase font-bold text-primary hover:underline"
                    >
                      Browse Files
                    </button>
                  </div>
                  <div className="relative">
                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                    <input
                      type="text"
                      placeholder="Paste image URL here"
                      value={avatarUrl.startsWith('data:') ? 'Local file selected' : avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full bg-white/50 dark:bg-gray-800/30 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all text-ellipsis relative z-0"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 px-1 dark:text-gray-500">Appearance</label>
                  <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/30 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm rounded-2xl px-4 py-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white mt-1">Theme</span>
                    <DarkModeToggle />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-primary font-bold bg-primary/5 p-3 rounded-lg border border-primary/10">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="text-xs text-green-600 font-bold bg-green-50 p-3 rounded-lg border border-green-100">
                    Profile updated successfully!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-900/10 hover:bg-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Save size={20} />
                      Update Profile
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={fetchReport}
                  disabled={loadingReport}
                  className="w-full py-4 bg-white/50 dark:bg-gray-800/30 backdrop-blur-md border border-white/50 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-2xl font-bold hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mb-3"
                >
                  {loadingReport ? (
                    <Loader2 size={20} className="animate-spin text-primary" />
                  ) : (
                    <>
                      <FileText size={20} className="text-primary" />
                      View Activity Report (XSLT)
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowRentals(true)}
                  className="w-full py-4 bg-primary/10 backdrop-blur-md border border-primary/20 text-primary rounded-2xl font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  <Car size={20} />
                  Track My Rentals
                </button>
              </>
            )}
          </form>

          {showRentals && <MyRentals user={user} onClose={() => setShowRentals(false)} />}
          {showAdminRentals && <AdminRentals onClose={() => setShowAdminRentals(false)} />}
          {showFleetManager && <AdminFleetManager onClose={() => setShowFleetManager(false)} />}

          <AnimatePresence>
            {showReport && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 border-t border-gray-100 pt-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Weekly Activity Log</h3>
                  <button 
                    onClick={() => {
                        const blob = new Blob([reportHtml], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Weekly_Report_${new Date().toISOString().split('T')[0]}.html`;
                        a.click();
                    }}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight text-primary hover:underline"
                  >
                    <Download size={12} />
                    Download PDF/HTML
                  </button>
                </div>
                <div 
                  className="xml-activity-report max-h-64 overflow-y-auto rounded-xl border border-gray-50 custom-scrollbar"
                  dangerouslySetInnerHTML={{ __html: reportHtml }} 
                />
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
        
        <div className="bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-md p-4 text-center border-t border-white/50 dark:border-gray-800/50">
           <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest italic">
              "Your Journey, Our Priority"
           </p>
        </div>
      </motion.div>
    </div>
  );
}
