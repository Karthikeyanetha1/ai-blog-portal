import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);

    try {
      const responseMsg = await forgotPassword(email);
      setMessage(responseMsg);
    } catch (err: any) {
      setError(err.message || 'Request failed. Please try again.');
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
        <div className="space-y-2 text-center">
          <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Recover Password</h2>
          <p className="text-sm text-slate-500">Enter your email to receive recovery instructions</p>
        </div>

        {message ? (
          <div className="space-y-6 text-center py-4">
            <div className="flex justify-center text-cyber-cyan">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Request Simulating Successful</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {message} <br />
                Check the backend console logs to copy your simulated recovery credentials link!
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyber-cyan hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-semibold text-red-400">
                <AlertCircle className="h-4.5 w-4.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple py-3.5 text-xs font-bold text-white shadow-md shadow-cyber-cyan/15 hover:shadow-cyber-cyan/35 hover:brightness-105 transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? 'Processing Request...' : 'Send Recovery Instructions'}
              </button>
            </form>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyber-cyan hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
