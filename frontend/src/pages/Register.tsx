import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, AlertCircle, Camera } from 'lucide-react';

const Register: React.FC = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // Create reader preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email address.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12 transition-colors duration-300 dark:bg-cyber-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 p-8 rounded-3xl border border-slate-250/60 dark:border-slate-800 bg-white dark:bg-cyber-card-dark shadow-xl"
      >
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-sm text-slate-500">Create an account to contribute comments and share posts</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-semibold text-red-400">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Profile Image Upload Circle preview */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-cyber-dark/40">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-slate-400" />
                )}
              </div>
              <label
                htmlFor="profile-image-upload"
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-cyber-cyan text-white shadow hover:scale-105 cursor-pointer transition-transform"
              >
                <Camera className="h-3.5 w-3.5" />
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <span className="text-[10px] text-slate-500">Upload Avatar (Optional)</span>
          </div>

          <div className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Karthikeya Gurram"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                    dark:border-slate-800 dark:bg-cyber-dark dark:text-white"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="karthikeyanetha7@gmail.com"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                    dark:border-slate-800 dark:bg-cyber-dark dark:text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Password (Min. 6 chars)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                    dark:border-slate-800 dark:bg-cyber-dark dark:text-white"
                />
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple py-3.5 text-xs font-bold text-white shadow-md shadow-cyber-cyan/15 hover:shadow-cyber-cyan/35 hover:brightness-105 transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-xs">
          <span className="text-slate-500">Already have an account? </span>
          <Link to="/login" className="font-bold text-cyber-cyan hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
