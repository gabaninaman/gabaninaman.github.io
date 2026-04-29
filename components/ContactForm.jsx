import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ContactForm() {
  const router = useRouter();
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Pre-fill message if coming from a project page
  useEffect(() => {
    if (router.query.project) {
      setMessage(`Hi! I'm interested in discussing the "${router.query.project}" project. `);
    }
  }, [router.query.project]);

  // Validation function
  const validateForm = (formData) => {
    const newErrors = {};
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!message || message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    return newErrors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setResult("");

    const formData = new FormData(event.target);

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    formData.append("access_key", "d3a970d5-b7ae-4a6c-ba50-b9de6f52bc1d");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("success");
        setMessage("");
        event.target.reset();
        // Auto-hide success message after 5 seconds
        setTimeout(() => setResult(""), 5000);
      } else {
        setResult("error");
      }
    } catch (error) {
      setResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={onSubmit} 
      className="space-y-6"
      aria-label="Contact form"
    >
      {/* Honeypot field for spam protection */}
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
      
      {/* Name Field */}
      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
          className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
            errors.name ? 'border-red-500' : 'border-gray-700'
          }`}
          aria-required="true"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400" role="alert">{errors.name}</p>
        )}
      </div>
      
      {/* Email Field */}
      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          required
          autoComplete="email"
          placeholder="your.email@example.com"
          className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
            errors.email ? 'border-red-500' : 'border-gray-700'
          }`}
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400" role="alert">{errors.email}</p>
        )}
      </div>
      
      {/* What's on your mind - Single creative field */}
      <div>
        <label
          htmlFor="contact-thoughts"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          What's brewing in your mind? <span className="text-red-400">*</span>
        </label>
        <textarea
          id="contact-thoughts"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Got a wild idea? Need a tech wizard? Want to build something awesome together? Or just wanna say hi? Spill it all here... ☕"
          className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none ${
            errors.message ? 'border-red-500' : 'border-gray-700'
          }`}
          aria-required="true"
          aria-invalid={errors.message ? 'true' : 'false'}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-400" role="alert">{errors.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">{message.length} characters</p>
      </div>
      
      {/* Submit Button */}
      <button 
        type="submit"
        disabled={isSubmitting}
        className={`w-full px-8 py-4 rounded-lg font-bold transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-950 ${
          isSubmitting 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
        aria-label={isSubmitting ? "Sending message..." : "Send message"}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message →'
        )}
      </button>
      
      {/* Result Messages */}
      {result === "success" && (
        <div 
          className="p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-center"
          role="alert"
          aria-live="polite"
        >
          <span className="font-medium">✓ Message sent successfully!</span>
          <p className="text-sm text-green-500 mt-1">I'll get back to you as soon as possible.</p>
        </div>
      )}
      
      {result === "error" && (
        <div 
          className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-center"
          role="alert"
          aria-live="polite"
        >
          <span className="font-medium">✗ Something went wrong.</span>
          <p className="text-sm text-red-500 mt-1">Please try again or email me directly.</p>
        </div>
      )}
    </form>
  );
}
